# ArvyaX Journal System - Architecture

This document answers the specific technical questions regarding scaling, cost, caching, and security for the AI-Assisted Journal System.

### 1. How would you scale this to 100k users?
To scale from a small user base to 100k+ active users:
- **Load Balancing:** Deploy the Next.js application across multiple instances (e.g., using Kubernetes or Vercel) with a Load Balancer (Nginx/AWS ELB) to distribute traffic.
- **Database Scaling:** Transition from a single MongoDB instance to a **Sharded Cluster**. Shard the `JournalEntry` collection by `userId` to ensure that write/read operations are distributed across multiple shards.
- **Asynchronous LLM Processing:** Instead of making synchronous calls to Gemini during the request-response cycle, use a **Message Queue** (RabbitMQ/SQS). When a user submits an entry, push a job to the queue. A worker service then processes the LLM analysis in the background and updates the DB, notifying users via WebSockets or polling.
- **Microservices:** Decouple the "Insights Engine" and "Emotion Analysis Service" into independent microservices to scale them separately based on demand.

### 2. How would you reduce LLM cost?
- **Analysis Caching:** Use Redis to store analysis results for identical or highly similar text snippets.
- **Model Tiering:** Use high-performance models (Gemini Pro/Flash 1.5) only for complex entries. For short, simple entries, use smaller, cheaper models (Gemini Flash) or even fine-tuned local models (Llama 3 tiny/Mistral).
- **Batch Processing:** For historical data insights, process entries in batches rather than individually to minimize overhead.
- **Selective Analysis:** Allow users to choose if they want "Advanced AI Analysis" or just save the entry, reducing unnecessary API calls.

### 3. How would you cache repeated analysis?
- **Redis Strategy:** Implement a hashing system where the SHA-256 hash of the sanitized `text` is used as a key in **Redis**. 
- **Lookup Flow:** Before calling the LLM API, check if `analysis:hash(text)` exists in Redis. If it does, return the cached result.
- **TTL:** Set a high Time-To-Live (TTL) for these caches since emotional content of the same text is unlikely to change.
- **Global Cache:** For common keywords/summaries across sessions, maintain a global keyword dictionary to avoid re-summarizing common nature-related phrases.

### 4. How would you protect sensitive journal data?
- **Encryption at Rest:** Ensure the MongoDB database uses AES-256 encryption at rest (MDB Atlas handles this by default).
- **Encryption in Transit:** Enforce HTTPS (TLS 1.3) for all communication between the client and server.
- **Application Layer Encryption (ALE):** For highly sensitive entries, encrypt the `text` field specifically using a user-derived key *before* storing it in the database. Even if the DB is compromised, the journal content remains encrypted.
- **PII Scrubbing:** Before sending text to third-party LLMs (like Gemini), use a middleware to scrub Personally Identifiable Information (PII) like names, phone numbers, or addresses.
- **JWT & RBAC:** Implement robust authentication (e.g., NextAuth.js) and Role-Based Access Control to ensure users can only access their own `userId` data.

---
*Architecture Review - ArvyaX Full-Stack Assignment.*
