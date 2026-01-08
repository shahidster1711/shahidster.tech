---
title: "Understanding SingleStore's Execution Engine (for Humans)"
description: "How distributed SQL execution actually works—query planning, data movement, joins, aggregations, and why your queries sometimes explode in cost."
date: "2026-01-08"
tags: ["SingleStore", "Query Execution", "Distributed Systems", "SQL", "Performance"]
author: "Shahid Moosa"
slug: "singlestore-execution-engine"
image: "/blog-images/singlestore-execution-engine.png"
---

# Understanding SingleStore's Execution Engine (for Humans)

> [!NOTE]
> This post is Part 3 of the **[Distributed SQL Deep Dive](/blog/distributed-sql-series-overview)** series.

Most engineers treat distributed SQL databases as "PostgreSQL, but faster and spread across many nodes." This mental model fails the moment you hit production and discover that a simple JOIN that ran in 100ms on your laptop now takes 30 seconds at scale.

The execution engine is why.

## TL;DR

- **Distributed execution has coordinators and workers**—aggregators plan and merge, leaves execute
- **Query planning is cheap; data movement is expensive**—the network is your bottleneck
- **Joins explode when data isn't co-located**—mismatched shard keys = reshuffling gigabytes
- **Aggregations fan-in**—partial results on leaves, final merge on aggregator
- **"It worked in staging" means nothing**—execution behavior changes with data size and distribution
- **Most "slow database" complaints are actually data movement problems**

Understanding execution gives you predictive power over query performance.

---

## The Mental Model: Coordinators vs Workers

In PostgreSQL, there's one process executing your query.

In a distributed system like SingleStore, your query runs across **two layers**:

```mermaid
%% caption: Distributed SQL Execution Architecture illustrating Aggregators dispatching subqueries to Leaves and merging partial results.
flowchart TB
    CLIENT[Client Application]
    
    subgraph Aggregator Layer
        AGG[Aggregator Node]
    end
    
    subgraph Leaf Layer
        L1[Leaf 1<br/>Shard A]
        L2[Leaf 2<br/>Shard B]
        L3[Leaf 3<br/>Shard C]
    end
    
    CLIENT -->|Send Query| AGG
    
    AGG -->|Parse & Plan| AGG
    AGG -->|Dispatch| L1
    AGG -->|Dispatch| L2
    AGG -->|Dispatch| L3
    
    L1 -->|Partial Results| AGG
    L2 -->|Partial Results| AGG
    L3 -->|Partial Results| AGG
    
    AGG -->|Merge & Return| CLIENT
    
    style CLIENT fill:#3b82f6,stroke:#2563eb,color:#f1f5f9
    style AGG fill:#f59e0b,stroke:#d97706,color:#020617
    style L1 fill:#e879f9,stroke:#d946ef,color:#020617
    style L2 fill:#e879f9,stroke:#d946ef,color:#020617
    style L3 fill:#e879f9,stroke:#d946ef,color:#020617
```

### Aggregators (Coordinators)

**Role:** Planning and merging

**What they do:**
- Parse SQL
- Build execution plan
- Dispatch subqueries to leaves
- Merge partial results
- Return final result to client

**What they DON'T do:**
- Store data (usually)
- Execute full table scans
- Do heavy computation (unless necessary)

### Leaves (Workers)

**Role:** Data storage and local execution

**What they do:**
- Store data shards
- Execute local scans
- Perform local joins (if data is co-located)
- Compute partial aggregations
- Send results to aggregator

**Key insight:** Each leaf only sees its own shard. It has no idea what data is on other leaves.

---

## Query Planning vs Query Execution

This is where most engineers get confused.

### Planning (Cheap)

The aggregator:
1. Parses your SQL
2. Figures out which tables are involved
3. Determines which shards have the data
4. Decides how to split the work
5. Generates a plan

**Cost:** Milliseconds  
**Network traffic:** Zero

### Execution (Expensive)

The real work:
1. Aggregator sends plan to leaves
2. Leaves scan their local data
3. Leaves execute local operations (filters, joins, aggregations)
4. Leaves send results back to aggregator
5. Aggregator merges results

