# Chapter 5: Software Size Metrics
## Maternity Triage Web Application
**SWE 2204 Software Metrics | MUST BSE 2024**

---

## 1. Overview

This document describes how Chapter 5 (Measuring Internal Product
Attributes: Software Size) was implemented and applied to the
Maternity Triage Web Application.

Software size was measured using three approaches:
1. **LOC (Lines of Code)** — physical size of each file
2. **Halstead Metrics** — complexity of the code vocabulary
3. **Function Points** — functionality delivered to the user

All measurements are implemented in:
- `metrics.html` — the interactive metrics dashboard
- `metrics_data.js` — all pre-calculated metric values

---

## 2. Measurement Goal (GQIM Step 5)

| Component | Description |
|-----------|-------------|
| **Object of Interest** | Maternity Triage source files (index.html, styles.css, script.js) |
| **Purpose** | Evaluate physical and functional size to understand the application scope |
| **Perspective** | From the viewpoint of the developer |
| **Environment** | MUST BSE 2024, pure frontend (HTML/CSS/JS), offline browser app, March 2026 |

---

## 3. LOC Measurements

### What is LOC?
Lines of Code (LOC) measures the physical size of the software.
- **NCLOC** = Non-Commented Lines of Code (actual working code)
- **CLOC** = Commented Lines of Code (explanation lines only)
- **Total LOC** = NCLOC + CLOC + Blank lines
- **Comment Density** = CLOC / Total LOC × 100

### Results

| File | Total LOC | NCLOC | CLOC | Blank | Comment Density | Size Rating |
|------|-----------|-------|------|-------|-----------------|-------------|
| index.html | 98 | 74 | 4 | 20 | 4.08% | Small ✅ |
| styles.css | 285 | 228 | 12 | 45 | 4.21% | Medium ⚠️ |
| script.js | 178 | 134 | 14 | 30 | 7.87% | Medium ⚠️ |
| **TOTAL** | **561** | **436** | **30** | **95** | **5.35% avg** | |

### Scale Type
- **Scale:** Ratio (true zero = 0 lines = no code exists)
- **Formula:** Total LOC = NCLOC + CLOC + Blank lines

### Observation
Comment density average is 5.35% — below the recommended target of ≥ 20%.
This is common for frontend-only applications where HTML structure and
CSS selectors serve as implicit documentation. Improvement recommended
for script.js specifically.

### Simple LOC metrics derived:
- **Productivity** = NCLOC / development hours (track sprint by sprint)
- **Quality** = defects / KLOC (target: < 5 defects per 1000 lines)
- **Documentation** = CLOC / LOC (current: 5.35% — target: ≥ 20%)

---

## 4. Halstead Metrics

### What are Halstead Metrics?
Maurice Halstead (1971) proposed that every program is made of:
- **Operators** (μ1): keywords, symbols (if, =, +, &&, function, etc.)
- **Operands** (μ2): variables, constants, string values

From these, key size and complexity measures are derived.

### Key Formulas
| Formula | Meaning |
|---------|---------|
| μ = μ1 + μ2 | Program vocabulary |
| N = N1 + N2 | Program length (total token occurrences) |
| V = N × log₂(μ) | Program volume (mental effort to write it) |
| B = E^(2/3) / 3000 | Estimated bugs remaining at delivery |

### Results

| File | μ1 | μ2 | N1 | N2 | N | V | Est. Bugs B |
|------|----|----|----|----|---|---|-------------|
| script.js | 28 | 45 | 312 | 287 | 599 | 3707.8 | 0.18 |
| index.html | 18 | 32 | 145 | 98 | 243 | 1370.5 | 0.09 |
| styles.css | 22 | 38 | 198 | 312 | 510 | 3013.7 | 0.15 |

### Interpretation
All three files have very low estimated bug counts (B < 0.20).
This confirms the application is small and well-structured with
minimal residual defect risk.

### Academic Note
Halstead's work was originally designed for assembly language (1971)
and is considered too fine-grained for modern languages like JavaScript.
It is applied here as a theoretical framework exercise as required by
SWE 2204.

---

## 5. Function Points

### What are Function Points?
Function Points (FP) measure HOW MUCH the application does for users —
completely independent of programming language. This makes it a fair
measure for comparing different projects regardless of tech stack.

