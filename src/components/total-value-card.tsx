"use client";

import React from "react";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatValue } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Separator } from "./ui/separator";
import { useLocalStorage } from "usehooks-ts";

interface TotalValueCardProps {
  onClearAll: () => void;
  totalValue: number;
  rate: number;
  onChangeRate: (value: number) => void;
}

export function TotalValueCard({
  totalValue,
  onClearAll,
  rate,
  onChangeRate,
}: TotalValueCardProps) {
  const [showCrosstradingUtils, setShowCrosstradingUtils] = useLocalStorage(
    "showCrosstradingUtils",
    true
  );

  const adjustedValueWithRate = totalValue * rate;

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <div>
            <Label className="text-sm font-medium">Total Value</Label>
            <div className="text-2xl font-bold text-primary">
              {formatValue(totalValue)}
            </div>
          </div>
          <Button
            variant={"destructive"}
            className="flex justify-between items-center"
            onClick={onClearAll}
          >
            <Trash2 /> Clear all items
          </Button>
        </div>
        <Collapsible
          open={showCrosstradingUtils}
          onOpenChange={setShowCrosstradingUtils}
        >
          <CollapsibleTrigger asChild>
            <div className="flex flex-row gap-2 items-center cursor-pointer">
              <ArrowUpDown className="text-secondary" size={14} />
              <span className="text-secondary">Crosstrading utils</span>
              <Separator className="flex-1" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 pt-4">
              <div className="flex items-center text-sm font-medium">
                <Label htmlFor="rate">Adjusted Value (Total / 1M ×</Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  className="ml-1 w-20 h-5 text-center text-sm rounded-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e) =>
                    onChangeRate(parseFloat(e.target.value) || 0)
                  }
                />
                <span>)</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-4xl font-bold text-green-500">
                  $
                  {(adjustedValueWithRate / 1000000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
