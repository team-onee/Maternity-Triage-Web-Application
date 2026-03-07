# Empirical Investigation in the Maternity Triage App

## Overview

This README demonstrates how the **Maternity Triage web application** (an offline tool for prioritizing maternity patients in resource-limited settings like Kampala, Uganda) embodies principles of **empirical software engineering (SE) investigation** as outlined in *Empirical Investigation* (SENG 421: Software Metrics, Chapter 4, University of Calgary).

The framework focuses on applying scientific methods to investigate SE properties, filling gaps between research and practice, using techniques like surveys, case studies, and formal experiments.

While the app is a clinical tool rather than an SE research platform, its design implicitly applies empirical investigation; it "investigates" patient urgency through hypothesis-driven data collection, variable control, and analysis, mirroring how SE investigates tools and processes. For example, priority assignment "experiments" with clinical variables to evaluate outcomes, similar to testing rules-of-thumb like *"Should LOC be fewer than 200 lines?"*

---

## Empirical SE Principles in the App

The framework's 4 core principles guide SE studies. The app applies each to triage "investigation":

### 1. Stating the Hypothesis

The app implicitly tests hypotheses like *"Does high BP or heavy bleeding indicate immediate risk?"* (analogous to *"Does SRE improve quality?"*). In code, the `getPriority()` function in `script.js` evaluates conditions (e.g., `systolic >= 160` → RED), confirming or refuting urgency hypotheses.

### 2. Selecting Investigation Technique

The app uses a mix of techniques:

- **Formal Experiment** — Controlled assessment with high control and replication. Form inputs serve as "experimental units" and priority is the outcome.
- **Case Study** — The queue acts as retrospective documentation of patient "activities" with low control.
- **Survey** — Aggregate queue stats via `updateQueueStats()` retrospectively document relationships (e.g., symptom prevalence).

### 3. Maintaining Control Over Variables

Independent variables (e.g., symptoms, BP) affect dependent ones (priority). The app controls these via `validateForm()`, which enforces BP format and GA range to avoid confounds.

Causal ordering: `Symptoms/BP → Priority → Queue action`

### 4. Making Meaningful Investigation

The app evaluates and improves both "process" (triage) and "product" (queue), validating BSOTS-inspired clinical rules.

---

### Technique Comparison

| Factor | Experiment (App Alignment) | Case Study (App Alignment) |
|---|---|---|
| Retrospective | No — real-time assessment | Yes — queue review |
| Level of Control | High — form validation | Low — user-entered data |
| Replication | High — repeatable per patient | Low — unique cases |
| Generalization | Yes — BSOTS rules | No — facility-specific |

---

## Investigation Techniques and Examples

The app "investigates" patient properties (e.g., performance as urgency, usability as queue interface) in settings analogous to a field study (e.g., the clinic as "field").

**Data collection stages:**

- **First-degree** — direct user input via form
- **Second-degree** — localStorage monitoring
- **Third-degree** — queue artifacts

**Data flow:** `getPriority()` evaluates inputs → queue sorting interprets results → feedback loop informs next assessment.

**Examples mapped from the framework:**

| Example Type | SE Equivalent | App Implementation |
|---|---|---|
| Confirm Rules-of-Thumb | "Should LOC be fewer than 200 lines?" | "Should FHR be 100–170 bpm?" — threshold in `getPriority()` |
| Explore Relationships | "Does experience affect defects?" | "How does GA affect preterm risk?" — `ga < 37 && contractions` |
| Initiate Novel Practices | "Start OO with UML?" | BSOTS-aligned triage introduced as structured practice |

---

## Formal Experiments in the App

The app's priority logic functions as a formal experiment controlled and repeatable.

### Planning Phases

| Phase | App Implementation |
|---|---|
| Conception | Goal: prioritize patient urgency |
| Design | Hypotheses defined in `getPriority()` |
| Preparation | Form setup and input validation |
| Execution | Triggered by `submit` event |
| Analysis | Results rendered via `renderQueue()` |
| Dissemination | Data exported via CSV |

### Experimental Principles

- **Replication** — Each patient assessment is independently repeatable
- **Randomization** — Timestamps minimize ordering bias
- **Local Control** — Blocking by symptom groups; balancing across priority levels
- **Correlation** — Implicitly encoded in clinical thresholds

### Design Types

- **Factorial** — Crossing symptoms × vitals to determine combined priority
- **Nested** — Gestational age evaluated within contraction context

### Other Design Decisions

- **Variable selection** — Multiple variables (BP, FHR, symptoms) rather than a single measure
- **Baseline** — GREEN priority serves as the "average" non-urgent baseline

---

## Guidelines for Empirical Research

The app follows 6 guideline sections for sound empirical research:

| Section | Goal | App Implementation |
|---|---|---|
| 1. Experimental Context | Define objectives | Kampala/BSOTS context; risk thresholds predefined in code |
| 2. Experimental Design | Appropriate techniques | Patients as population; form as selection; queue length as sample size; objective rules for blinding |
| 3. Data Collection | Well-defined process | BP units enforced; validation as quality control; `removePatient()` handles dropouts; notes field captures side effects |
| 4. Analysis | Correct analysis | Simple conditional logic avoids multiple testing; error handling verifies assumptions |
| 5. Presentation | Understandable results | Code comments document procedures; queue stats are quantitative; modals show raw data; badges and tables as graphics |
| 6. Interpretation | Conclusions from results | Scoped to maternity cases; RED priority flagged as critical; browser-only limitations acknowledged |

---

## Practical Considerations and Benefits

The app addresses several "hidden aspects" of empirical research in practice:

- **Ethics** — All data stays local, no external transmission
- **Adaptations** — Mobile-responsive design for clinic use
- **Unexpected events** — Form error handling manages bad inputs
- **Staffing** — Designed for solo midwife use

**Benefit:** The app fills the research-practice gap by validating triage "tools" empirically through real usage data.

---

## Extensions

To support fuller empirical analysis, future versions could add:

- Logging for aggregate metrics (e.g., average number of RED cases per shift)
- Session-level statistics for retrospective case study analysis
- Export formats suitable for statistical tools

---

*Inspired by SENG 421 materials © 2026, Kampala Team*
