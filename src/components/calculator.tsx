import React from "react";
import { CalculatorController } from "./calculator-controller";

interface CalculatorProps {
  onSettingsOpen?: () => void;
}

export function Calculator({ onSettingsOpen }: CalculatorProps) {
  return <CalculatorController onSettingsOpen={onSettingsOpen} />;
}
