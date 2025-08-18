"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { Calculator } from "@/components/calculator";
import { Settings } from "@/components/settings";

export function HomeController() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rate, setRate] = useQueryState("rate", {
    defaultValue: 0.5,
    parse: (value) => parseFloat(value),
    serialize: (value) => value.toString(),
  });

  return (
    <main className="min-h-screen bg-background">
      <Calculator
        onSettingsOpen={() => setSettingsOpen(true)}
        rate={rate}
        setRate={setRate}
      />
      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  );
}
