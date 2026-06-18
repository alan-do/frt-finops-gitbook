---
title: "CTO Questions"
description: "Key Questions Regarding Scope, MVPs, and Boundaries"
---

# Key Questions (CTO Review)

To ensure the FinOps project is on the right track and meets expectations for Q3/2026, the following questions need to be clarified regarding project boundaries, progress, and execution authority.

## 1. Current State & Resource Allocation
* **Q:** What is the current FinOps methodology?
  * Does each chain/project self-report their costs?
  * Is there a tooling system that automatically fetches information?
  * Or another method (Other)?
* **Q:** What is the actual reality of resource allocation across chains/projects, and what is the level of resource interdependence/coupling?
  * Is it completely transparent with absolute decentralized governance?
  * Will we need to solve the problem of calculating separate costs within shared buckets?
  * Or another reality (Other)?

## 2. Project Boundary & Scope
* **Q:** What is the exact boundary of the FinOps system in this phase? Should the system stop at Observability, or must it include Actionability (e.g., automatically pausing/limiting resources when budgets are exceeded)?
* **Q:** Who are the primary end-users of the system during the MVP phase? Are they CTO/CFOs for high-level overviews, or Product Owners/Dev Leads for day-to-day cost optimization?

## 3. Specific MVPs and Immediate Features
* **Q:** With the current 1.5 FTE resources, which MVP features are the highest priority?
  * Proposed MVP 1: **Centralized Dashboard** (Tracking costs for the 1-2 largest services, such as AWS and OpenAI).
  * Proposed MVP 2: **Basic Alert System** (Sending alerts via internal chat/Email when costs spike significantly compared to the baseline).
* **Q:** Is it permissible to use available commercial LLMs (GPT-4/Claude) via API to quickly develop automated reporting features, rather than spending time training an internal model?

## 4. Project Progress (Timeline & Milestones)
* **Q:** What is the expected timeline for the first Demo version? If mid-July (July 18th) is targeted for the Demo, does the MVP scope proposed above meet expectations?
* **Q:** Are there mandatory requirements for rolling out to all teams across the company, or should the Q3 rollout be limited to a pilot run with 1-2 specific teams?

## 5. Data Access & Permissions
* **Q:** What is the mechanism for the FinOps team to acquire centralized, Read-only/Billing Access to other teams' Cloud/SaaS accounts quickly? A standardized top-down process is needed to prevent fragmented permission requests from slowing down progress.

## 6. Measuring ROI & Business Value
* **Q:** To calculate the ROI of AI projects, FinOps can track the Cost, but Business Value metrics (such as active users, revenue generated, hours saved) are required. Where will this data be sourced from, and what is the coordination process with product teams?
