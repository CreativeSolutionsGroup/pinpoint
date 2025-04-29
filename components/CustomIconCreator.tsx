"use client";

import { icons, LucideIcon } from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateIcon } from "@/lib/api/create/CreateIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Fuse from "fuse.js";
import { AlertCircle } from "lucide-react";

const CustomIconCreator = ({
  open,
  onOpenChange,
  onIconsChange,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIconsChange: (refresh: boolean) => void;
  categories: {
    id: string;
    title: string;
    value: string;
    items: {
      icon: LucideIcon;
      label: string;
    }[];
  }[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [customName, setCustomName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<
    [string, React.ComponentType] | null
  >(null);

  const fuse = useMemo(() => {
    const iconEntries = Object.entries(icons).map(([name, component]) => ({
      name,
      component,
    }));

    return new Fuse(iconEntries, {
      keys: ["name"],
      threshold: 0.4,
    });
  }, []);

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return Object.entries(icons);

    const results = fuse.search(searchQuery);
    return results.map((result) => [result.item.name, result.item.component]);
  }, [searchQuery, fuse]);

  const handleIconClick = (icon: [string, React.ComponentType]) => {
    setSelectedIcon(icon);
    setError(null);

    const formattedName = (icon[0] as string)
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    setCustomName(formattedName);
    setCategoryDialogOpen(true);
  };

  const handleDone = async () => {
    const categoryId = categories.find(
      (category) => category.value === selectedCategory
    )?.id;

    try {
      await CreateIcon(
        selectedIcon![0] as string,
        customName.trim(),
        categoryId!
      );

      setCategoryDialogOpen(false);
      onOpenChange(false);
      onIconsChange(true);
      setSelectedIcon(null);
      setSelectedCategory("");
      setCustomName("");
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("Unique constraint failed")) {
        setError("This icon name already exists in this category");
      } else {
        setError("Failed to create icon");
      }
    }
  };

  const handleCancel = () => {
    setCategoryDialogOpen(false);
    setSelectedCategory("");
    setCustomName("");
    setError(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col overflow-hidden border-none [&>button]:z-20">
          <div className="sticky top-0 z-10 bg-white pb-2">
            <DialogHeader>
              <DialogTitle>Select Icon</DialogTitle>
            </DialogHeader>

            <div className="px-6 pt-6 w-full">
              <input
                type="text"
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="p-6 pt-2 max-w-6xl mx-auto w-full overflow-y-auto">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                {filteredIcons.map(([name, Icon]) => (
                  <div
                    key={name as string}
                    className="p-2 border rounded flex items-center justify-center bg-gray-50 hover:bg-gray-200 h-12 w-12 cursor-pointer"
                    onClick={() =>
                      handleIconClick([
                        name as string,
                        Icon as React.ComponentType,
                      ])
                    }
                  >
                    <Icon size={22} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-sm">
                <p>No icons found matching search query.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md border-none">
          <DialogHeader>
            <DialogTitle>Customize Icon</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedIcon && (
              <div className="flex justify-center mb-4">
                {React.createElement(selectedIcon[1])}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="custom-name">Name</Label>
              <Input
                id="custom-name"
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-select">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setError(null);
                }}
              >
                <SelectTrigger id="category-select" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleDone}
              disabled={!selectedCategory || !customName.trim()}
            >
              Add Icon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomIconCreator;
