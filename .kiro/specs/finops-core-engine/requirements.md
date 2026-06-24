# Requirements Document

## Introduction

The FinOps Core Engine is the deterministic, testable foundation of the FRT FinOps Platform. It delivers the framework and contracts for ingesting cloud billing data, normalizing it to the official FOCUS column standard, enforcing data quality with a fail-closed policy, and allocating cost to teams through a 100% rule-based (non-AI) engine.

The core targets **FOCUS 1.2 as the mandatory baseline** for normalization and conformance, because most provider exports (AWS CUR 2.0, Azure, GCP) currently emit FOCUS 1.2. FOCUS 1.4-only columns (e.g. the richer Allocation group, Capacity Reservation) are treated as OPTIONAL/nullable extensions and are populated when a provider supplies them. FPT Cloud has no native FOCUS export, so its connector must transform 100% of its raw billing into FOCUS and be gated by a FOCUS conformance check before any downstream processing.

This phase focuses on **core logic correctness and contracts**, not infrastructure provisioning. Repository interfaces are defined and backed by stubbed/local implementations. A FOCUS-based connector adapter contract plus a mock reference connector are in scope; concrete vendor connectors are not. The AI Intelligence layer, Agent Automation layer, dashboards, and budget alerting are explicitly out of scope for this phase.

Two architecture principles govern every requirement: **Data Correctness First** (no incorrect data may be persisted; the pipeline fails closed) and **Deterministic Allocation** (all cost attribution is rule-based and reproducible, with no AI involved in the calculation).

Reference documents: `pages/architecture/sdd.en.mdx` (UC-01 Ingestion, UC-02 Allocation), `pages/architecture/erd.en.mdx` (FOCUS data model and column mapping), `pages/architecture/index.en.mdx` (HLD).

## Out of Scope (and Why)

This phase deliberately excludes the following, in line with the post-checkpoint direction to build the deterministic core first and add resources/connectors later as FOCUS-based add-ons. These exclusions also directly address the operational-complexity risks raised in the independent (non-AI) HLD audit:

- **Streaming infrastructure (Kafka):** Daily batch billing does not generate streaming throughput, and replayability is already provided by the immutable S3 raw zone. Deferred until a genuine near-real-time multi-source streaming need exists. *(Audit Risk #2)*
- **Workflow orchestration (Temporal) and the Agent Automation layer:** Only needed for Human-in-the-Loop auto-remediation in a later phase. *(Audit Risks #1, #6)*
- **AI Intelligence layer (NLQ, summaries, recommendations):** Added only after the deterministic data is proven trustworthy. *(Audit Risk #1)*
- **Real-time anomaly detection:** Cloud cost data is delayed 6–24h; "real-time" only applies to usage metrics, not cost. The core makes no real-time SLA promise. *(Audit Risk #3)*
- **Concrete vendor connectors, dashboards, budget alerting, and real infrastructure provisioning.**

The core itself runs entirely on in-memory repository implementations, so none of the excluded infrastructure is required to develop, test, or prove the engine.

## Glossary

- **Core_Engine**: The overall FinOps Core Engine system implemented in NestJS/TypeScript, comprising the ingestion, normalization, data quality, and allocation components.
- **Connector_Adapter**: The abstract contract (interface/abstract class) that every cloud billing connector implements, exposing `fetchRaw()` and `mapToFocus()` operations.
- **Mock_Connector**: A reference implementation of the Connector_Adapter used for testing, returning deterministic in-memory billing data with no external dependencies.
- **Ingestion_Pipeline**: The orchestrated sequence that invokes a Connector_Adapter, runs normalization, runs data quality checks, and persists results.
- **ETL_Normalizer**: The component that maps raw vendor billing records to the official FOCUS schema (FOCUS 1.2 mandatory baseline, with FOCUS 1.4 columns optional).
- **FOCUS_Record**: A billing record conforming to the official FOCUS column standard as defined by the `FOCUS_NORMALIZED` model. It carries the FOCUS-named columns: BilledCost, EffectiveCost, ProviderName, SubAccountId, ServiceCategory, ServiceSubcategory, ServiceName, ResourceId, ResourceName, ChargeCategory, BillingCurrency, ConsumedQuantity, ConsumedUnit, PricingUnit, Tags, RegionId/RegionName, and the Timeframe columns ChargePeriodStart, ChargePeriodEnd, BillingPeriodStart, BillingPeriodEnd. ServiceCategory is the canonical FOCUS domain; ServiceSubcategory carries the raw FPT/provider group.
- **FOCUS_Conformance_Check**: A gate that validates the ETL output against the FOCUS 1.2 mandatory column set (column presence + datatype) before the DQ_Framework runs. It fails closed: non-conformant output halts the pipeline before DQ and before any persistence.
- **DQ_Framework**: The Data Quality framework that evaluates freshness, completeness, and consistency before any normalized or allocated data is persisted.
- **Freshness_Check**: A DQ check verifying that expected billing data for the target billing period is present.
- **Completeness_Check**: A DQ check verifying that the normalized record count and totals match the raw source record count and totals.
- **Consistency_Check**: A DQ check (zero-sum) verifying that, within each Currency_Group, the sum of normalized BilledCost equals the raw source total cost for that currency.
- **DQ_Result**: The structured outcome of the DQ_Framework, indicating pass or fail and, on failure, the failing dimension and detail.
- **Allocation_Engine**: The deterministic rule-based component that attributes each FOCUS_Record to a team.
- **Allocation_Rule**: A configured rule with a type (tag-based, account-based, shared-cost), a priority (lower number = higher priority), match criteria, a target team, and a split method.
- **Allocated_Record**: A FOCUS_Record enriched with TeamID, BusinessUnit, Environment, and the official FOCUS Allocation columns: AllocatedMethodId (the allocation method, e.g. tag-based/account-based/shared-cost), AllocatedMethodDetails (method-specific detail; the internal split_ratio for shared-cost rows maps here), AllocatedResourceId (the resource the cost is allocated from), and AllocatedTags (the tags that drove the allocation).
- **Unallocated_Bucket**: A reserved system team identifier (`__UNALLOCATED__`) that receives any cost which no configured Allocation_Rule attributes to a real team — including idle/overhead of shared resources, records with missing telemetry, and records with missing or malformed tags. It makes orphan cost visible instead of letting it silently break the zero-sum invariant.
- **Largest_Remainder_Split**: A deterministic penny-allocation method for distributing a record's cost across multiple targets so that the split amounts sum exactly to the source amount, with any rounding remainder assigned by a fixed, reproducible rule (largest fractional remainder first, ties broken by target identifier).
- **Currency_Group**: The set of records sharing the same `BillingCurrency`. Monetary sums, consistency checks, and zero-sum checks are computed per Currency_Group; amounts in different currencies are never added into a single total.
- **Zero_Sum_Check**: The verification that, within each Currency_Group, the sum of Allocated_Record BilledCost equals the sum of source FOCUS_Record BilledCost. The check is exact for splits produced by Largest_Remainder_Split; the Tolerance applies only to residual currency rounding.
- **Repository_Interface**: An abstraction over persistence (FOCUS_NORMALIZED, ALLOCATED_COST, ALLOCATION_RULE, audit) that allows stubbed/local implementations without real infrastructure.
- **Billing_Period**: The period identifier for a set of billing records. In FOCUS terms it is bounded by BillingPeriodStart and BillingPeriodEnd; the `billing_period` partition key (YYYY-MM) is derived from BillingPeriodStart as a convenience. Charge-level granularity uses ChargePeriodStart and ChargePeriodEnd.
- **Allocation_Run**: A single execution of allocation for a Billing_Period, identified by a monotonically increasing run version. Re-running allocation for a period creates a new Allocation_Run that supersedes prior runs for read purposes.
- **Restatement**: A re-ingestion of a Billing_Period whose source billing data changed after a prior ingestion (e.g. a cloud provider revised delayed cost data), requiring re-normalization and re-allocation.
- **Tolerance**: A configured non-negative numeric bound used only to absorb residual currency rounding in per-Currency_Group monetary comparisons. It is NOT used to mask allocation split errors, which must be eliminated by Largest_Remainder_Split.

## Requirements

### Requirement 1: FOCUS Data Model

**User Story:** As a platform engineer, I want a FOCUS-compliant data model targeting the FOCUS 1.2 mandatory baseline, so that billing data from any provider is represented in one canonical, standards-aligned schema.

#### Acceptance Criteria

1. THE Core_Engine SHALL define a FOCUS_Record type containing the official FOCUS columns BilledCost, EffectiveCost, ProviderName, SubAccountId, ServiceCategory, ServiceSubcategory, ServiceName, ResourceId, ResourceName, ChargeCategory, BillingCurrency, ConsumedQuantity, ConsumedUnit, PricingUnit, Tags, RegionId, RegionName, ChargePeriodStart, ChargePeriodEnd, BillingPeriodStart, and BillingPeriodEnd.
2. THE Core_Engine SHALL represent monetary fields BilledCost and EffectiveCost as decimal values that preserve currency precision.
3. THE Core_Engine SHALL represent the Tags field as a key-value map.
4. THE Core_Engine SHALL set ServiceCategory to a canonical FOCUS service domain and ServiceSubcategory to the raw provider/FPT service group.
5. THE Core_Engine SHALL derive the `billing_period` partition key (YYYY-MM) from BillingPeriodStart, and SHALL retain ChargePeriodStart and ChargePeriodEnd for charge-level granularity.
6. THE Core_Engine SHALL define an Allocated_Record type that contains the FOCUS_Record billing fields plus TeamID, BusinessUnit, Environment, and the FOCUS Allocation columns AllocatedMethodId, AllocatedMethodDetails, AllocatedResourceId, and AllocatedTags.
7. IF a FOCUS_Record is constructed with a missing FOCUS 1.2 mandatory field, THEN THE Core_Engine SHALL reject the record with a validation error identifying the missing field.
8. WHERE a ChargeCategory value is supplied, THE Core_Engine SHALL constrain the value to the FOCUS-defined set including Usage, Tax, and Credit.
9. WHERE a FOCUS 1.4-only column is not supplied by a provider, THE Core_Engine SHALL treat it as OPTIONAL and permit a null value without failing construction.

### Requirement 2: Connector Adapter Contract and Mock Connector

**User Story:** As a platform engineer, I want a FOCUS-based connector adapter contract with a mock reference connector, so that ingestion logic can be developed and tested without any real vendor integration.

#### Acceptance Criteria

1. THE Core_Engine SHALL define a Connector_Adapter contract exposing a `fetchRaw()` operation that returns raw vendor billing records and a `mapToFocus()` operation that transforms raw records into FOCUS_Record values.
2. THE Core_Engine SHALL provide a Mock_Connector that implements the Connector_Adapter contract using deterministic in-memory data without external network calls.
3. WHEN `fetchRaw()` is invoked on the Mock_Connector with a given Billing_Period, THE Mock_Connector SHALL return the same raw records for repeated invocations with that Billing_Period.
4. WHEN `mapToFocus()` is invoked with a set of raw records, THE Connector_Adapter SHALL return one FOCUS_Record per mappable raw record.
5. IF a raw record cannot be mapped to a FOCUS_Record, THEN THE Connector_Adapter SHALL reject the mapping with an error identifying the offending raw record.

### Requirement 3: ETL Normalization Framework

**User Story:** As a platform engineer, I want an ETL normalization framework, so that vendor billing columns are consistently mapped to the FOCUS 1.4 schema.

#### Acceptance Criteria

1. WHEN the Ingestion_Pipeline invokes the ETL_Normalizer with raw records from a Connector_Adapter, THE ETL_Normalizer SHALL produce FOCUS_Record values conforming to the official FOCUS data model with the FOCUS 1.2 mandatory column set populated.
2. THE ETL_Normalizer SHALL record a source traceability reference on each FOCUS_Record linking it to its raw source.
3. WHEN the ETL_Normalizer maps a raw record, THE ETL_Normalizer SHALL apply the configured vendor-to-FOCUS column mapping for that provider.
4. THE ETL_Normalizer SHALL produce identical FOCUS_Record output for identical raw input across repeated runs.
5. IF a raw record contains a value that is invalid for its mapped FOCUS field, THEN THE ETL_Normalizer SHALL reject the record with an error identifying the field and value.

### Requirement 4: Data Quality Framework (Fail-Closed)

**User Story:** As a FinOps lead, I want a fail-closed data quality framework, so that no incorrect or incomplete billing data is ever persisted.

#### Acceptance Criteria

1. WHEN the Ingestion_Pipeline completes normalization for a Billing_Period, THE DQ_Framework SHALL run the Freshness_Check, the Completeness_Check, and the Consistency_Check before any persistence occurs.
2. THE DQ_Framework SHALL treat the Freshness_Check, the Completeness_Check, and the Consistency_Check as equally blocking.
3. THE Freshness_Check SHALL verify that billing data for the target Billing_Period is present.
4. THE Completeness_Check SHALL verify that the normalized record count matches the raw source record count for the Billing_Period.
5. THE Consistency_Check SHALL verify, for each Currency_Group independently, that the sum of normalized BilledCost equals the raw source total cost for that currency within the configured Tolerance, and SHALL NOT sum amounts across different BillingCurrency values into a single total.
6. IF any of the Freshness_Check, the Completeness_Check, or the Consistency_Check fails, THEN THE DQ_Framework SHALL return a DQ_Result with status failed identifying the failing dimension and detail.
7. IF the DQ_Result status is failed, THEN THE Ingestion_Pipeline SHALL halt before any write to the FOCUS_NORMALIZED or ALLOCATED_COST stores.
8. IF the DQ_Result status is failed, THEN THE Ingestion_Pipeline SHALL persist no partial subset of the Billing_Period records.
9. WHEN the DQ_Result status is passed, THE Ingestion_Pipeline SHALL persist the normalized FOCUS_Record values for the Billing_Period.

### Requirement 5: Deterministic Allocation and Rules Engine

**User Story:** As a FinOps lead, I want a deterministic, priority-ordered allocation engine, so that every cost record is attributed to a team in a reproducible and auditable way without AI involvement.

#### Acceptance Criteria

1. WHEN the Allocation_Engine processes a FOCUS_Record, THE Allocation_Engine SHALL evaluate Allocation_Rules in priority order from tag-based to account-based to shared-cost.
2. WHEN a tag-based Allocation_Rule match criteria are satisfied by a FOCUS_Record, THE Allocation_Engine SHALL attribute the record to the rule target team and stop evaluating lower-priority rules for that record.
3. WHEN no tag-based Allocation_Rule matches a FOCUS_Record and an account-based Allocation_Rule matches the record SubAccountId, THE Allocation_Engine SHALL attribute the record to the account-based rule target team.
4. WHEN no tag-based or account-based Allocation_Rule matches a FOCUS_Record AND a shared-cost Allocation_Rule applies, THE Allocation_Engine SHALL distribute the record cost across the rule's target teams using the configured split method.
5. WHEN no Allocation_Rule (tag-based, account-based, or shared-cost) attributes a FOCUS_Record or a portion of it to a real team — including shared-resource idle/overhead, records with missing telemetry needed for a split, and records with missing or malformed tags — THE Allocation_Engine SHALL attribute that cost to the Unallocated_Bucket so that no cost is dropped.
6. WHEN the Allocation_Engine distributes a record cost across multiple targets, THE Allocation_Engine SHALL use Largest_Remainder_Split so that the sum of the distributed amounts equals the source record BilledCost exactly with no residual loss.
7. THE Allocation_Engine SHALL stamp each Allocated_Record with TeamID, BusinessUnit, Environment, and the FOCUS Allocation columns AllocatedMethodId, AllocatedMethodDetails (carrying the split detail, including the internal split ratio for shared-cost rows), AllocatedResourceId, and AllocatedTags.
8. THE Allocation_Engine SHALL produce identical Allocated_Record output for identical FOCUS_Record input and identical Allocation_Rule set across repeated runs, including identical remainder assignment under Largest_Remainder_Split.
9. THE Allocation_Engine SHALL attribute cost using only configured Allocation_Rules and SHALL exclude any AI-generated or non-deterministic input from the allocation calculation.
10. WHEN allocation for a Billing_Period completes, THE Allocation_Engine SHALL perform the Zero_Sum_Check for each Currency_Group independently, comparing the sum of Allocated_Record BilledCost (including amounts in the Unallocated_Bucket) to the sum of source FOCUS_Record BilledCost for that currency, and SHALL NOT sum amounts across different BillingCurrency values into a single total.
11. IF the Zero_Sum_Check fails for any Currency_Group, THEN THE Allocation_Engine SHALL halt before any write to the ALLOCATED_COST store and SHALL emit an allocation mismatch result identifying the currency and the discrepancy.
12. WHEN the Zero_Sum_Check passes for all Currency_Groups, THE Allocation_Engine SHALL persist the Allocated_Record values and SHALL write an allocation run audit entry containing the timestamp, rule set version, Allocation_Run version, and record count.

### Requirement 6: Repository Interfaces and Local Implementations

**User Story:** As a platform engineer, I want persistence behind repository interfaces with local implementations, so that core logic is fully testable without provisioning real infrastructure.

#### Acceptance Criteria

1. THE Core_Engine SHALL define Repository_Interfaces for the FOCUS_NORMALIZED store, the ALLOCATED_COST store, the ALLOCATION_RULE store, and the allocation run audit store.
2. THE Core_Engine SHALL provide a local implementation for each Repository_Interface that operates without real cloud or database provisioning.
3. WHEN core logic persists or reads data, THE Core_Engine SHALL access persistence only through a Repository_Interface.
4. WHERE a FOCUS_NORMALIZED write is requested for records that already exist for the Billing_Period, THE FOCUS_NORMALIZED Repository_Interface SHALL preserve append-only semantics by not mutating prior records, distinguishing successive writes by an ingestion version.
5. WHEN a Restatement re-ingests a Billing_Period, THE FOCUS_NORMALIZED Repository_Interface SHALL retain prior versions and SHALL expose the latest ingestion version as the current data for that Billing_Period.
6. WHEN allocation is re-run for a Billing_Period, THE ALLOCATED_COST store SHALL record the results under a new Allocation_Run version and SHALL expose the latest Allocation_Run as the current allocation for that Billing_Period without mutating prior runs.

### Requirement 7: Pipeline Orchestration and Ordering

**User Story:** As a FinOps lead, I want the ingestion-to-allocation flow to execute in a fixed, gated order, so that allocation only runs on data that has passed quality checks.

#### Acceptance Criteria

1. WHEN the Ingestion_Pipeline runs for a Billing_Period, THE Ingestion_Pipeline SHALL execute connector fetch, normalization, data quality evaluation, and persistence in that order.
2. WHEN ingestion for a Billing_Period completes successfully, THE Core_Engine SHALL run allocation for that Billing_Period only after the normalized data has been persisted.
3. IF ingestion for a Billing_Period halts due to a failed DQ_Result, THEN THE Core_Engine SHALL not start allocation for that Billing_Period.
4. WHEN a Restatement re-ingests a Billing_Period that passes data quality, THE Core_Engine SHALL re-run allocation for that Billing_Period against the latest ingestion version, producing a new Allocation_Run.

### Requirement 8: FOCUS 1.2 Conformance Validation

**User Story:** As a FinOps lead, I want the ETL output validated against the FOCUS 1.2 mandatory column set before data quality runs, so that only standards-conformant records ever enter the pipeline — especially from providers (e.g. FPT Cloud) that have no native FOCUS export.

#### Acceptance Criteria

1. WHEN the ETL_Normalizer produces FOCUS_Record values for a Billing_Period, THE FOCUS_Conformance_Check SHALL validate the output against the FOCUS 1.2 mandatory column set, checking both column presence and datatype, before the DQ_Framework runs.
2. THE FOCUS_Conformance_Check SHALL treat FOCUS 1.4-only columns as OPTIONAL and SHALL NOT fail conformance when such a column is absent or null.
3. IF the FOCUS_Conformance_Check detects a missing or wrong-datatype mandatory column, THEN THE Core_Engine SHALL halt the pipeline before the DQ_Framework runs and before any persistence, identifying the offending column.
4. WHERE a provider has no native FOCUS export (e.g. FPT Cloud), THE Connector_Adapter SHALL transform 100% of its raw billing into FOCUS_Record values, and THE FOCUS_Conformance_Check SHALL gate that output before any downstream processing.
