"use client";

import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  CalculatorItem,
  FullItem,
  GameItem,
  mapJbvResponse,
} from "@/lib/items";
import { CalculatorHeader } from "./calculator-header";
import { TotalValueCard } from "./total-value-card";
import { AddItemCard } from "./add-item-card";
import { ItemCard } from "./item-card";
import { useQueryState } from "nuqs";
import { AddItemDialog } from "./add-item-dialog";
import { SaveCalculatorDialog } from "./save-calculator-dialog";
import { useQuery } from "@tanstack/react-query";
import { useJbvItemQuery } from "@/hooks/use-jbv-item-query";

interface CalculatorControllerProps {
  onSettingsOpen?: () => void;
}

const SERIALIZATION_KEY_DELIMITER = ",";
const SERIALIZATION_ITEM_DELIMITER = "|";

function serializeCalcItems(value: Array<CalculatorItem>) {
  const mini = value
    .map((item) => `${item.id}${SERIALIZATION_KEY_DELIMITER}${item.amount}`)
    .join(SERIALIZATION_ITEM_DELIMITER);
  return mini;
}

function fullItemFromCalc(
  calcItem: CalculatorItem,
  allItems: GameItem[],
): FullItem {
  const item = allItems?.find((item) => item.id === calcItem.id);

  if (!item) {
    throw new Error(`Item with id ${calcItem.id} not found`);
  }

  return {
    ...item,
    amount: calcItem.amount,
  };
}

export function valueFromCalcItems(
  items: CalculatorItem[],
  allItems: GameItem[],
) {
  return items.reduce(
    (sum, calcItem) =>
      sum + fullItemFromCalc(calcItem, allItems).value * calcItem.amount,
    0,
  );
}

function deserializeCalcItems(value: string) {
  return value.split(SERIALIZATION_ITEM_DELIMITER).map((item) => {
    const [id, amount] = item.split(SERIALIZATION_KEY_DELIMITER);
    return { id, amount: parseInt(amount) };
  });
}

export function CalculatorController({
  onSettingsOpen,
}: CalculatorControllerProps) {
  const [calculatorItems, setItems] = useQueryState<CalculatorItem[]>("", {
    defaultValue: [],
    parse: deserializeCalcItems,
    serialize: serializeCalcItems,
  });
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  useHotkeys("ctrl+a, cmd+a", (e) => {
    e.preventDefault();
    setAddItemOpen(true);
  });

  useHotkeys("ctrl+s, cmd+s", (e) => {
    e.preventDefault();
    setSaveDialogOpen(true);
  });

  const { isPending, data: allItems } = useJbvItemQuery();

  if (isPending || !allItems) {
    return <div>Loading...</div>;
  }

  const totalValue = valueFromCalcItems(calculatorItems, allItems);

  const addCalcItem = (item: GameItem, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((calcItem) => calcItem.id === item.id);

      if (existingItem) {
        return prev.map((calcItem) =>
          calcItem.id === item.id
            ? { ...calcItem, amount: calcItem.amount + quantity }
            : calcItem,
        );
      } else {
        return [...prev, { id: item.id, amount: quantity }];
      }
    });
  };

  const removeCalcItem = (itemId: string) => {
    setItems((prev) => prev.filter((calcItem) => calcItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeCalcItem(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((calcItem) =>
        calcItem.id === itemId
          ? { ...calcItem, amount: newQuantity }
          : calcItem,
      ),
    );
  };

  const clearAll = () => {
    setItems([]);
  };

  const loadCalculator = (items: CalculatorItem[]) => {
    setItems(items);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <CalculatorHeader
        onSettingsOpen={onSettingsOpen}
        onSaveOpen={() => setSaveDialogOpen(true)}
      />

      {/* Total Value */}
      <TotalValueCard totalValue={totalValue} onClearAll={clearAll} />

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Add Item Card */}
        <AddItemCard onClick={() => setAddItemOpen(true)} />

        {/* Item Cards */}
        {calculatorItems.map((calcItem) => (
          <ItemCard
            key={calcItem.id}
            item={fullItemFromCalc(calcItem, allItems)}
            onRemove={removeCalcItem}
            onUpdateQuantity={updateQuantity}
          />
        ))}
      </div>

      {/* Add Item Dialog */}
      <AddItemDialog
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        onItemSelect={addCalcItem}
      />

      {/* Save Calculator Dialog */}
      <SaveCalculatorDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        currentItems={calculatorItems}
        onLoadCalculator={loadCalculator}
      />
    </div>
  );
}
