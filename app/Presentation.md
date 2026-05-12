# Student Reality Lab — Wages vs Inflation

---

# S — Situation

Many students hear that wages are increasing over time, but at the same time they experience rising costs for rent, groceries, transportation, and tuition related expenses.

This creates a common question: **if wages are going up, why does everything still feel expensive?**

The concern is that increases in wages may not actually translate into greater purchasing power if the cost of living is increasing just as fast.

This project explores that issue by comparing wage growth to inflation.

---

# T — Task

The goal of this project was to answer one essential question:

**Have wages kept up with inflation since 2006?**

A viewer using this app should be able to compare nominal wages and inflation-adjusted wages to understand how purchasing power has changed over time.

---

# A — Action

To answer this question, I built an interactive data story using two main views.

## View 1 — Wage Trend

The first chart shows wage growth over time.

The key interaction in this chart is a **toggle that switches between nominal wages and real wages**.

- **Nominal wages** show the actual wages paid at the time.
- **Real wages** adjust those wages for inflation using CPI and a base year of 2006.

This interaction allows the viewer to directly see how inflation changes the interpretation of wage growth.

I also added an **annotation highlighting the lowest real wage point in the dataset**, which helps emphasize a specific moment when purchasing power was at its lowest.

## View 2 — CPI Trend

The second chart shows how the **Consumer Price Index (CPI)** changed over time.

This chart provides the context for the wage analysis by showing how the cost of goods and services has increased.

### Data Transformation

To build the dataset used in the app, I

- merged wage data with CPI data
- cleaned inconsistent fields in the CPI dataset
- calculated inflation-adjusted wages using 2006 as the base year
- exported the cleaned dataset as `processed.json`

This allowed the app to compare nominal and real wages consistently.

---

# R — Result

The data shows that **nominal wages increased steadily from 2006 to the present**.

However, when wages are adjusted for inflation, the growth in **real wages is much smaller**.

This means that although people are earning more in absolute terms, their **purchasing power has not increased at the same pace** because prices have also risen.

When the viewer switches between nominal and real wages in the chart, they can see how inflation reduces the apparent growth in wages.

### Key takeaway

Higher wages on paper do not necessarily mean that people can afford more, because the cost of living is rising at the same time.

### Limitation

One limitation of this dataset is that it represents **national averages**. It does not account for differences across regions, industries, or cost of living variations in specific cities.

---

# Final Takeaway for Students

When evaluating income growth, it is important to consider **inflation-adjusted wages**, not just nominal wages.

Understanding the difference helps explain why many people feel financially constrained even when wages appear to be increasing.
