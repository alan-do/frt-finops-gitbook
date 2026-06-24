# Implementation Plan: FinOps Core Engine

## Overview

This plan implements the FinOps Core Engine as a NestJS / TypeScript application following the module dependency direction `pipeline → (connector, normalization, data-quality, allocation, persistence)`, with `domain` as the dependency-free foundation imported everywhere.

The build is incremental and test-driven: each task delivers a working slice that later tasks wire together, with no orphaned code. Monetary values use `decimal.js` throughout. Property-based tests use **fast-check** with a minimum of **100 iterations** per property and are placed as sub-tasks next to the code they validate so correctness issues surface early. All 27 correctness properties from the design are mapped to dedicated test sub-tasks.

Team capacity is 1.5 FTE, so tasks are deliberately small and sequenced so a single developer can land one slice at a time while staying integrated.

## Tasks

- [ ] 1. Set up project scaffolding and the dependency-free domain module
  - [ ] 1.1 Scaffold the NestJS / TypeScript project and tooling
    - Initialize a NestJS project under `src/` with `app.module.ts`
    - Add and configure dependencies: `decimal.js`, `fast-check`, and the project test runner (Jest)
    - Configure TypeScript (strict mode), lint, and the test script with fast-check available
    - Create the module folder skeleton: `domain/`, `connector/`, `normalization/`, `data-quality/`, `allocation/`, `persistence/`, `pipeline/`
    - _Requirements: 6.3_

  - [ ] 1.2 Implement money / Decimal helpers
    - Create `domain/money.ts` with `toDecimal()`, `sumDecimal()`, `withinTolerance(a, b, tolerance)`, `groupByCurrency()`, and `largestRemainderSplit(amount, weights, targetIds, scale)`
    - Prefer string ingress into `Decimal` to avoid float drift; require `tolerance >= 0`; tolerance absorbs residual currency rounding only, never split errors
    - `largestRemainderSplit` floors each ideal share, then distributes leftover pennies by largest fractional remainder first (ties broken by ascending target id) so amounts sum to `amount` exactly
    - _Requirements: 1.2, 4.5, 5.6, 5.10_

  - [ ]* 1.3 Write property tests for monetary precision and largest-remainder split
    - **Property 1: Monetary precision is preserved**
    - **Validates: Requirements 1.2**
    - Generate decimal monetary strings; assert round-trip through `Decimal` is exactly equal with no float drift
    - **Property 17: Largest-remainder split is exact and deterministic**
    - **Validates: Requirements 5.6**
    - Generate an amount, weights, and target ids; assert returned shares sum exactly to the amount, count matches targets, and the distribution is identical across runs with deterministic tie-breaking

  - [ ] 1.4 Define domain error types
    - Create `domain/errors.ts` with `ValidationError` (carries field, optional value), `MappingError` (carries rawId), `DqFailure`, and `AllocationMismatch`
    - _Requirements: 1.5, 2.5, 3.5, 4.6, 5.9_

  - [ ] 1.5 Implement ChargeCategory and FOCUS_Record type + factory/validator
    - Create `domain/charge-category.ts` (enum: Usage | Tax | Credit) and `domain/focus-record.ts`
    - Implement `createFocusRecord()` validating all required FOCUS fields (throw `ValidationError` naming the missing field) and constraining `ChargeCategory`
    - Parse `billedCost` / `effectiveCost` via `toDecimal()`; freeze the result; stamp `tags` as a key-value map
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6_

  - [ ]* 1.6 Write property tests for FOCUS_Record validation
    - **Property 2: Missing required field is rejected by name** — **Validates: Requirements 1.5**
    - **Property 3: ChargeCategory domain constraint** — **Validates: Requirements 1.6**

  - [ ] 1.7 Implement Allocated_Record, AllocationRule, SplitMethod types, and the unallocated constant
    - Create `domain/allocated-record.ts` (FOCUS billing fields + teamId, businessUnit, environment, and FOCUS Allocation columns allocatedMethodId, allocatedMethodDetails, allocatedResourceId, allocatedTags)
    - Create `domain/allocation-rule.ts` with `RuleType` (tag-based | account-based | shared-cost), `SplitMethod`, `MatchCriteria`, and the `AllocationRule` model
    - Add `UNALLOCATED_TEAM_ID = '__UNALLOCATED__'` constant (reserved system team for otherwise-unattributed cost)
    - _Requirements: 1.4, 5.5, 5.7_

  - [ ]* 1.8 Write unit tests for domain type field presence
    - Assert FOCUS_Record and Allocated_Record carry all required fields
    - _Requirements: 1.1, 1.3, 1.4_

