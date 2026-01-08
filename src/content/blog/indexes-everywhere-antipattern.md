---
title: "Why 'Indexes Everywhere' Destroys Database Performance"
description: "How reflexive indexing silently destroys write throughput, memory locality, and system stability in HTAP and distributed SQL databases."
date: "2026-01-08"
tags: ["Database Performance", "Indexes", "HTAP", "Write Amplification", "SingleStore"]
author: "Shahid Moosa"
slug: "indexes-everywhere-antipattern"
image: "/blog-images/indexes-everywhere-antipattern.png"
---

# Why "Indexes Everywhere" Destroys Database Performance

> [!NOTE]
> This post is Part 5 of the **[Distributed SQL Deep Dive](/blog/distributed-sql-series-overview)** series.

## Content Summary

**Core lessons in this post:**

- **Indexes are not free**—every index multiplies write cost, memory pressure, and replication overhead
- **Write amplification in HTAP systems**—one INSERT can trigger 5-10 index updates, each replicated across nodes
- **Memory locality breaks**—indexes fragment your working set, evicting hot data from cache
- **Analytics workloads don't need indexes**—columnstore scans are faster than index lookups for aggregations
- **"It worked in staging" is a lie**—index costs scale non-linearly with data volume and write rate
- **Secondary indexes in distributed systems**—network amplification makes every index update exponentially expensive
- **The right strategy**—index selectively based on query patterns, not reflexively

If you've ever added an index to "fix" a slow query only to see write throughput collapse, this post explains why.

---

If there's one reflex nearly every engineer develops early, it's this:

> "The query is slow. Add an index."

That reflex works—until it becomes the problem.

In a single-node PostgreSQL database with 100K rows, adding five indexes is harmless. In a distributed HTAP system with 500M rows and 50K writes/second, those same five indexes can destroy your cluster.

This post explains why.

## TL;DR

- **Indexes multiply write cost**—one write becomes N index updates (where N = number of indexes)
- **HTAP systems amplify index overhead**—rowstore + columnstore + replication = 3x-10x amplification
- **Memory is finite**—indexes compete with your data for RAM; more indexes = more cache misses
- **Analytics don't need indexes**—columnar scans are faster than index lookups for aggregations
- **Distributed systems make it worse**—every index update crosses the network and replicates
- **Indexes should be strategic, not reflexive**—add them when read patterns justify the write cost

**Bottom line:** If you index everything, you optimize nothing.

---

## Why Indexes Feel Free (And Why They Are Not)

### The Mental Model That Breaks

In traditional RDBMS courses, you learn:
1. Queries are slow → add an index
2. Index makes reads fast → problem solved
3. Writes "might be a bit slower" → acceptable trade-off

This model works when:
- Data is small (<10M rows)
- Writes are infrequent (<100/sec)
- You're on a single node
- You're not running OLTP + OLAP simultaneously

**In production distributed systems, every assumption breaks.**

### What Actually Happens When You Add an Index

```mermaid
flowchart TD
    W[Write: INSERT INTO orders] --> R1[Rowstore Insert]
    
    R1 --> IDX1[Update Index 1: user_id]
    R1 --> IDX2[Update Index 2: order_date]
    R1 --> IDX3[Update Index 3: status]
    R1 --> IDX4[Update Index 4: product_id]
    R1 --> CS[Columnstore Sync]
    
    IDX1 --> REP1[Replicate Index 1]
    IDX2 --> REP2[Replicate Index 2]
    IDX3 --> REP3[Replicate Index 3]
    IDX4 --> REP4[Replicate Index 4]
    CS --> REPCS[Replicate Columnstore]
    
    REP1 --> NET[Network]
    REP2 --> NET
    REP3 --> NET
    REP4 --> NET
    REPCS --> NET
    
    style W fill:#3b82f6,stroke:#2563eb,color:#f1f5f9
    style R1 fill:#e879f9,stroke:#d946ef,color:#020617
    style NET fill:#ef4444,stroke:#dc2626,color:#f1f5f9
```

