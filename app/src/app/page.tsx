"use client";

import { useMemo, useState } from "react";
import data from "@/data/processed.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

type Row = {
  date: string;
  nominal: number;
  real: number;
  cpi: string;
  "cpi_clean.cpi": number | string;
};

function fmtMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

function fmtPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(1)}%`;
}

export default function Home() {
  const rows = (data as any[])
    .map((r) => ({
      date: String(r.date),
      nominal: Number(r.nominal),
      real: Number(r.real),
      cpi: String(r.cpi ?? ""),
      "cpi_clean.cpi": r["cpi_clean.cpi"],
    }))
    .filter((r) => !Number.isNaN(r.nominal) && !Number.isNaN(r.real));

  const [mode, setMode] = useState<"nominal" | "real">("nominal");

  const chartData = useMemo(() => {
    return rows.map((r) => ({
      date: r.date,
      value: mode === "nominal" ? r.nominal : r.real,
    }));
  }, [rows, mode]);

  const metrics = useMemo(() => {
    const first = rows[0];
    const last = rows[rows.length - 1];

    const nominalChange = (last.nominal - first.nominal) / first.nominal;
    const realChange = (last.real - first.real) / first.real;

    let minReal = rows[0];
    for (const r of rows) {
      if (r.real < minReal.real) minReal = r;
    }

    return { first, last, nominalChange, realChange, minReal };
  }, [rows]);

  const annotationPoint =
    mode === "real"
      ? { date: metrics.minReal.date, value: metrics.minReal.real }
      : { date: metrics.minReal.date, value: metrics.minReal.nominal };

  return (
    <main className="min-h-screen bg-[#111417] text-[#f7f4ef]">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#f7c873]">
          Student Reality Lab
        </p>

        <h1 className="max-w-5xl text-6xl font-bold leading-[0.95] tracking-tight md:text-7xl">
          Wages can rise while buying power tells a different story.
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-9 text-white/70">
          This interactive data story compares nominal wages with
          inflation-adjusted wages to show why a larger paycheck does not always
          mean stronger purchasing power.
        </p>
      </section>

      {/* STICKY SCROLLYTELLING */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-[1fr_0.95fr]">
        {/* LEFT STICKY VISUAL */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-[2rem] border border-[#f7c873]/30 bg-[#1c2229] p-8 shadow-2xl">
            <h2 className="mb-3 text-3xl font-bold">
              Wage Growth vs. Buying Power
            </h2>

            <p className="mb-8 text-lg leading-8 text-white/70">
              Use the buttons below to compare the wage people received with
              the inflation-adjusted value of those wages.
            </p>

            <div className="mb-8 flex gap-3 rounded-2xl bg-black/30 p-2">
              <button
                onClick={() => setMode("nominal")}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  mode === "nominal"
                    ? "bg-[#f7c873] text-black"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                Nominal Wages
              </button>

              <button
                onClick={() => setMode("real")}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  mode === "real"
                    ? "bg-[#f7c873] text-black"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                Real Buying Power
              </button>
            </div>

            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                  />

                  <XAxis
                    dataKey="date"
                    interval={24}
                    tick={{ fontSize: 12, fill: "#ffffff90" }}
                  />

                  <YAxis
                    tickFormatter={(v) => `$${v}`}
                    tick={{ fill: "#ffffff90" }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111417",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                    formatter={(value: any) => [
                      fmtMoney(Number(value ?? 0)),
                      mode === "nominal" ? "Nominal wage" : "Real wage",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f7c873"
                    strokeWidth={4}
                    dot={false}
                  />

                  <ReferenceDot
                    x={annotationPoint.date}
                    y={annotationPoint.value}
                    r={7}
                    fill="#ffffff"
                    stroke="#f7c873"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-6 rounded-2xl border border-[#f7c873]/25 bg-[#f7c873]/10 p-4 text-sm leading-7 text-white/75">
              Takeaway: income may rise, but inflation changes how much that
              income can actually buy.
            </p>
          </div>
        </div>

        {/* RIGHT SCROLLING STORY */}
        <div className="space-y-32 py-6">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-10">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#f7c873]">
              Question
            </p>

            <h2 className="mb-8 text-5xl font-bold leading-tight">
              Did wages really improve?
            </h2>

            <p className="text-xl leading-9 text-white/70">
              At first, wage growth can look like progress. If the numbers are
              going up, it seems like workers are earning more over time.
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-10">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#f7c873]">
              Problem
            </p>

            <h2 className="mb-8 text-5xl font-bold leading-tight">
              Inflation changes the story.
            </h2>

            <p className="text-xl leading-9 text-white/70">
              Wages do not exist by themselves. Prices also rise, and inflation
              changes how much those wages can actually buy.
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-10">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#f7c873]">
              Evidence
            </p>

            <h2 className="mb-8 text-5xl font-bold leading-tight">
              Nominal wages can be misleading.
            </h2>

            <p className="text-xl leading-9 text-white/70">
              Nominal wages increased by{" "}
              <span className="font-semibold text-[#f7c873]">
                {fmtPct(metrics.nominalChange)}
              </span>
              , but real wages only changed by{" "}
              <span className="font-semibold text-[#f7c873]">
                {fmtPct(metrics.realChange)}
              </span>{" "}
              after adjusting for inflation.
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-10">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#f7c873]">
              Better Measure
            </p>

            <h2 className="mb-8 text-5xl font-bold leading-tight">
              Real wages show buying power.
            </h2>

            <p className="text-xl leading-9 text-white/70">
              The lowest real wage point in the dataset occurred in{" "}
              <span className="font-semibold text-[#f7c873]">
                {metrics.minReal.date}
              </span>
              , when inflation-adjusted wages dropped to{" "}
              <span className="font-semibold text-[#f7c873]">
                {fmtMoney(metrics.minReal.real)}
              </span>
              .
            </p>
          </article>

          <article className="rounded-[2rem] border border-[#f7c873]/30 bg-[#f7c873]/10 p-10">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#f7c873]">
              Final Takeaway
            </p>

            <h2 className="mb-8 text-5xl font-bold leading-tight">
              Higher wages do not automatically mean stronger purchasing power.
            </h2>

            <p className="text-xl leading-9 text-white/75">
              The data shows that inflation changes how wage growth should be
              interpreted. A paycheck can grow in dollars while its real value
              grows much more slowly.
            </p>
          </article>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-7xl border-t border-white/10 px-6 py-10">
        <p className="text-sm leading-relaxed text-white/40">
          Data sources: Average Hourly Earnings (CES0500000003) and CPI
          (CPIAUCSL), downloaded through FRED/BLS. Inflation adjustment uses
          2006 as the base year.
        </p>
      </footer>
    </main>
  );
}