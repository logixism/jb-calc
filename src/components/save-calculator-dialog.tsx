"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Trash2, Download, Upload, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CalculatorItem } from "@/lib/items";
import { useJbvItemQuery } from "@/hooks/use-jbv-item-query";
import { valueFromCalcItems } from "./calculator-controller";
import { formatValue } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface SavedCalculatorV1 {
  id: string;
  name: string;
  items: CalculatorItem[];
  createdAt: string;
  updatedAt: string;
}

interface SavedCalculatorV2 extends SavedCalculatorV1 {
  version: 2;
  rate: number;
}

type SavedCalculator = SavedCalculatorV1 | SavedCalculatorV2;

const CURRENT_SAVE_VERSION = 2 as const;
type SavedCalculatorVersion = 1 | typeof CURRENT_SAVE_VERSION;

function getSavedCalculatorVersion(
  calculator: SavedCalculator
): SavedCalculatorVersion {
  return "version" in calculator ? calculator.version : 1;
}

interface SaveCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentItems: CalculatorItem[];
  onLoadCalculator: (items: CalculatorItem[]) => void;
  rate: number;
  onLoadRate: (rate: number) => void;
}

const STORAGE_KEY = "jb-calculator-saves";

function getSavedCalculators(): SavedCalculator[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading saved calculators:", error);
    return [];
  }
}

function saveCalculators(calculators: SavedCalculator[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calculators));
  } catch (error) {
    console.error("Error saving calculators:", error);
  }
}

export function SaveCalculatorDialog({
  open,
  onOpenChange,
  currentItems,
  onLoadCalculator,
  rate,
  onLoadRate,
}: SaveCalculatorDialogProps) {
  const [savedCalculators, setSavedCalculators] = useState<SavedCalculator[]>(
    []
  );
  const [saveName, setSaveName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { isPending, data: allItems } = useJbvItemQuery();

  useEffect(() => {
    if (open) {
      setSavedCalculators(getSavedCalculators());
      setEditingId(null);
      setSaveName("");
    }
  }, [open]);

  if (isPending || !allItems) return null;

  const handleSave = () => {
    if (!saveName.trim() || currentItems.length === 0) return;

    setIsSaving(true);

    let updatedCalculators: SavedCalculator[];

    if (editingId) {
      // Update existing save
      updatedCalculators = savedCalculators.map((calc) =>
        calc.id === editingId
          ? {
              ...calc,
              name: saveName.trim(),
              items: [...currentItems],
              updatedAt: new Date().toISOString(),
              // Always persist as V2 when updating
              rate,
              version: CURRENT_SAVE_VERSION,
            }
          : calc
      );
    } else {
      // Check if a save with this name already exists
      const existingSave = savedCalculators.find(
        (calc) => calc.name.toLowerCase() === saveName.trim().toLowerCase()
      );

      if (existingSave) {
        // Update existing save with same name
        updatedCalculators = savedCalculators.map((calc) =>
          calc.id === existingSave.id
            ? {
                ...calc,
                items: [...currentItems],
                updatedAt: new Date().toISOString(),
                // Persist as V2 on overwrite
                rate,
                version: CURRENT_SAVE_VERSION,
              }
            : calc
        );
      } else {
        // Create new save
        const newCalculator: SavedCalculatorV2 = {
          id: Date.now().toString(),
          name: saveName.trim(),
          items: [...currentItems],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rate,
          version: CURRENT_SAVE_VERSION,
        };
        updatedCalculators = [...savedCalculators, newCalculator];
      }
    }

    setSavedCalculators(updatedCalculators);
    saveCalculators(updatedCalculators);

    setSaveName("");
    setEditingId(null);
    setIsSaving(false);
  };

  const handleLoad = (calculator: SavedCalculator) => {
    onLoadCalculator(calculator.items);
    if ("rate" in calculator && typeof calculator.rate === "number") {
      onLoadRate(calculator.rate);
    }
    onOpenChange(false);
  };

  const handleEdit = (calculator: SavedCalculator) => {
    setSaveName(calculator.name);
    setEditingId(calculator.id);
  };

  const handleDelete = (id: string) => {
    const updatedCalculators = savedCalculators.filter(
      (calc) => calc.id !== id
    );
    setSavedCalculators(updatedCalculators);
    saveCalculators(updatedCalculators);
  };

  const handleCancelEdit = () => {
    setSaveName("");
    setEditingId(null);
  };

  const handleExport = () => {
    const data = {
      calculators: savedCalculators,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jb-calculator-saves-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
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
            if (data.calculators && Array.isArray(data.calculators)) {
              setSavedCalculators(data.calculators);
              saveCalculators(data.calculators);
            }
          } catch (error) {
            console.error("Error importing data:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            {editingId ? "Update Calculator" : "Save Calculator"}
          </DialogTitle>
          <DialogDescription>
            {editingId
              ? "Update the selected calculator with your current state."
              : "Save your current calculator state or load a previously saved one."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Save Current Calculator */}
          <div className="space-y-2">
            <Label htmlFor="save-name">
              {editingId ? "Update Calculator" : "Save Current Calculator"}
            </Label>
            <div className="flex gap-2">
              <Input
                id="save-name"
                placeholder="Enter save name..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  } else if (e.key === "Escape") {
                    handleCancelEdit();
                  }
                }}
              />
              <Button
                onClick={handleSave}
                disabled={
                  !saveName.trim() || currentItems.length === 0 || isSaving
                }
                size="sm"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={handleCancelEdit} size="sm">
                  Cancel
                </Button>
              )}
            </div>
            {currentItems.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add some items to your calculator before saving.
              </p>
            )}
            {editingId && (
              <p className="text-sm text-muted-foreground">
                This will update the existing save with your current calculator
                state.
              </p>
            )}
          </div>

          <Separator />

          {/* Saved Calculators List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Label>Saved Calculators</Label>
                <Badge variant={"outline"}>{savedCalculators.length}</Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={savedCalculators.length === 0}
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleImport}>
                  <Upload className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {savedCalculators.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No saved calculators yet.
              </p>
            ) : (
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {savedCalculators.map((calculator) => (
                    <div
                      key={calculator.id}
                      className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                        editingId === calculator.id
                          ? "border-2 border-primary"
                          : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate flex items-center gap-2">
                            <span>{calculator.name}</span>
                            <Badge variant="outline">
                              v{getSavedCalculatorVersion(calculator)}
                            </Badge>
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {calculator.items.length} items
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(calculator.updatedAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total:
                          {formatValue(
                            valueFromCalcItems(calculator.items, allItems)
                          )}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleLoad(calculator)}
                          disabled={!!editingId}
                        >
                          Load
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(calculator)}
                          disabled={
                            editingId !== null && editingId !== calculator.id
                          }
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(calculator.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