**One INSERT statement triggers:**
1. Rowstore insert (1 write)
2. Index updates (N writes, where N = number of indexes)
3. Columnstore sync (1 write, eventually)
4. Replication of all of the above (multiply by replica count)

**Write amplification factor: 5-15x** (depending on indexes and replicas)

### The Hidden Costs

**1. Disk I/O**

Every index update is a disk write. B-tree updates require:
- Read the leaf page
- Modify the page
- Write the page back
- Potentially split pages (more writes)

**2. Memory Pressure**

Indexes compete for buffer pool space. More indexes = less space for actual data = more cache misses.

**3. Replication Lag**

Every index update must replicate. With 10 indexes, you've 10x'd your replication traffic.

**4. Lock Contention**

Index updates acquire locks. More indexes = more lock contention = more waiting.

**5. Recovery Time**

More indexes = more data to rebuild during recovery = longer downtime.

---

## Write Amplification in HTAP Systems

HTAP databases (like SingleStore) maintain **two storage engines**:
- **Rowstore** (transactional, row-oriented)
- **Columnstore** (analytical, columnar)

This doubles the index maintenance burden.

### Example: A "Simple" INSERT

```sql
INSERT INTO events (user_id, event_type, timestamp, amount)
VALUES (12345, 'purchase', NOW(), 99.99);
```

**In PostgreSQL (single storage engine):**
- 1 table write
- 4 index updates (if you have 4 indexes)
- **Total: 5 writes**

**In SingleStore (dual storage):**
- 1 rowstore write
- 4 rowstore index updates
- 1 columnstore sync (asynchronous, but still happens)
- Potentially columnstore index updates
- Replication of all of the above (×2 for HA)

**Total: 10-15 writes**

### The Amplification Formula

```
Write Amplification = (1 + N_indexes) × (1 + N_replicas) × Storage_Engines
```

**Example:**
- 5 indexes
- 2 replicas (primary + secondary)
- 2 storage engines (rowstore + columnstore)

```
Amplification = (1 + 5) × (1 + 2) × 2 = 36x
```

**One INSERT becomes 36 I/O operations.**

---

## HTAP Workload Contention

In HTAP systems, you're running **two workloads simultaneously**:

```mermaid
flowchart LR
    OLTP[OLTP Writes<br/>50K TPS] --> RS[Rowstore]
    OLAP[Analytics Queries] --> CS[Columnstore]
    
    RS -.->|Background Sync| CS
    
    subgraph Resources
        CPU[CPU]
        MEM[Memory]
        IO[Disk I/O]
    end
    
    RS --> CPU
    RS --> IO
    RS --> MEM
    
    CS --> CPU
    CS --> IO
    CS --> MEM
    
    MAINT[Index Maintenance] --> CPU
    MAINT --> IO
    MAINT --> MEM
    
    CPU -.->|Contention| SLOW1[Write Latency ↑]
    IO -.->|Saturation| SLOW2[Query Latency ↑]
    MEM -.->|Pressure| SLOW3[Cache Eviction]
    
    style OLTP fill:#3b82f6,stroke:#2563eb,color:#f1f5f9
    style OLAP fill:#e879f9,stroke:#d946ef,color:#020617
    style MAINT fill:#f59e0b,stroke:#d97706,color:#020617
    style SLOW1 fill:#ef4444,stroke:#dc2626,color:#f1f5f9
    style SLOW2 fill:#ef4444,stroke:#dc2626,color:#f1f5f9
    style SLOW3 fill:#ef4444,stroke:#dc2626,color:#f1f5f9
```

**The problem:** Index maintenance steals resources from both workloads.

### Real Incident

**Context:**
- E-commerce platform
- 8 indexes on `orders` table
- Peak traffic: 60K writes/sec

**What happened:**
1. Black Friday traffic spiked
2. Index maintenance couldn't keep up
3. Write buffer filled
4. Writes started queueing
5. Application timeouts
6. **Outage: 47 minutes**

