"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import {
  Keyboard,
  Palette,
  Save,
  Download,
  Upload,
  SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";

interface SettingsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Settings({ open, onOpenChange }: SettingsProps) {
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const hotkeys = [
    { key: "⌘A", description: "Add item" },
    { key: "⌘S", description: "Open settings" },
  ];

  const exportData = () => {
    // This would export the current calculator state
    const data = {
      items: [],
      settings: {
        autoSave,
        theme,
        compactMode,
      },
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jailbreak-calculator-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            // Handle imported data
            console.log("Imported data:", data);
          } catch (error) {
            console.error("Error importing data:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          {/*<TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>*/}

          <TabsContent value="general" className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
            <span className="text-xs text-muted-foreground">
              Made with <span className="text-red-500">❤️</span> by{" "}
              <a
                href="https://logix.lol"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                logix.lol
              </a>
            </span>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Link
                href="https://github.com/logixism/jb-calculator"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Source</span>
                <SiGithub />
              </Link>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