- [ ] 2. Implement the connector adapter contract and Mock_Connector
  - [ ] 2.1 Define the ConnectorAdapter contract and column mapping
    - Create `connector/connector-adapter.ts` (abstract `fetchRaw(billingPeriod)` and `mapToFocus(raw)`) and `connector/connector.module.ts`
    - Create `normalization/column-mapping.ts` encoding the ERD vendor→FOCUS maps (AWS `UnblendedCost`→`BilledCost`, Azure `Cost`→`BilledCost`, GCP `project.id`→`SubAccountId`) plus `getColumnMapping(provider)` and `mapRawToFocus()` throwing `MappingError` on unmappable records
    - _Requirements: 2.1, 2.5_

  - [ ] 2.2 Implement Mock_Connector with deterministic fixtures
    - Create `connector/mock-connector.ts` holding an in-memory fixture keyed by billing period; `fetchRaw` returns a deep-cloned stable copy; `mapToFocus` delegates to `mapRawToFocus`
    - No external network calls
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

  - [ ]* 2.3 Write property tests for the connector
    - **Property 4: Connector fetch determinism** — **Validates: Requirements 2.3**
    - **Property 5: Mapping is size-preserving** — **Validates: Requirements 2.4**
    - **Property 6: Unmappable record is rejected with identity** — **Validates: Requirements 2.5**

  - [ ]* 2.4 Write unit test for the connector contract
    - Assert Mock_Connector implements `fetchRaw`/`mapToFocus` and returns data with no network dependency
    - _Requirements: 2.1, 2.2_

- [ ] 3. Implement the ETL normalization framework
  - [ ] 3.1 Implement the EtlNormalizer
    - Create `normalization/etl-normalizer.ts` and `normalization/normalization.module.ts`
    - `normalize(raw)` applies the provider column mapping, stamps `sourceRef` from `rawId` for traceability, builds records via `createFocusRecord` (throwing `ValidationError` with field+value on invalid mapped values), and is pure/deterministic
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 3.2 Write property tests for normalization
    - **Property 7: Normalization conformance and traceability** — **Validates: Requirements 3.1, 3.2**
    - **Property 8: Mapping fidelity** — **Validates: Requirements 3.3**
    - **Property 9: Normalization determinism** — **Validates: Requirements 3.4**
    - **Property 10: Invalid mapped value is rejected with field and value** — **Validates: Requirements 3.5**

- [ ] 4. Implement the fail-closed Data Quality framework
  - [ ] 4.1 Implement the three DQ checks
    - Create `data-quality/checks/freshness.check.ts`, `completeness.check.ts`, `consistency.check.ts`
    - Freshness fails if no normalized record exists for the period; Completeness fails if `normalized.length !== rawCount`; Consistency groups normalized records by `BillingCurrency` (Currency_Group) and, for each currency independently, fails unless `withinTolerance(sum(group.billedCost), rawTotalByCurrency.get(currency), tolerance)`, never summing across currencies and failing on a currency present on only one side
    - _Requirements: 4.3, 4.4, 4.5_

  - [ ] 4.2 Implement the DqFramework orchestrator
    - Create `data-quality/dq-framework.ts` and `data-quality/data-quality.module.ts`
    - `evaluate(input)` runs all three checks as equally blocking in fixed order, returning `DqResult{status, failedDimension?, detail?}`; performs no persistence (pure evaluation)
    - _Requirements: 4.1, 4.2, 4.6_

  - [ ]* 4.3 Write property tests for DQ evaluation
    - **Property 11: Each DQ dimension passes iff its condition holds (consistency per currency)** — **Validates: Requirements 4.3, 4.4, 4.5**
    - **Property 12: Any failed dimension yields a failed result identifying it** — **Validates: Requirements 4.2, 4.6**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass for domain, connector, normalization, and data-quality modules; ask the user if questions arise.