**Root cause:** Too many indexes consuming CPU + I/O + memory during peak writes.

**Fix:** Dropped 5 indexes that weren't used by queries. Write throughput improved 3x.

---

## Index Maintenance vs Analytics Scans

Here's the paradox: **analytics queries often don't benefit from indexes**.

### Why Columnar Scans Are Fast

In a columnstore, scanning is cheap because:
1. **Columnar compression**—only read needed columns
2. **Vectorized execution**—process data in batches
3. **Parallel scans**—utilize all cores
4. **Predicate pushdown**—filter early

**Example query:**

```sql
SELECT product_category, SUM(revenue)
FROM orders
WHERE order_date > '2026-01-01'
GROUP BY product_category;
```

**With index on `order_date`:**
- Index lookup (random I/O)
- Fetch rows (more random I/O)
- Filter and aggregate

**With columnstore scan:**
- Sequential read of `order_date`, `product_category`, `revenue` columns
- Filter during scan (SIMD)
- Parallel aggregation

**For aggregations over large datasets, the scan is faster.**

### When Indexes Matter

**Indexes help when:**
- Point lookups (`WHERE user_id = 123`)
- Range scans with high selectivity (returning <1% of rows)
- Sorted results (`ORDER BY indexed_column LIMIT 10`)

**Indexes hurt when:**
- Aggregations over large datasets
- Full scans are inevitable
- Write cost > read benefit

---

## Memory Pressure and Cache Eviction

Every index competes for memory.

```mermaid
flowchart TD
    MEM[Total Memory: 128 GB] --> DATA[Active Data<br/>60 GB]
    MEM --> IDX[Indexes<br/>40 GB]
    MEM --> CACHE[Query Working Sets<br/>20 GB]
    MEM --> OVERHEAD[System Overhead<br/>8 GB]
    
    DATA -.->|Hot rows accessed| FAST[Fast: In Memory]
    IDX -.->|Frequent index lookups| SLOW1[Cache Misses]
    
    SLOW1 -.->|Evict Data| EVICT[Data Pages Evicted]
    EVICT -.->|Next Access| DISK[Disk I/O]
    
    style MEM fill:#64748b,stroke:#475569,color:#f1f5f9
    style DATA fill:#10b981,stroke:#059669,color:#020617
    style IDX fill:#f59e0b,stroke:#d97706,color:#020617
    style EVICT fill:#ef4444,stroke:#dc2626,color:#f1f5f9
    style DISK fill:#ef4444,stroke:#dc2626,color:#f1f5f9
```

### The Vicious Cycle

1. **Add indexes to "improve query performance"**
2. Indexes consume memory
3. Less memory for actual data
4. Data pages evicted from cache
5. **Queries slow down** (more disk I/O)
6. "Let's add more indexes!" (repeat)

**The result:** You've optimized yourself into worse performance.

### Real Numbers

**Scenario:**
- Table: 500M rows
- Row size: 200 bytes
- Data size: 100 GB
- Indexes: 5 × 20 GB each = 100 GB
- Available RAM: 128 GB

**With indexes:**
- Data + indexes = 200 GB
- Only 64% fits in memory
- **Constant cache thrashing**

**Without 4 of those indexes:**
- Data + 1 index = 120 GB
- 94% fits in memory
- **Dramatically fewer cache misses**

---

## Replication and Secondary Index Cost

In distributed systems, indexes multiply network traffic.

### Single-Node Replication

**Write to primary:**
1. Insert row
2. Update N indexes
3. Replicate to secondary

**Network cost:** Row + N index updates

**Manageable.**

### Distributed Replication

**Write to sharded cluster:**
1. Insert row (local)
2. Update N local indexes
3. Replicate to local replica
4. If secondary index is global, update across shards
5. Replicate global index updates

**Network cost:** (Row + N local indexes) × replicas + Global index updates × shards × replicas

