"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { GameItem, ItemCategory, mapJbvResponse } from "@/lib/items";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { formatValue } from "@/lib/utils";
import { commandScore } from "@/lib/cmdk-commandscore";
import ImageOrPlaceholder from "./image-or-placeholder";
import { useJbvItemQuery } from "@/hooks/use-jbv-item-query";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemSelect: (item: GameItem) => void;
}

export function AddItemDialog({
  open,
  onOpenChange,
  onItemSelect,
}: AddItemDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { isPending, error, data: items } = useJbvItemQuery();

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      // requestAnimationFrame ensures that the scroll position is updated after the next repaint
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollTop = 0;
        }
      });
    }
  }, [open, searchQuery]);

  if (isPending) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl flex items-center justify-center min-h-[200px]">
          <span className="text-muted-foreground">Loading items...</span>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl flex items-center justify-center min-h-[200px]">
          <span className="text-destructive">
            Failed to load items. Please try again.
          </span>
        </DialogContent>
      </Dialog>
    );
  }

  const handleItemSelect = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      onItemSelect(item);
      onOpenChange(false);
      setSearchQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Search items..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList ref={listRef}>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup heading="Items">
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleItemSelect(item.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-12 h-8 flex items-center justify-center">
                      <ImageOrPlaceholder
                        src={item.imageUrl}
                        alt={item.name}
                        width={256}
                        height={256}
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatValue(item.value)}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
