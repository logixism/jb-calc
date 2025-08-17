"use client";

import { useState } from "react";
import { Calculator } from "@/components/calculator";
import { Settings } from "@/components/settings";

export function HomeController() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <Calculator onSettingsOpen={() => setSettingsOpen(true)} />
      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  );
}