**Cost:** Seconds to minutes  
**Network traffic:** Gigabytes (potentially)

```mermaid
%% caption: Typical Query Lifecycle highlighting the millisecond-scale planning vs potentially second-scale execution involving local leaf scans and remote results merging.
sequenceDiagram
    participant C as Client
    participant A as Aggregator
    participant L1 as Leaf 1
    participant L2 as Leaf 2
    
    C->>A: SELECT * FROM orders WHERE user_id = 123
    
    Note over A: Parse (1ms)
    Note over A: Plan (2ms)
    
    A->>L1: Scan orders (shard 1)
    A->>L2: Scan orders (shard 2)
    
    Note over L1: Local scan (50ms)
    Note over L2: Local scan (50ms)
    
    L1-->>A: 100 rows
    L2-->>A: 150 rows
    
    Note over A: Merge (5ms)
    
    A-->>C: 250 rows
```

**Total time:** ~60ms  
**Planning:** 3ms  
**Execution:** 57ms

The plan is not the problem. The data movement is.

---

## Where Data Actually Moves (And Why That's Expensive)

In a single-node database, data moves from disk to CPU to RAM.

In a distributed database, data also moves **across the network**.

### Three Types of Data Movement

**1. Local scan (no network)**

```sql
SELECT * FROM orders WHERE order_date > '2026-01-01';
```

Each leaf scans its own shard. Results go to aggregator.

**Network cost:** Only the results (could be small)

**2. Broadcast (aggregator → all leaves)**

```sql
SELECT o.*, u.name 
FROM orders o 
JOIN users u ON o.user_id = u.user_id;
```

If `users` is small and not sharded, the aggregator broadcasts the entire table to all leaves.

**Network cost:** `size(users) × number_of_leaves`

**3. Reshuffle (leaf → leaf)**

```sql
SELECT o.*, p.name
FROM orders o
JOIN products p ON o.product_id = p.product_id;
```

If `orders` is sharded by `order_id` and `products` is sharded by `product_id`, data must be reshuffled.

**Network cost:** `size(orders) + size(products)` (potentially)

### The Hidden Cost

Moving 1GB across a network:
- **10 Gbps network:** ~1 second
- **1 Gbps network:** ~10 seconds

But you're not just moving data once. You're:
- Serializing it
- Compressing it
- Sending it
- Decompressing it
- Deserializing it

**Real time:** 2-5x the naive calculation.

This is why queries that work fine in staging (small data, single node) explode in production.

---

## Joins in a Distributed System

### Co-Located Join (Fast)

Both tables are sharded on the join key:

```sql
-- orders sharded by user_id
-- user_activity sharded by user_id
SELECT o.order_id, a.activity
FROM orders o
JOIN user_activity a ON o.user_id = a.user_id;
```

```mermaid
%% caption: Co-Located Join (Fast): When tables are sharded on the same key, leaves can perform joins locally without any data moving across the network.
flowchart LR
    A[Aggregator] -->|Dispatch| L1[Leaf 1]
    A -->|Dispatch| L2[Leaf 2]
    
    subgraph L1
        O1[Orders<br/>user_id 1-100]
        A1[Activity<br/>user_id 1-100]
        O1 -.->|Local Join| A1
    end
    
    subgraph L2
        O2[Orders<br/>user_id 101-200]
        A2[Activity<br/>user_id 101-200]
        O2 -.->|Local Join| A2
    end
    
    L1 -->|Results| A
    L2 -->|Results| A
    
    style A fill:#f59e0b,stroke:#d97706,color:#020617
    style L1 fill:#e879f9,stroke:#d946ef,color:#020617
    style L2 fill:#e879f9,stroke:#d946ef,color:#020617
```

**Network cost:** Minimal (just results)  
**Execution:** Parallel on each leaf

**This is the ideal case.**

### Reshuffle Join (Slow)

Tables are sharded on different keys:

```sql
-- orders sharded by order_id
-- products sharded by product_id
SELECT o.order_id, p.name
FROM orders o
JOIN products p ON o.product_id = p.product_id;
```

