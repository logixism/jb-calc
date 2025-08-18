import React from "react";
import { CalculatorController } from "./calculator-controller";

interface CalculatorProps {
  onSettingsOpen?: () => void;
  rate: number;
  setRate: (value: number) => void;
}

export function Calculator({ onSettingsOpen, rate, setRate }: CalculatorProps) {
  return (
    <CalculatorController
      onSettingsOpen={onSettingsOpen}
      rate={rate}
      setRate={setRate}
    />
  );
}
