# Goal-Based Software Measurement in the Maternity Triage App

## Overview

This README illustrates how the Maternity Triage web application (a lightweight, offline tool for prioritizing maternity patients in resource-limited settings like Uganda) incorporates principles from the **Goal-Based Software Measurement Framework** (SENG 421, Chapter 3, University of Calgary). The framework emphasizes **Goal-Based Measurement (GBM)**, where measurements are derived from specific goals rather than generic metrics. It includes paradigms like **Goal-Question-Metric (GQM)** and **Goal-Question-Indicator-Metric (GQIM)**, with applications in software processes.

Although the app is primarily a clinical decision-support tool (not a software development metrics system), its data collection, priority calculation, and queue management implicitly apply these concepts. Patient "measurements" (e.g., blood pressure, symptoms) are goal-driven to assess urgency, mirroring how GQM derives metrics from business/project goals. No code modifications are required—the app's design already aligns with the framework's adaptable process (PDF pages 3-4).

---

## GBM Process in the App

The PDF outlines GBM as determining "what to measure" (entities, goals) and "how to measure" (metrics assignment). The app follows this for clinical triage:

### 1. Identifying and Classifying Entities

Entities are classified as **Process** (activities), **Product** (outputs), or **Resource** (inputs). The app deals with "defect-like" entities (e.g., symptoms as risks), addressing PDF's note on incomplete schemes (page 5).

- **Process**: Patient assessment and priority assignment (e.g., form submission in `script.js`).
- **Product**: Prioritized patient queue (e.g., JSON objects in localStorage).
- **Resource**: User inputs (e.g., gestational age) and browser tools (e.g., Date for timestamps).

### 2. Determining Relevant Goals 

Primary goal: "Prioritize patients to ensure life-threatening cases are handled first, improving outcomes in busy facilities." (Inspired by BSOTS protocols, akin to HP's goal of minimizing defects on page 30.)

### 3. Determining How to Measure 

Attributes are internal (inherent, e.g., size) or external (behavioral, e.g., quality). Measures match PDF samples (pages 8-12).

| Entity Type | Entity Example | Attribute (Internal/External) | Measure in App | PDF Parallel (Page) |
|-------------|----------------|-------------------------------|----------------|---------------------|
| Process | Triage assessment | Elapsed time (internal) | Assessment timestamp (`new Date()`) | Development process elapsed time (8) |
| Process | Priority calculation | Performance (external) | Assigned priority (RED/ORANGE/etc.) | Test process performance (8) |
| Process | Queue management | Progress (external) | Queue length/stats (`queue.length`) | Test process progress (8) |
| Product | Patient record | Defect density (external) | Symptom count/density triggering priority | Design quality defect density (9) |
| Product | Priority output | Severity (external) | Ordinal priority class (red=4) | Defect severity (11) |
| Resource | Time | Execution time (internal) | Queue add time | Time execution time (12) |
| Resource | Staff (implicit) | Experience | Not directly measured (assumes midwife expertise) | Assigned staff experience (12) |

These are assigned in `getPriority()` and `renderQueue()` functions.

---

## GQM Paradigm in the App

GQM structures: **Goal → Questions → Metrics**. The app uses a GQM-like tree for triage, similar to Basili's model  or Solingen's planning phases . Unlike fixed metrics, measures adapt to clinical goals .

### GQM Tree Example

**Goal**: Evaluate patient urgency to optimize triage in resource-limited settings (parallels AT&T's code inspection goal on page 26).

**Q1: What is the pregnancy status?** (Assesses baseline risk, like HP's customer satisfaction questions on.)
- M1.1: Gestational age (weeks, ratio scale, validated 0-42).
- M1.2: Fetal heart rate (bpm, threshold <100 or >170 triggers RED).

**Q2: What vital signs indicate hypertension or distress?** (External quality attribute.)
- M2.1: Blood pressure (mmHg, parsed as systolic/diastolic, threshold ≥160/110).

**Q3: What symptoms are present?** (Like defect origins in HP case.)
- M3.1: Symptom categories (nominal, e.g., "heavy-bleeding" presence).
- M3.2: Symptom count (ratio, implicit in priority logic).

**Q4: How to monitor queue efficiency?** (Progress tracking, like Solingen's feedback phase on.)
- M4.1: Timestamp (interval, for sorting).
- M4.2: Priority ranking (ordinal, mapped `{red:4, ...}` for sorting).

This tree is implemented in `validateForm()`, `getPriority()`, and `sortQueue()`.

---

## GQIM Paradigm in the App

GQIM adds **Indicators** (derived visuals/interpretations) to GQM for measurement plans. The app converts goals to plans:

- **Business Goal**: Safe, efficient maternity triage.
- **GQIM Process**: Identify goals → Questions/metrics → Indicators (e.g., color badges).
- **Measurement Plan**:
  1. Collect inputs (form).
  2. Compute priority (metrics).
  3. Display badge/queue stats (indicators, e.g., `"Red: ${counts.red}"` in `updateQueueStats()`).

This mirrors converting goals to actionable plans, like HP's defect minimization.

---

## Parallels to PDF Applications and Case Studies

- **AT&T Case**: Goals like "Better inspection planning" lead to questions/metrics on defect quality. App parallels with triage planning: Q on symptoms → M on density → Indicator (priority badge).
- **HP Case**: Goals A/B/C (customer satisfaction, effort minimization, defect reduction) with metrics like post-release quality. App's priority reduces "defects" (clinical risks), minimizing wait times (effort).
- **Exercises**: Like handling fragile requirements—app handles variable symptoms via adaptable metrics (e.g., preterm checks).

---

## Benefits and Extensions

- **Alignment**: App avoids universal metrics, focusing on goal-specific ones.
- **Future**: Add logging for aggregate metrics (e.g., average queue time) to enable full GQM analysis.
- **Limitations**: App focuses on runtime measurements, not dev metrics (e.g., no McCabe complexity from).

---

For code references, see `script.js`. Inspired by SENG 421 materials.

© 2026 – Kampala, Uganda.
