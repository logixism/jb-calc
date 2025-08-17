"use client";

import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { FullItem, GameItem } from "@/lib/items";
import { formatValue } from "@/lib/utils";
import ImageOrPlaceholder from "./image-or-placeholder";
import { Input } from "./ui/input";

interface ItemCardProps {
  item: FullItem;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

export function ItemCard({ item, onRemove, onUpdateQuantity }: ItemCardProps) {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleIncrement = (event: React.MouseEvent) => {
    let increment = 1;
    if (event.ctrlKey) {
      increment = 10;
    } else if (event.shiftKey) {
      increment = 5;
    }
    handleQuantityChange(item.amount + increment);
  };

  const handleDecrement = (event: React.MouseEvent) => {
    let decrement = 1;
    if (event.ctrlKey) {
      decrement = 10;
    } else if (event.shiftKey) {
      decrement = 5;
    }
    handleQuantityChange(item.amount - decrement);
  };

  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-md transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
            <Badge variant="outline" className="mt-1 rounded-md">
              {item.category}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="h-7 w-7 rounded-sm p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-lg flex items-center justify-center">
          <ImageOrPlaceholder
            src={item.imageUrl}
            alt={item.name}
            width={256}
            height={256}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatValue(item.value * item.amount)}
          </span>

          <div className="flex items-center border-border gap-2 border rounded-xl px-2 py-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-xl hover:bg-background"
              onClick={handleDecrement}
            >
              <Minus />
            </Button>
            <span className="text-sm font-medium text-secondary">
              {item.amount}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-xl hover:bg-background"
              onClick={handleIncrement}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
