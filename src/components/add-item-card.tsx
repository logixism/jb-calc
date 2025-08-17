"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";

interface AddItemCardProps {
  onClick: () => void;
}

export function AddItemCard({ onClick }: AddItemCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
      onClick={onClick}
    >
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-center">
          <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Add Item</p>
          <Kbd className="mt-2">⌘A</Kbd>
        </div>
      </CardContent>
    </Card>
  );
}
