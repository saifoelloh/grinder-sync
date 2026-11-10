"use client";

import React, { useState, useMemo } from "react";
import {
    GRINDERS_DATASET,
    GrinderSpec,
    BrewMethod,
    stepToMicrons,
    micronsToTargetStep,
    getMicronsPerStep,
    getMethodStepBounds,
} from "@/lib/grind-engine";

const BREW_METHODS: BrewMethod[] = [
    "V60",
    "Pour Over",
    "Espresso",
    "Aeropress",
    "Filter Coffee Machine",
    "Steep-and-release",
    "Cupping",
    "French Press",
    "Moka Pot",
    "Siphon",
    "Cold Brew",
    "Cold Drip",
    "Turkish",
];

export default function GrindSyncApp() {
    const [darkMode, setDarkMode] = useState(true);

    // Default: Referensi Comandante C40 MK4 (20 klik) -> Target 1Zpresso ZP6 Special
    const [sourceGrinder, setSourceGrinder] = useState<GrinderSpec>(
        GRINDERS_DATASET[4] // Comandante C40 MK4
    );
    const [targetGrinder, setTargetGrinder] = useState<GrinderSpec>(
        GRINDERS_DATASET[1] // 1Zpresso ZP6 Special
    );
    const [sourceStep, setSourceStep] = useState<number>(20);
    const [selectedMethod, setSelectedMethod] = useState<BrewMethod>("V60");

    // State untuk Bottom Sheet pemilih grinder di Mobile
    const [pickerMode, setPickerMode] = useState<"source" | "target" | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState("");

    // 1. Hitung mikron dari Grinder Referensi
    const activeMicrons = useMemo(
        () => stepToMicrons(sourceGrinder, sourceStep),
        [sourceGrinder, sourceStep]
    );

    // 2. Konversi mikron ke Grinder Tujuan (Target)
    const targetResult = useMemo(
        () => micronsToTargetStep(targetGrinder, activeMicrons),
        [targetGrinder, activeMicrons]
    );

    // 3. Format tampilan teks untuk kedua grinder
    const sourceFormatted = useMemo(
        () => sourceGrinder.formatStep(sourceStep),
        [sourceGrinder, sourceStep]
    );
    const targetFormatted = useMemo(
        () => targetGrinder.formatStep(targetResult.snappedStep),
        [targetGrinder, targetResult.snappedStep]
    );

    // 4. Evaluasi Sweet Spot berdasarkan metode seduh yang dipilih
    const sourceBounds = useMemo(
        () => getMethodStepBounds(sourceGrinder, selectedMethod),
        [sourceGrinder, selectedMethod]
    );
    const targetBounds = useMemo(
        () => getMethodStepBounds(targetGrinder, selectedMethod),
        [targetGrinder, selectedMethod]
    );

    const isTargetInSweetSpot = useMemo(() => {
        if (!targetBounds || targetResult.status !== "OK") return false;
        return (
            targetResult.snappedStep >= targetBounds.minStep &&
            targetResult.snappedStep <= targetBounds.maxStep
        );
    }, [targetBounds, targetResult]);

    // Fungsi bantu getar haptik ringan di perangkat mobile
    const triggerHaptic = () => {
        if (typeof window !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate(8);
        }
    };

    const handleStepChange = (delta: number) => {
        triggerHaptic();
        setSourceStep((prev) =>
            Math.min(sourceGrinder.totalSteps, Math.max(0, prev + delta))
        );
    };

    const handleSwapGrinders = () => {
        triggerHaptic();
        const prevSource = sourceGrinder;
        const prevTarget = targetGrinder;
        const newSourceStep = targetResult.snappedStep;
        setSourceGrinder(prevTarget);
        setTargetGrinder(prevSource);
        setSourceStep(newSourceStep);
    };

    const filteredGrinders = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return GRINDERS_DATASET;
        return GRINDERS_DATASET.filter(
            (g) =>
                g.brand.toLowerCase().includes(q) ||
                g.productName.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    return (
        <div className={darkMode ? "dark" : ""}>
            <main className="h-[100dvh] w-full bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between items-center overflow-hidden select-none">
                {/* Container Mobile-First (Max 440px di tengah layar) */}
                <div className="w-full max-w-[440px] h-full flex flex-col justify-between p-4 sm:p-5">

                    {/* HEADER TIPIS */}
                    <header className="flex items-center justify-between h-10 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                            <span className="font-mono-tabular text-xs font-bold tracking-[0.18em] uppercase">
                                GrindSync
                            </span>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="px-2.5 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px] font-medium text-[var(--text-secondary)] active:scale-95 transition"
                            aria-label="Toggle color theme"
                        >
                            {darkMode ? "◐ Dark OLED" : "◑ Paper Lab"}
                        </button>
                    </header>

                    {/* =========================================================
              ZONA ATAS: EYE ZONE (OUTPUT GRINDER GUE - BEBAS JARI)
             ========================================================= */}
                    <section className="flex-1 flex flex-col justify-between rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 my-2 relative overflow-hidden">
                        {/* Baris Pilih Grinder Tujuan */}
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                                    Target · Grinder Gue
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setPickerMode("target");
                                    }}
                                    className="mt-0.5 text-left group flex items-center gap-1.5"
                                >
                                    <span className="text-base font-semibold tracking-tight group-hover:underline">
                                        {targetGrinder.brand} {targetGrinder.productName}
                                    </span>
                                    <span className="text-xs text-[var(--text-muted)]">▾</span>
                                </button>
                                <p className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                                    Range: {targetGrinder.minMicrons}–{targetGrinder.maxMicrons} μm
                                    {" · "}±{getMicronsPerStep(targetGrinder)} μm/klik
                                </p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tabular border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                                Pinned
                            </span>
                        </div>

                        {/* HERO TYPOGRAPHY (Fokus Utama Level 1) */}
                        {targetResult.status === "OK" ? (
                            <div className="my-auto py-2 text-center">
                                <div className="font-mono-tabular text-7xl font-bold tracking-tighter leading-none">
                                    {targetFormatted.display}
                                </div>
                                <p className="mt-2 text-xs font-medium text-[var(--text-secondary)]">
                                    {targetFormatted.helper}
                                </p>
                            </div>
                        ) : (
                            <div className="my-auto py-4 px-3 rounded-xl border border-dashed border-[var(--text-muted)] bg-out-of-range text-center">
                                <p className="font-mono-tabular text-xl font-bold tracking-tight uppercase">
                                    Out of Range
                                </p>
                                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                    {targetResult.status === "TOO_FINE"
                                        ? `Di bawah batas halus ${targetGrinder.productName} (Min: ${targetGrinder.minMicrons} μm pada dial ${targetGrinder.formatStep(0).display})`
                                        : `Di atas batas kasar ${targetGrinder.productName} (Max: ${targetGrinder.maxMicrons} μm pada dial ${targetGrinder.formatStep(targetGrinder.totalSteps).display})`}
                                </p>
                            </div>
                        )}

                        {/* Status Sweet Spot Monokrom */}
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs">
                            <span className="text-[var(--text-secondary)]">
                                Acuan {selectedMethod}:{" "}
                                <strong className="font-mono-tabular text-[var(--text-primary)]">
                                    {targetBounds ? targetBounds.rawLabel : "N/A"}
                                </strong>
                            </span>

                            {!targetBounds ? (
                                <span className="px-2.5 py-0.5 rounded-full border border-dashed border-[var(--text-muted)] text-[11px] text-[var(--text-muted)]">
                                    ✕ Metode N/A
                                </span>
                            ) : isTargetInSweetSpot ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-Fg)] text-[11px] font-medium">
                                    ● Masuk Zona {selectedMethod}
                                </span>
                            ) : (
                                <span className="px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
                                    ○ Di Luar Zona {selectedMethod}
                                </span>
                            )}
                        </div>
                    </section>

                    {/* =========================================================
              JEMBATAN MIKRON & TOMBOL SWAP
             ========================================================= */}
                    <div className="flex items-center justify-center gap-3 my-1 shrink-0">
                        <div className="h-[1px] flex-1 bg-[var(--border-subtle)]" />
                        <div className="px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono-tabular text-xs font-semibold">
                            ~ {activeMicrons} μm
                        </div>
                        <button
                            onClick={handleSwapGrinders}
                            className="h-8 px-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-medium flex items-center gap-1 active:scale-95 transition"
                            title="Tukar Grinder Referensi dan Target"
                        >
                            <span>Swap</span>
                            <span>⇅</span>
                        </button>
                        <div className="h-[1px] flex-1 bg-[var(--border-subtle)]" />
                    </div>

                    {/* =========================================================
              ZONA BAWAH: THUMB ZONE (KONTROL INTERAKTIF JEMPOL)
             ========================================================= */}
                    <section className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 sm:p-5 mt-2 shrink-0 flex flex-col gap-4">

                        {/* Horizontal Pill Selector: Metode Seduh */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                                    Filter Metode Seduh
                                </span>
                                <span className="font-mono-tabular text-[10px] text-[var(--text-muted)]">
                                    Geser →
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                                {BREW_METHODS.map((method) => {
                                    const active = selectedMethod === method;
                                    return (
                                        <button
                                            key={method}
                                            onClick={() => {
                                                triggerHaptic();
                                                setSelectedMethod(method);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition shrink-0 ${active
                                                    ? "bg-[var(--accent-primary)] text-[var(--accent-Fg)]"
                                                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                                                }`}
                                        >
                                            {active ? `● ${method}` : method}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Baris Pilih Grinder Referensi */}
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                                    Dari Grinder Referensi
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setPickerMode("source");
                                    }}
                                    className="mt-0.5 text-left flex items-center gap-1.5 group"
                                >
                                    <span className="text-sm font-semibold group-hover:underline">
                                        {sourceGrinder.brand} {sourceGrinder.productName}
                                    </span>
                                    <span className="text-xs text-[var(--text-muted)]">▾</span>
                                </button>
                            </div>
                            <div className="text-right font-mono-tabular text-[11px] text-[var(--text-secondary)]">
                                <div>Zona {selectedMethod}:</div>
                                <div className="font-semibold text-[var(--text-primary)]">
                                    {sourceBounds ? sourceBounds.rawLabel : "N/A"}
                                </div>
                            </div>
                        </div>

                        {/* Stepper 48x48px & Nilai Input Referensi */}
                        <div className="flex items-center justify-between gap-3">
                            <button
                                onClick={() => handleStepChange(-1)}
                                disabled={sourceStep <= 0}
                                className="h-12 w-14 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono-tabular text-xl font-bold flex items-center justify-center active:scale-95 disabled:opacity-30 transition"
                                aria-label="Kurangi 1 klik"
                            >
                                −
                            </button>

                            <div className="text-center flex-1">
                                <div className="font-mono-tabular text-3xl font-bold tracking-tight">
                                    {sourceFormatted.display}
                                </div>
                                <div className="text-[11px] text-[var(--text-secondary)] truncate">
                                    {sourceFormatted.helper}
                                </div>
                            </div>

                            <button
                                onClick={() => handleStepChange(1)}
                                disabled={sourceStep >= sourceGrinder.totalSteps}
                                className="h-12 w-14 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono-tabular text-xl font-bold flex items-center justify-center active:scale-95 disabled:opacity-30 transition"
                                aria-label="Tambah 1 klik"
                            >
                                +
                            </button>
                        </div>

                        {/* Tactile Slider dengan Highlight Blok Zona Metode Seduh */}
                        <div className="pt-1">
                            <div className="relative h-7 flex items-center">
                                {/* Track Dasar */}
                                <div className="w-full h-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden relative">
                                    {/* Blok Sweet Spot Metode Seduh */}
                                    {sourceBounds && (
                                        <div
                                            className="absolute top-0 bottom-0 bg-[var(--text-muted)] opacity-50"
                                            style={{
                                                left: `${(sourceBounds.minStep / sourceGrinder.totalSteps) * 100}%`,
                                                width: `${((sourceBounds.maxStep - sourceBounds.minStep) /
                                                        sourceGrinder.totalSteps) *
                                                    100
                                                    }%`,
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Input Range Interaktif */}
                                <input
                                    type="range"
                                    min={0}
                                    max={sourceGrinder.totalSteps}
                                    step={1}
                                    value={sourceStep}
                                    onChange={(e) => {
                                        triggerHaptic();
                                        setSourceStep(parseInt(e.target.value, 10));
                                    }}
                                    className="tactile-slider absolute inset-0 w-full h-full"
                                />
                            </div>

                            {/* Label Batas Bawah, Sweet Spot, dan Batas Atas Slider */}
                            <div className="flex justify-between font-mono-tabular text-[10px] text-[var(--text-muted)] mt-1">
                                <span>
                                    {sourceGrinder.formatStep(0).display} ({sourceGrinder.minMicrons}μm)
                                </span>
                                {sourceBounds && (
                                    <span className="text-[var(--text-secondary)]">
                                        [{selectedMethod}: {sourceBounds.rawLabel}]
                                    </span>
                                )}
                                <span>
                                    {sourceGrinder.formatStep(sourceGrinder.totalSteps).display} (
                                    {sourceGrinder.maxMicrons}μm)
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* =========================================================
            BOTTOM SHEET DRAWER: PEMILIH GRINDER (ERGONOMI JEMPOL)
           ========================================================= */}
                {pickerMode && (
                    <div
                        className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
                        onClick={() => setPickerMode(null)}
                    >
                        <div
                            className="w-full max-w-[440px] bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] rounded-t-2xl p-5 flex flex-col gap-3 max-h-[75dvh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                                    Pilih{" "}
                                    {pickerMode === "target"
                                        ? "Grinder Gue (Target)"
                                        : "Grinder Referensi"}
                                </span>
                                <button
                                    onClick={() => setPickerMode(null)}
                                    className="text-xs text-[var(--text-secondary)] px-2 py-1"
                                >
                                    Tutup ✕
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder="Cari brand atau tipe (misal: ZP6, 078, C40)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm focus:outline-none"
                            />

                            <div className="overflow-y-auto divide-y divide-[var(--border-subtle)]">
                                {filteredGrinders.map((g) => {
                                    const isSelected =
                                        pickerMode === "target"
                                            ? g.id === targetGrinder.id
                                            : g.id === sourceGrinder.id;

                                    return (
                                        <button
                                            key={g.id}
                                            onClick={() => {
                                                triggerHaptic();
                                                if (pickerMode === "target") {
                                                    setTargetGrinder(g);
                                                } else {
                                                    // Pertahankan nilai mikron saat mengganti grinder referensi
                                                    const mapped = micronsToTargetStep(g, activeMicrons);
                                                    setSourceGrinder(g);
                                                    setSourceStep(mapped.snappedStep);
                                                }
                                                setPickerMode(null);
                                            }}
                                            className="w-full py-3 px-2 flex items-center justify-between text-left hover:bg-[var(--bg-elevated)] transition rounded-lg"
                                        >
                                            <div>
                                                <div className="text-sm font-semibold">
                                                    {g.brand} {g.productName}
                                                </div>
                                                <div className="font-mono-tabular text-[11px] text-[var(--text-secondary)]">
                                                    {g.minMicrons}–{g.maxMicrons} μm · {g.scaleType}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <span className="font-mono-tabular text-xs font-bold px-2 py-0.5 rounded bg-[var(--accent-primary)] text-[var(--accent-Fg)]">
                                                    Aktif
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}