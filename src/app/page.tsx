"use client";

import React from "react";
import { useGrindSync } from "../hooks/useGrindSync";
import { HeaderBar } from "../components/organisms/HeaderBar";
import { TargetGrinderCard } from "../components/organisms/TargetGrinderCard";
import { MicronBridge } from "../components/molecules/MicronBridge";
import { SourceGrinderCard } from "../components/organisms/SourceGrinderCard";
import { GrinderPickerSheet } from "../components/organisms/GrinderPickerSheet";

export default function GrindSyncPage() {
  const {
    darkMode,
    setDarkMode,
    sourceGrinder,
    targetGrinder,
    sourceStep,
    selectedMethod,
    pickerMode,
    setPickerMode,
    searchQuery,
    setSearchQuery,
    activeMicrons,
    targetResult,
    sourceFormatted,
    targetFormatted,
    sourceBounds,
    targetBounds,
    isTargetInSweetSpot,
    filteredGrinders,
    stepByDelta,
    updateSourceStep,
    swapGrinders,
    selectGrinderFromSheet,
    changeBrewMethod,
  } = useGrindSync();

  return (
    <div className={darkMode ? "dark" : ""}>
      <main className="h-[100dvh] w-full bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between items-center overflow-hidden select-none">
        <div className="w-full max-w-[440px] h-full flex flex-col justify-between p-4 sm:p-5">
          <HeaderBar
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />

          <TargetGrinderCard
            grinder={targetGrinder}
            formattedStep={targetFormatted}
            conversionResult={targetResult}
            selectedMethod={selectedMethod}
            methodBounds={targetBounds}
            isInSweetSpot={isTargetInSweetSpot}
            onOpenPicker={() => {
              setSearchQuery("");
              setPickerMode("target");
            }}
          />

          <MicronBridge microns={activeMicrons} onSwap={swapGrinders} />

          <SourceGrinderCard
            grinder={sourceGrinder}
            step={sourceStep}
            formattedStep={sourceFormatted}
            selectedMethod={selectedMethod}
            methodBounds={sourceBounds}
            onSelectMethod={changeBrewMethod}
            onStepByDelta={stepByDelta}
            onChangeStep={updateSourceStep}
            onOpenPicker={() => {
              setSearchQuery("");
              setPickerMode("source");
            }}
          />
        </div>

        <GrinderPickerSheet
          mode={pickerMode}
          grinders={filteredGrinders}
          activeGrinderId={
            pickerMode === "target" ? targetGrinder.id : sourceGrinder.id
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectGrinder={selectGrinderFromSheet}
          onClose={() => setPickerMode(null)}
        />
      </main>
    </div>
  );
}