### The 5 Components
| Type | Meaning | Weight (Low) |
|------|---------|-------------|
| **EI** — External Input | Data coming IN from user | 3 |
| **EO** — External Output | Data OUT with calculations | 4-5 |
| **EQ** — External Inquiry | Data OUT without calculations | 3 |
| **ILF** — Internal Logical File | Data stored inside the app | 7 |
| **EIF** — External Interface File | Data from another system | 5 |

### Key Distinction: EO vs EQ
- **EO** involves mathematical calculations or derived data
  → Example: Priority Assessment calculates RED/ORANGE/YELLOW/GREEN using BP thresholds
- **EQ** is simple retrieval with no calculations
  → Example: Triage Queue Display just fetches and shows stored patients

### Function Point Count

| Feature | Type | Description | Complexity | Weight | FP |
|---------|------|-------------|-----------|--------|----|
| Patient Assessment Form | EI | Name, GA, BP, FHR, symptoms submitted | Low | 3 | 3 |
| Search Queue | EI | Filter patients by name in real time | Low | 3 | 3 |
| Sort Queue | EI | Reorder by priority or time | Low | 3 | 3 |
| Remove Patient | EI | Delete patient from queue and localStorage | Low | 3 | 3 |
| Clear Queue | EI | Wipe entire queue from localStorage | Low | 3 | 3 |
| Priority Assessment Result | EO | Calculates RED/ORANGE/YELLOW/GREEN using BP, FHR, symptoms | Average | 5 | 5 |
| Queue Statistics Display | EO | Calculates totals: Red count, Orange count, etc. | Low | 4 | 4 |
| CSV Export | EO | Generates downloadable CSV by processing queue data | Average | 5 | 5 |
| Triage Queue Display | EQ | Retrieves and shows patient queue — no calculation | Low | 3 | 3 |
| Patient Detail Modal | EQ | Shows full patient details on click — no calculation | Low | 3 | 3 |
| Patient Queue (localStorage) | ILF | Stores: name, GA, BP, FHR, symptoms[], notes, priority, time | Low | 7 | 7 |

### Final Calculation

| Step | Value |
|------|-------|
| UFC (Unadjusted Function Points) | **39** |
| VAF (Value Adjustment Factor) | **1.00** |
| **Final FP = UFC × VAF** | **39** |

### VAF Explanation
VAF = 0.65 + 0.01 × (F1 + F2 + ... + F14)

For the Maternity Triage app:
- F1 (Data Communications) = 0 — completely offline, no network
- F2 (Distributed Processing) = 0 — single device only
- F3 (Performance) = 2 — basic performance requirements
- F6 (Online Data Entry) = 4 — all data entry is online (in-browser)
- F7 (End-User Efficiency) = 4 — designed for quick mobile use
- F8 (Online Update) = 3 — localStorage updates in real time
- All other factors = 0 or low

Conservative estimate: VAF = 1.00 (average system)

### Interpretation
**39 Function Points** classifies the Maternity Triage app as a
**Small application**. This makes sense for a 3-file offline tool.
FP = 39 is a language-independent measure — fair to compare with
other student projects regardless of whether they use PHP, Python, or JavaScript.

---

## 6. GQM Connection (Chapter 3 Traceability)

These size metrics answer the following measurement goals:

| Metric | GQM Connection |
|--------|---------------|
| LOC growth over sprints | Tracks if codebase is growing sustainably |
| Comment density 5.35% | Below target — action needed to improve documentation |
| FP = 39 | Confirms small application scope — appropriate for 3-file tool |
| Halstead B ≈ 0 | Very low residual defect risk — confirms clean code |

---

## 7. Dashboard

All size metrics are visualized interactively in:
- **`metrics.html`** — open in any browser (no server needed)
- Sections: LOC summary cards, LOC per file table, stacked bar chart,
  Halstead table, Function Points table with UFC/VAF/FP totals

---

## 8. Scale Types Summary

| Metric | Scale Type | Reason |
|--------|-----------|--------|
| LOC | Ratio | True zero exists (0 lines = no code) |
| NCLOC | Ratio | True zero exists |
| Comment Density % | Ratio | 0% = no comments, true zero |
| Halstead Volume V | Ratio | 0 = empty program |
| Function Points | Ratio | 0 FP = no functionality |

---

*Implemented by: Antonia Mbalinge*
*Course: SWE 2204 Software Metrics — MUST BSE 2024*
*Chapter 5: Measuring Internal Product Attributes — Software Size*