**Exponential.**

### Example

**Setup:**
- 10 shards
- 2 replicas per shard
- 1 global secondary index on `email` (not sharded)

**One INSERT with a global index:**
1. Write to local shard
2. Replicate to local replica (1 network hop)
3. Update global index (broadcast to all shards)
4. Replicate global index update (1 hop × 10 shards)

**Total network operations:** 1 + 10 + 10 = **21 network operations**

**For one INSERT.**

---

## Why "It Worked in Staging" Is Meaningless

Your staging environment:
- **Data:** 1M rows
- **Write rate:** 100/sec
- **Indexes:** 8
- **Performance:** Great

Production:
- **Data:** 500M rows
- **Write rate:** 50K/sec
- **Indexes:** Same 8
- **Performance:** Disaster

### What Changed?

**1. Index Size**

Staging: 8 indexes × 100 MB each = 800 MB (fits in RAM)  
Production: 8 indexes × 20 GB each = 160 GB (doesn't fit)

**2. Write Amplification**

Staging: 100 writes/sec × 8 indexes = 800 index updates/sec (trivial)  
Production: 50K writes/sec × 8 indexes = 400K index updates/sec (saturates I/O)

**3. Rebalancing Cost**

Staging: B-tree rarely needs rebalancing  
Production: B-tree constantly rebalancing under write pressure

**4. Replication Lag**

Staging: Insignificant  
Production: Indexes cause seconds of replication lag

---

## When Indexes Are Actually the Right Choice

Indexes aren't evil. Reflexive indexing is.

### Good Reasons to Add an Index

**1. High-Selectivity Point Lookups**

```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

**If this query:**
- Runs frequently (thousands of times per second)
- Returns 1 row from millions
- Is latency-sensitive

**Then:** Index `email`

**2. Range Queries with Low Cardinality**

```sql
SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';
```

**If:**
- `user_id` is highly selective (user has ~10 orders in 10M table)
- Query runs often

**Then:** Composite index on `(user_id, status)`

**3. Enforcing Uniqueness**

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

**Necessary for data integrity.**

### Bad Reasons to Add an Index

**1. "This query runs slowly sometimes"**

**Question:** How often? Is it worth the write cost?

**2. "The query plan says it's doing a full scan"**

**Question:** Is a full scan actually slow for this query?

**3. "Indexes are free, right?"**

**Answer:** See this entire post.

**4. "Let's index everything to cover all queries"**

**Result:** Optimize for nothing, destroy write throughput.

---

## What Engineers Usually Get Wrong About Indexes

### Mistake 1: "More Indexes = Faster Database"

**Reality:** More indexes = slower writes, more memory pressure, worse overall performance.

**Fix:** Index based on query analysis, not gut feeling.

### Mistake 2: "Indexes Only Affect Writes"

**Reality:** Indexes consume memory, evicting your working set. This makes *reads* slower too.

**Fix:** Monitor cache hit rates. If they drop after adding indexes, you've made reads slower.

### Mistake 3: "Unused Indexes Are Harmless"

**Reality:** Every index costs write amplification, memory, and replication overhead—whether used or not.

**Fix:** Drop unused indexes. Monitor with:

```sql
SELECT index_name, index_scans
FROM pg_stat_user_indexes
WHERE index_scans = 0;
```

(PostgreSQL example; adapt for your database)

### Mistake 4: "Covering Indexes Eliminate Table Lookups"

**Reality:** In HTAP systems, covering indexes can make things *worse* if analytics queries bypass the columnstore.

**Fix:** Let analytics queries use columnstore scans. Reserve indexes for transactional lookups.

### Mistake 5: "Adding Indexes Can't Break Anything"

**Reality:** I've seen production outages caused by index addition during peak traffic.

**Fix:** Add indexes during low-traffic windows. Monitor write latency and replication lag.

---

## Sideways Failure: When Indexes Destroy Unrelated Queries

In distributed systems, index overhead causes **sideways failures**—symptoms appear far from the root cause.

```mermaid
flowchart LR
    IDX[Heavy Index Maintenance] -->|Consumes| IO[Disk I/O]
    IDX -->|Consumes| MEM[Memory]
    IDX -->|Consumes| NET[Network]
    
    Q1[Unrelated Query] -.->|Starved| IO
    Q1 -.->|Starved| MEM
    Q1 -.->|Starved| NET
    
    IO -.->|Slow| TIMEOUT[Query Timeout]
    MEM -.->|Eviction| CACHE[Cache Misses]
    NET -.->|Congestion| LAG[Replication Lag]
    
    TIMEOUT -.->|Alert| OPS[On-Call Engineer]
    
    OPS -.->|Investigates| Q1
    OPS -.->|Root Cause| IDX
    
    style IDX fill:#ef4444,stroke:#dc2626,color:#f1f5f9
    style Q1 fill:#3b82f6,stroke:#2563eb,color:#f1f5f9
    style OPS fill:#f59e0b,stroke:#d97706,color:#020617
```

**Real scenario:**

1. Someone adds an index on a high-cardinality column
2. Index maintenance saturates disk I/O
3. Unrelated analytics queries start timing out
4. Alert fires: "Dashboard queries slow"
5. Engineer investigates the dashboard queries (wrong place)
6. Root cause: The new index, consuming I/O for write amplification

**Lesson:** Index problems manifest as query problems.

---

## What I'd Do Differently Next Time

### 1. Start With Zero Indexes (Except PKs and UKs)

Don't index preemptively. Let production queries tell you what's needed.

**Process:**
1. Deploy with primary keys and unique constraints only
2. Monitor slow query log
3. Identify frequently-run, high-latency queries
4. Analyze query plans
5. Add indexes strategically

### 2. Track Index Usage Metrics

**For every index, track:**
- Reads per second (beneficial)
- Writes per second (cost)
- Memory footprint
- Age (time since creation)

**Drop indexes where:**
- Reads < 10/sec
- Cost > benefit

### 3. Use Partial Indexes

Instead of:

```sql
CREATE INDEX idx_orders_status ON orders(status);
```

Use:

```sql
CREATE INDEX idx_orders_pending ON orders(status)
WHERE status = 'pending';
```

**Why:** Smaller index, lower maintenance cost, focused on the filter you actually use.

### 4. Avoid Indexes on High-Write Tables

If a table receives heavy writes and your queries can tolerate scans, **don't index it**.

**Example:**  
`event_logs` table with 1M inserts/day. Analytics queries run overnight.

**Bad:** 5 indexes for "query optimization"  
**Good:** No indexes, let batch analytics scan the columnstore

### 5. Schedule Index Maintenance

For large indexes, reindexing can block writes.

**Strategy:**
- Schedule `REINDEX` during maintenance windows
- Use `CONCURRENTLY` option (if available)
- Monitor replication lag during reindexing

### 6. Test Index Changes Under Load

**Before adding an index in production:**
1. Add it to a load-testing environment
2. Simulate production write rate
3. Monitor write latency, memory, I/O
4. If metrics degrade, don't add the index

---

## Final Takeaway

Indexes are a **trade-off**, not a free optimization.

Every index:
- Slows writes
- Consumes memory
- Increases replication lag
- Adds operational complexity

**The right strategy:**  
Add indexes strategically, based on measured query patterns and proven performance improvements—not reflexively.

**If your database has 10+ indexes per table, you've probably over-indexed.**

Audit them. Drop the unused ones. Your write throughput will thank you.

---

## Further Reading

- [Lessons Learned Running SingleStore in Production](/blog/singlestore-production-lessons)
- [Understanding SingleStore's Execution Engine](/blog/singlestore-execution-engine)
- [How SingleStore Handles Real-Time Analytics at Scale](/blog/singlestore-real-time-analytics)
- [Debugging Slow Database Queries](/blog/debugging-slow-database-queries)

---
---