```mermaid
%% caption: Reshuffle Join (Slow): When join keys don't match shard keys, data must be re-partitioned across the network, creating a massive performance bottleneck.
flowchart TB
    A[Aggregator] -->|Dispatch| L1[Leaf 1]
    A -->|Dispatch| L2[Leaf 2]
    
    L1 -->|Scan Orders| L1
    L2 -->|Scan Orders| L2
    
    L1 -.->|Reshuffle by product_id| SHUFFLE[Network]
    L2 -.->|Reshuffle by product_id| SHUFFLE
    
    SHUFFLE -.->|Repartitioned Data| L1
    SHUFFLE -.->|Repartitioned Data| L2
    
    L1 -->|Join Locally| L1
    L2 -->|Join Locally| L2
    
    L1 -->|Results| A
    L2 -->|Results| A
    
    style A fill:#f59e0b,stroke:#d97706,color:#020617
    style L1 fill:#e879f9,stroke:#d946ef,color:#020617
    style L2 fill:#e879f9,stroke:#d946ef,color:#020617
    style SHUFFLE fill:#ef4444,stroke:#dc2626,color:#f1f5f9
```

**What happens:**
1. Each leaf scans its local orders
2. Data is reshuffled across the network by `product_id`
3. Each leaf now has orders + products for the same product IDs
4. Join happens locally
5. Results go to aggregator

**Network cost:** Entire dataset moves across the network  
**Time:** 10-100x slower than co-located join

**This is the failure mode.**

### Broadcast Join (Medium)

One table is small:

```sql
-- orders is large, sharded
-- order_status is tiny (10 rows)
SELECT o.*, s.description
FROM orders o
JOIN order_status s ON o.status_id = s.status_id;
```

**What happens:**
1. Aggregator broadcasts `order_status` (tiny) to all leaves
2. Each leaf joins locally

**Network cost:** `size(small_table) × number_of_leaves`  
**Time:** Fast (if the small table is actually small)

---

## Aggregations and Fan-In

Aggregations in distributed systems use **partial → final** pattern.

```sql
SELECT user_id, COUNT(*), SUM(amount)
FROM orders
GROUP BY user_id;
```

```mermaid
%% caption: Aggregation Fan-In: Partial aggregates are computed locally on leaves and then merged on the aggregator for final results, distributing the computational load.
flowchart TB
    A[Aggregator]
    
    L1[Leaf 1] -->|Partial: user_id=1, count=50, sum=1000| A
    L2[Leaf 2] -->|Partial: user_id=1, count=30, sum=600| A
    L3[Leaf 3] -->|Partial: user_id=2, count=40, sum=800| A
    
    A -->|Combine| FINAL[Final: user_id=1, count=80, sum=1600<br/>user_id=2, count=40, sum=800]
    
    style A fill:#f59e0b,stroke:#d97706,color:#020617
    style L1 fill:#e879f9,stroke:#d946ef,color:#020617
    style L2 fill:#e879f9,stroke:#d946ef,color:#020617
    style L3 fill:#e879f9,stroke:#d946ef,color:#020617
    style FINAL fill:#10b981,stroke:#059669,color:#020617
```

**Execution:**

**On each leaf:**
```sql
SELECT user_id, COUNT(*) as cnt, SUM(amount) as total
FROM orders
WHERE <local_shard>
GROUP BY user_id;
```

**On aggregator:**
```sql
-- Merge partial results
SELECT user_id, SUM(cnt), SUM(total)
FROM <partial_results>
GROUP BY user_id;
```

### Why This Matters

**Aggregations that work:** `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`

**Aggregations that don't work well:** `DISTINCT`, `MEDIAN`, `PERCENTILE`

Why?

`COUNT DISTINCT` can't be easily combined from partial results. The aggregator needs to see all unique values.

**Example:**

```sql
SELECT COUNT(DISTINCT user_id) FROM orders;
```

**What happens:**
1. Each leaf sends all unique `user_id` values to aggregator
2. Aggregator deduplicates

**Network cost:** Potentially gigabytes (all unique IDs)

---

## Why "It Worked in Staging" Means Nothing