- [ ] 6. Implement the deterministic allocation engine
  - [ ] 6.1 Implement priority-ordered rule matching with unallocated routing
    - Create `allocation/rule-matcher.ts` with `byPriorityThenRuleId` (total order: priority asc, ruleId asc) and `applyRules(record, orderedRules)`
    - First matching rule of highest priority wins (tag-based → account-based → shared-cost) and stops lower-priority evaluation; shared-cost splits a record across teams using `largestRemainderSplit` so allocated amounts sum to source `billedCost` exactly
    - Route any cost no rule attributes to a real team — no match, shared-resource idle/overhead, missing telemetry for a split, missing/malformed tags — to `UNALLOCATED_TEAM_ID` so no cost is dropped
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 6.2 Implement the AllocationEngine and per-currency zero-sum check
    - Create `allocation/allocation-engine.ts` and `allocation/allocation.module.ts`
    - `allocate(records, rules, tolerance)` filters active rules, sorts deterministically, stamps attribution fields, computes `checkZeroSumByCurrency` (per Currency_Group, exact for splits, tolerance for residual currency rounding only), and returns `AllocationOutcome{allocated, zeroSumByCurrency, zeroSumPassed, ruleSetVersion}` via `hashRuleSet`; pure with no I/O, clock, randomness, or AI input
    - _Requirements: 5.7, 5.8, 5.9, 5.10, 5.11_

  - [ ]* 6.3 Write property tests for allocation matching, stamping, and unallocated routing
    - **Property 15: Priority-ordered attribution** — **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
    - **Property 16: Unallocated bucket catches all otherwise-unattributed cost** — **Validates: Requirements 5.5**
    - **Property 18: Attribution fields are stamped** — **Validates: Requirements 5.7**

  - [ ]* 6.4 Write property tests for allocation determinism and per-currency zero-sum
    - **Property 19: Allocation determinism** — **Validates: Requirements 5.8, 5.9**
    - **Property 20: Zero-sum invariant per currency** — **Validates: Requirements 5.10**

- [ ] 7. Implement repository interfaces and in-memory implementations
  - [ ] 7.1 Define the repository contracts
    - Create `persistence/repositories/` with abstract `FocusNormalizedRepository` (append returns ingestion version / findByPeriod returns latest version / countByPeriod / latestVersion), `AllocatedCostRepository` (save returns Allocation_Run version / findByPeriod returns latest run / latestRunVersion), `AllocationRuleRepository` (findActiveOrderedByPriority), and `AllocationAuditRepository` (record/findByPeriod, entry includes allocationRunVersion) as NestJS injection tokens
    - _Requirements: 6.1, 6.3_

  - [ ] 7.2 Implement in-memory repositories and bind them in the module
    - Create `persistence/local/` in-memory implementations; `FocusNormalizedRepository.append` adds a new ingestion-version layer per period, never rewrites prior versions, and `findByPeriod` returns the latest version (Restatement retains prior versions)
    - `AllocatedCostRepository.save` records results under a new Allocation_Run version without mutating prior runs and `findByPeriod` returns the latest run; audit `record` persists the `allocationRunVersion`
    - Bind each token to its in-memory impl in `persistence/persistence.module.ts`
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 7.3 Write property tests for versioning semantics
    - **Property 23: Append-only normalized store** — **Validates: Requirements 6.4**
    - **Property 24: Restatement retains prior version and exposes latest** — **Validates: Requirements 6.5**
    - **Property 25: Re-allocation supersedes prior run without mutating it** — **Validates: Requirements 6.6, 7.4**

  - [ ]* 7.4 Write unit tests for repository interfaces and impls
    - Assert all four repositories exist with working in-memory behavior, including ingestion-version retention and Allocation_Run versioning
    - _Requirements: 6.1, 6.2_

