# Student-Reality-Lab-Loaiza - Wages vs Inflation (Nominal vs Real)

## Essential Question
Have hourly wages kept up with inflation since 2006 in the U.S.?

## Claim (Hypothesis)
After adjusting for inflation, average hourly earnings have grown more slowly than prices, reducing purchasing power.

## Audience
College students deciding how far their paycheck will go (rent, groceries, commuting).

## STAR Draft
### S — Situation
- Students feel like “everything is more expensive,” but it’s hard to tell if pay is rising at the same pace.

### T — Task
- Help the viewer compare wage growth vs inflation and understand the “real” (inflation-adjusted) trend.

### A — Action
- View 1: Line chart of hourly earnings over time.
- Interaction: Toggle Nominal vs Real (inflation-adjusted).
- Annotation: Callout on the largest drop / weakest real-wage point.

### R — Result
- Metric: Percent change in nominal vs real wages (start vs end date).
- Expected: Real wage grows more slowly and may dip during high-inflation periods.

## Dataset & Provenance
- Wages: BLS via FRED (CES0500000003)
- CPI: BLS via FRED (CPIAUCSL)

## Data Dictionary
| column | meaning | units |
|---|---|---|
| date | month of observation | YYYY-MM-DD |
| wage | average hourly earnings | dollars/hour |
| cpi | CPI index | 1982-84=100 |
| nominal_wage | same as wage | dollars/hour |
| real_wage | inflation-adjusted wage (base-year dollars) | dollars/hour |

## Data Viability Audit
### Missing values + weird fields
- Check for missing months and non-numeric entries after import.

### Cleaning plan
- Merge wages + CPI by date.
- Choose a base period (first month) and compute real_wage = nominal_wage * (base_cpi / cpi).
- Output processed.json for the app.

### What this dataset cannot prove (limits/bias)
- This is not student-only wages and not region-specific costs.
- CPI is a general basket and doesn’t match every student’s spending.

## Draft Chart Screenshot
![alt text](image-1.png)
- This chart directly compares the wage trend over time.
- The toggle will show whether the “real” trend looks weaker than the nominal trend.