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
  cpi: number;
};

function fmtMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

function fmtPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(1)}%`;
}

export default function Home() {
  const rows = data as Row[];

  const [mode, setMode] = useState<"nominal" | "real">("nominal");

  // chart points
  const chartData = useMemo(() => {
    return rows.map((r) => ({
      date: r.date,
      value: mode === "nominal" ? r.nominal : r.real,
      nominal: r.nominal,
      real: r.real,
    }));
  }, [rows, mode]);

  // headline metrics
  const metrics = useMemo(() => {
    const first = rows[0];
    const last = rows[rows.length - 1];

    const nominalChange = (last.nominal - first.nominal) / first.nominal;
    const realChange = (last.real - first.real) / first.real;

    // pick the lowest REAL wage point (good for annotation)
    let minReal = rows[0];
    for (const r of rows) if (r.real < minReal.real) minReal = r;

    return {
      first,
      last,
      nominalChange,
      realChange,
      minReal,
    };
  }, [rows]);

  const annotationPoint =
    mode === "real"
      ? { date: metrics.minReal.date, value: metrics.minReal.real }
      : { date: metrics.minReal.date, value: metrics.minReal.nominal };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Have Wages Kept Up With Inflation Since 2006?
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Toggle between <span className="font-semibold">nominal</span> wages
            (what people were paid at the time) and{" "}
            <span className="font-semibold">real</span> wages (inflation-adjusted
            to 2006 dollars) to see how purchasing power changes.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Metric cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Nominal wage change</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {fmtPct(metrics.nominalChange)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {fmtMoney(metrics.first.nominal)} → {fmtMoney(metrics.last.nominal)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Real wage change (2006$)</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {fmtPct(metrics.realChange)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {fmtMoney(metrics.first.real)} → {fmtMoney(metrics.last.real)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Lowest real wage month</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {metrics.minReal.date}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Real wage: {fmtMoney(metrics.minReal.real)}
            </p>
          </div>
        </div>

        {/* Chart card */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Trend</h2>
              <p className="text-sm text-slate-600">
                The line updates when you toggle the wage definition.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode("nominal")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "nominal"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                Nominal
              </button>
              <button
                onClick={() => setMode("real")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "real"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                Real (2006$)
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-5 h-[420px] w-full">
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval={24} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value: any) => [fmtMoney(Number(value)), "Wage"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />

                {/* Annotation dot tied to specific data */}
                <ReferenceDot
                  x={annotationPoint.date}
                  y={annotationPoint.value}
                  r={6}
                  fill="#f59e0b"
                  stroke="#b45309"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Annotation */}
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-slate-900">
            <p className="text-sm">
              <span className="font-semibold">Annotation:</span> The highlighted
              point marks the <span className="font-semibold">lowest real wage</span>{" "}
              month in the dataset ({metrics.minReal.date}). In real terms (2006$),
              wages were {fmtMoney(metrics.minReal.real)}.
            </p>
          </div>
        </div>

        {/* Story card */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">What to notice</h2>
          <p className="mt-2 max-w-3xl text-slate-700 leading-relaxed">
            Nominal wages rise steadily over time, which can make it feel like
            pay is “keeping up.” But when you switch to real wages (inflation-adjusted),
            the growth looks smaller and even flattens during high-inflation periods.
            This matters for students because affordability depends on purchasing power,
            not just the number on a paycheck. If rent, groceries, and transportation
            rise faster than inflation-adjusted wages, students may feel the squeeze
            even if their nominal pay increases.
          </p>
        </div>

        {/* Footer / sources */}
        <div className="mt-8 text-sm text-slate-500">
          <p>
            Data sources: Average Hourly Earnings (CES0500000003) and CPI (CPIAUCSL),
            downloaded via FRED (BLS). Inflation adjustment uses 2006 as the base.
          </p>
        </div>
      </div>
    </main>
  );
}