Your staging environment:
- **Data:** 1GB
- **Nodes:** 1 leaf
- **Query:** Fast

Production:
- **Data:** 1TB
- **Nodes:** 10 leaves
- **Query:** Timeout

What changed?

### 1. Data Movement Scales Non-Linearly

**Staging:**
- No reshuffling (single node)
- No network overhead
- All data in memory

**Production:**
- Reshuffling 100GB across network
- Network becomes bottleneck
- Data doesn't fit in memory

### 2. Query Plans Change

The query planner chooses different strategies based on:
- Table sizes
- Data distribution
- Available memory

**Staging plan:** Broadcast join  
**Production plan:** Reshuffle join (because the "small" table is now 50GB)

### 3. Sharding Matters

**Staging:** Single shard, no coordination  
**Production:** 10 shards, coordination overhead, potential skew

---

## The Diagram That Makes Everything Click

This is the execution model you need in your head:

```mermaid
%% caption: Full Execution Flow: A comprehensive view of query planning, dispatching, local scans, optional reshuffling, and final results merging.
flowchart TD
    Q[Query] --> AGG[Aggregator]
    
    AGG -->|1. Parse & Plan| PLAN[Execution Plan]
    
    PLAN -->|2. Dispatch| L1[Leaf 1]
    PLAN -->|2. Dispatch| L2[Leaf 2]
    PLAN -->|2. Dispatch| L3[Leaf 3]
    
    L1 -->|3a. Local Scan| L1DATA[Local Data]
    L2 -->|3a. Local Scan| L2DATA[Local Data]
    L3 -->|3a. Local Scan| L3DATA[Local Data]
    
    L1DATA -.->|3b. Reshuffle?| NET[Network]
    L2DATA -.->|3b. Reshuffle?| NET
    L3DATA -.->|3b. Reshuffle?| NET
    
    NET -.->|3c. Repartition| L1
    NET -.->|3c. Repartition| L2
    NET -.->|3c. Repartition| L3
    
    L1 -->|4. Partial Results| AGG
    L2 -->|4. Partial Results| AGG
    L3 -->|4. Partial Results| AGG
    
    AGG -->|5. Merge| RESULT[Final Result]
    
    style AGG fill:#f59e0b,stroke:#d97706,color:#020617
    style L1 fill:#e879f9,stroke:#d946ef,color:#020617
    style L2 fill:#e879f9,stroke:#d946ef,color:#020617
    style L3 fill:#e879f9,stroke:#d946ef,color:#020617
    style NET fill:#ef4444,stroke:#dc2626,color:#f1f5f9
    style RESULT fill:#10b981,stroke:#059669,color:#020617
```

**Key insight:** Steps 3b-3c (reshuffle) are optional—but when they happen, they dominate execution time.

**Your goal:** Design schemas and queries that avoid reshuffling.

---

## Failure Modes Engineers Misattribute to "Slow Databases"

### Failure Mode 1: "The Database Is Slow"

**Symptom:** Query takes 30 seconds

**Actual cause:** Reshuffle join moving 50GB across network

**Fix:** Shard tables on the join key

### Failure Mode 2: "High CPU on Database"

**Symptom:** Database CPU at 90%

**Actual cause:** Aggregator is merging 10M rows from leaves

**Fix:** Add `LIMIT` clause, or filter earlier

### Failure Mode 3: "Queries Work Locally But Not in Production"

**Symptom:** Local query: 100ms. Production: timeout.

**Actual cause:** Query plan changed because table sizes are different

**Fix:** Test with production-scale data

### Failure Mode 4: "Adding Indexes Didn't Help"

**Symptom:** Added index, query still slow

**Actual cause:** Query is network-bound, not CPU-bound

**Fix:** Optimize data movement, not index structure

### Failure Mode 5: "RAM Upgrade Didn't Help"

**Symptom:** Doubled RAM, no improvement

**Actual cause:** Query is bottlenecked on network, not memory

**Fix:** Reduce data movement

---

## Sideways Failure: One Query, Cluster-Wide Impact

The execution engine has **shared resources**:

