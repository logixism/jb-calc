"use client";

import React from "react";
import {
  Settings,
  Save,
  CalculatorIcon,
  ChartLine,
  ChartSpline,
  ChartColumnBig,
  ChartColumn,
  ChartColumnIncreasing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import Link from "next/link";

interface CalculatorHeaderProps {
  onSettingsOpen?: () => void;
  onSaveOpen?: () => void;
}

export function CalculatorHeader({
  onSettingsOpen,
  onSaveOpen,
}: CalculatorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-center justify-center gap-4">
      <div>
        <Link className="flex gap-2 items-center" href={"https://jbcalc.app/"}>
          <CalculatorIcon className="text-primary" />
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold text-primary">
            Jailbreak Calculator
          </h1>
        </Link>
        <p className="text-muted-foreground">Calculate your item values</p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="https://discord.gg/2WnrMrgMZW">
          <Button size={"sm"} variant={"outline"}>
            <SiDiscord />
            Need help?
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={() => onSaveOpen?.()}>
          <Save className="h-4 w-4" />
          Save
          <Kbd>⌘S</Kbd>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onSettingsOpen?.()}>
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