- [ ] 8. Implement pipeline orchestration and the allocation runner
  - [ ] 8.1 Implement the injectable Clock and AllocationRunner
    - Create `pipeline/clock.ts` (injectable `now()`) and `pipeline/allocation-runner.ts`
    - `run(billingPeriod)` reads the latest persisted ingestion version, loads active rules, calls the engine; on per-currency zero-sum failure returns `mismatch` identifying the currency with no `ALLOCATED_COST` write; on pass saves allocated records under a new Allocation_Run version and writes an audit entry (timestamp, ruleSetVersion, allocationRunVersion, recordCount)
    - _Requirements: 5.11, 5.12_

  - [ ]* 8.2 Write property tests for the allocation runner persistence path
    - **Property 21: Fail-closed on zero-sum mismatch identifies currency** — **Validates: Requirements 5.11**
    - **Property 22: Persistence and audit on zero-sum pass** — **Validates: Requirements 5.12**

  - [ ] 8.3 Implement the IngestionPipeline orchestrator with restatement support
    - Create `pipeline/ingestion-pipeline.ts` and `pipeline/pipeline.module.ts`; wire connector, normalizer, DQ, focus repo, and allocation runner
    - Execute fetch → normalize → DQ → persist in order; DQ consistency uses `rawTotalByCurrency`; on DQ failure return `halted` with zero writes and never invoke allocation; on DQ pass append a new ingestion version then run allocation
    - Support Restatement: re-ingesting a period that passes DQ retains prior ingestion versions, allocates against the latest version, and produces a new Allocation_Run
    - _Requirements: 4.7, 4.8, 4.9, 7.1, 7.2, 7.3, 7.4_

  - [ ] 8.4 Wire the root AppModule
    - Import all feature modules into `app.module.ts` and bind `EngineConfig` (tolerance, rule set version); ensure the pipeline is resolvable end to end
    - _Requirements: 6.3, 7.1_

  - [ ]* 8.5 Write property tests for pipeline fail-closed, ordering, and restatement
    - **Property 13: Fail-closed on DQ failure** — **Validates: Requirements 4.7, 4.8**
    - **Property 14: Persistence on DQ pass** — **Validates: Requirements 4.9**
    - **Property 26: Allocation runs only after persisted ingestion** — **Validates: Requirements 7.2**
    - **Property 27: No allocation when ingestion halts** — **Validates: Requirements 7.3**
    - **Property 25: Re-allocation supersedes prior run without mutating it** (pipeline restatement path) — **Validates: Requirements 6.6, 7.4**

  - [ ]* 8.6 Write unit test for pipeline call ordering
    - Assert fetch → normalize → DQ → persist order via a call-order spy
    - _Requirements: 4.1, 7.1_

- [ ] 9. Integration tests for the end-to-end pipeline
  - [ ]* 9.1 Write integration test for the DQ-passing path
    - End-to-end run on a passing fixture: FOCUS_NORMALIZED and ALLOCATED_COST stores populated, one audit entry written
    - _Requirements: 4.9, 5.10, 7.1, 7.2_

  - [ ]* 9.2 Write integration test for the DQ-failing path
    - End-to-end run on a failing fixture: both stores empty, allocation never invoked
    - _Requirements: 4.7, 4.8, 7.3_

  - [ ]* 9.3 Write integration test for the restatement / re-allocation path
    - Re-ingest a period whose source data changed: prior ingestion version retained, latest version current, a new Allocation_Run supersedes the prior run for reads without mutating it
    - _Requirements: 6.5, 6.6, 7.4_

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all unit, property, and integration tests pass; ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP, but they encode the 27 correctness properties and are strongly recommended given the Data Correctness First principle.
- Each property test uses fast-check with a minimum of 100 iterations and is tagged `Feature: finops-core-engine, Property {n}`.
- Each task references specific requirements (and properties where relevant) for traceability.
- Checkpoints provide incremental validation points suited to the 1.5 FTE capacity.
- No infrastructure provisioning is in scope; persistence stays behind repository interfaces with in-memory implementations.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.4"] },
    { "id": 2, "tasks": ["1.3", "1.5"] },
    { "id": 3, "tasks": ["1.6", "1.7"] },
    { "id": 4, "tasks": ["1.8", "2.1", "7.1"] },
    { "id": 5, "tasks": ["2.2", "3.1", "4.1", "7.2"] },
    { "id": 6, "tasks": ["2.3", "2.4", "3.2", "4.2", "6.1", "7.3", "7.4"] },
    { "id": 7, "tasks": ["4.3", "6.2", "6.3"] },
    { "id": 8, "tasks": ["6.4", "8.1"] },
    { "id": 9, "tasks": ["8.2", "8.3"] },
    { "id": 10, "tasks": ["8.4"] },
    { "id": 11, "tasks": ["8.5", "8.6"] },
    { "id": 12, "tasks": ["9.1", "9.2", "9.3"] }
  ]
}
```
