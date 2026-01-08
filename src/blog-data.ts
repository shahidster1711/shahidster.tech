export const blogPosts = [
  {
    id: "distributed-database-systems",
    title: "Distributed Database Systems: Architecture, Performance, and Reliability",
    description: "A practical guide to distributed database systems covering architecture, performance, reliability, and real-world trade-offs.",
    date: "2025-12-25",
    tags: ["Distributed Systems", "SQL", "Architecture", "Performance"],
    content: `
# Distributed Database Systems: Architecture, Performance, and Reliability

Distributed databases power modern applications—but they introduce trade-offs around **latency, complexity, and failure modes**.

This pillar connects deep dives on:
- Architecture
- Performance
- Storage engines
- Reliability
- Production lessons

## Core Topics

- [Distributed SQL Architecture](/blog/distributed-sql-architecture)
- [Debugging Query Performance](/blog/query-performance-debugging)
- [Row vs Column Storage](/blog/row-vs-column-storage)
- [Real-Time Analytics Trade-Offs](/blog/real-time-analytics-tradeoffs)
- [High Availability Reality](/blog/high-availability-databases)
`
  },
  {
    id: "high-availability-databases",
    title: "High Availability Is a Spectrum, Not a Feature Flag",
    description: "Explore what high availability really means in database systems, including RPO, RTO, failover strategies, and real-world trade-offs.",
    date: "2025-12-27",
    tags: ["Database", "High Availability", "SRE", "Architecture"],
    content: `
## Introduction

High availability (HA) is often marketed as a checkbox feature. In reality, it's a **spectrum of design decisions** that impact downtime, data loss, and operational complexity.

### RPO and RTO: What They Really Mean

- **Recovery Point Objective (RPO)** — maximum acceptable data loss after failure.
- **Recovery Time Objective (RTO)** — maximum acceptable time until services resume.

Understanding these goals is essential before choosing an architecture or database.

## Why Replication Alone Isn’t Enough

Replication increases redundancy but introduces:

- Replica lag
- Split-brain scenarios
- Complex failovers

Systems must be designed and **tested** for real failures, not just theoretical architecture.

## Designing for Failures

Implementing HA requires:

- Regular failover drills
- Clear recovery plans
- Observability into replica health

Failover testing exposes critical hidden assumptions.

## Conclusion

High availability isn’t a simple toggle. It’s a **series of trade-offs aligned with business tolerance for downtime and data loss**.
`
  },
  // Placeholder posts for the Cluster structure
  {
    id: "distributed-sql-architecture",
    title: "How Distributed SQL Databases Work",
    description: "Learn how distributed SQL databases execute queries, shard data, and scale horizontally.",
    date: "2026-01-01",
    tags: ["SQL", "Sharding", "Scalability"],
    content: `
# How Distributed SQL Databases Work

Distributed SQL databases divide responsibility between **coordinators** and **workers**.

## Key Concepts
- Query planning vs execution
- Data sharding trade-offs
- Network amplification

Using systems like SingleStore as reference points helps explain industry-wide patterns—not vendor specifics.

[Related: Debugging Query Performance](/blog/query-performance-debugging)
`
  },
  {
    id: "query-performance-debugging",
    title: "How to Debug Slow Database Queries",
    description: "A step-by-step framework for identifying bottlenecks, inspecting query plans, and validating fixes.",
    date: "2026-01-08",
    tags: ["Performance", "Debugging", "SQL"],
    content: `
# How to Debug Slow Database Queries

## Step-by-Step Framework
- Identify system bottleneck
- Inspect query plans
- Fix access patterns
- Validate under real load

[Related: Row vs Column Storage](/blog/row-vs-column-storage)
`
  }
];