```mermaid
%% caption: Sideways Failure Pattern: How a single resource-intensive query can saturate network and CPU, starving normal queries and impacting the entire cluster.
flowchart LR
    Q1[Expensive Query] -->|Consumes| NET[Network Bandwidth]
    Q1 -->|Consumes| MEM[Memory]
    Q1 -->|Consumes| CPU[CPU]
    
    Q2[Normal Query] -.->|Starved| NET
    Q2 -.->|Starved| MEM
    Q2 -.->|Starved| CPU
    
    NET -.->|Contention| SLOW1[Q2 Slow]
    MEM -.->|Pressure| SLOW2[OOM Risk]
    CPU -.->|Saturation| SLOW3[Queueing]
    
    SLOW1 -.->|Alert| OPS[On-Call Engineer]
    
    OPS -.->|Investigates| Q2
    OPS -.->|Root Cause| Q1
    
    style Q1 fill:#ef4444,stroke:#dc2626,color:#f1f5f9
    style Q2 fill:#3b82f6,stroke:#2563eb,color:#f1f5f9
    style OPS fill:#f59e0b,stroke:#d97706,color:#020617
```

**What happens:**

1. One expensive query starts reshuffling 100GB
2. Network saturates
3. Other queries queue, waiting for network bandwidth
4. Application sees "slow database"
5. Alert fires
6. Engineer investigates the *symptom* (slow queries)
7. Root cause is the *expensive query* that started it all

**The pattern:** In distributed systems, symptoms appear far from causes.

---

## What I'd Do Differently Next Time

### 1. Test Queries at Production Scale

Don't trust staging. Use production data size, even if it's in a dev environment.

**Tooling:**
- `EXPLAIN` on production (read-only)
- Synthetic data generators
- Cloned production database (sanitized)

### 2. Choose Shard Keys Based on Join Patterns

Shard key is the most important schema decision.

**Ask:**
- What are the most common joins?
- Can I co-locate data for those joins?
- What's the cardinality of the shard key?

**Bad:** Shard on `order_id` when you frequently join with `user_id`  
**Good:** Shard on `user_id` if most queries filter or join on users

### 3. Monitor Data Movement, Not Just CPU

**Track:**
- Network bytes sent/received per query
- Reshuffle frequency
- Broadcast sizes

**Alert when:**
- A query moves >10GB
- Network bandwidth exceeds 70%
- Reshuffle operations spike

### 4. Use `EXPLAIN` Before Every Deploy

```sql
EXPLAIN FORMAT=JSON 
SELECT o.*, p.name 
FROM orders o 
JOIN products p ON o.product_id = p.product_id;
```

**Look for:**
- `"exchange"` (data movement between nodes)
- `"broadcast"` (full table sent to all nodes)
- `"repartition"` (data reshuffled)

If you see any of these, understand the cost.

### 5. Add Query Limits by Default

```sql
-- Bad: unbounded
SELECT * FROM orders WHERE user_id = 123;

-- Good: explicit limit
SELECT * FROM orders WHERE user_id = 123 LIMIT 1000;
```

Limits prevent accidental full-table scans.

### 6. Separate OLTP and OLAP Workloads

Don't mix:
- Transactional queries (point lookups)
- Analytical queries (full scans, aggregations)

**Why:** They have different execution patterns and resource needs.

**Solution:** Replicate data to separate clusters.

---

## Final Takeaway

Understanding the execution engine gives you **predictive power**.

You can look at a query and know:
- Will it reshape data?
- How much network traffic will it generate?
- Why it might work locally but fail in production?

The execution engine isn't magic.  
It's coordinators dispatching work, workers executing locally, and network moving data.

**Optimize for that, and your queries will scale.**

---

## Further Reading

- [Lessons Learned Running SingleStore in Production](/blog/singlestore-production-lessons)
- [SingleStore vs PostgreSQL: When Distributed SQL Actually Wins](/blog/singlestore-vs-postgresql)
- [How SingleStore Handles Real-Time Analytics at Scale](/blog/singlestore-real-time-analytics)

---

**Have execution engine questions?** [Email me](mailto:connect2shahidmoosa@gmail.com) or connect on [LinkedIn](https://linkedin.com).

