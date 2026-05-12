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
      nominal: r.nominal,
      real: r.real,
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
    <main className="min-h-screen bg-slate-100">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Student Reality Lab
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Have Wages Kept Up With Inflation Since 2006?
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
            This interactive data story compares nominal wages with
            inflation-adjusted wages to show how purchasing power changes over
            time. A paycheck may look larger today, but that does not always
            mean it buys more.
          </p>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-slate-800">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">Key finding:</span> Nominal wages
              increased by {fmtPct(metrics.nominalChange)}, but real wages only
              changed by {fmtPct(metrics.realChange)} after adjusting for
              inflation.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Nominal wage change</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {fmtPct(metrics.nominalChange)}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {fmtMoney(metrics.first.nominal)} → {fmtMoney(metrics.last.nominal)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Real wage change (2006$)</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {fmtPct(metrics.realChange)}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {fmtMoney(metrics.first.real)} → {fmtMoney(metrics.last.real)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Lowest real wage month</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {metrics.minReal.date}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Real wage: {fmtMoney(metrics.minReal.real)}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Wage trend over time
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Use the toggle to compare the wage people actually received at
                the time with the inflation-adjusted value of those wages in
                2006 dollars.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1">
              <button
                onClick={() => setMode("nominal")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "nominal"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Nominal
              </button>
              <button
                onClick={() => setMode("real")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "real"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Real (2006$)
              </button>
            </div>
          </div>

          <div className="mt-6 h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval={24} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value: any) => [fmtMoney(Number(value ?? 0)), "Wage"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
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

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm leading-relaxed text-slate-800">
              <span className="font-semibold">Annotation:</span> The highlighted
              point marks the month with the lowest real wage in the dataset,
              <span className="font-semibold"> {metrics.minReal.date}</span>. In
              inflation-adjusted terms, wages were{" "}
              <span className="font-semibold">
                {fmtMoney(metrics.minReal.real)}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              CPI trend over time
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              This chart shows how the Consumer Price Index changed over time,
              helping explain why nominal wages need to be adjusted for inflation.
            </p>
          </div>

          <div className="mt-6 h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={rows}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval={24} tick={{ fontSize: 12 }} />
                <YAxis domain={["dataMin", "dataMax"]} />
                <Tooltip
                  formatter={(value: any) => [fmtMoney(Number(value ?? 0)), "CPI"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey={(row) => Number(row["cpi_clean.cpi"]) || null}
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">What to notice</h3>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Nominal wages rise steadily over time, which can make it seem like
              workers are clearly earning more. But after adjusting for
              inflation, the increase is much smaller. That means a bigger
              paycheck does not automatically translate into stronger purchasing
              power.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">
              Why this matters for students
            </h3>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Students often feel rising costs first through rent, groceries,
              transportation, and tuition-related expenses. If prices grow
              faster than inflation-adjusted wages, everyday life becomes less
              affordable even when hourly pay appears to increase.
            </p>
          </div>
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-sm leading-relaxed text-slate-500">
            Data sources: Average Hourly Earnings (CES0500000003) and CPI
            (CPIAUCSL), downloaded via FRED/BLS. Inflation adjustment uses 2006
            as the base year.
          </p>
        </footer>
      </section>
    </main>
  );
}