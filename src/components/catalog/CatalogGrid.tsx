"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { CatalogItem } from "@/data/types";
import { GridBackground } from "../shared/GridBackground";
import { SectionHeader } from "../shared/SectionHeader";
import { CategoryFilter } from "./CategoryFilter";
import { CatalogCard } from "./CatalogCard";
import { CatalogDetail } from "./CatalogDetail";

type Props = {
  title: string;
  subtitle: string;
  command: string;
  items: CatalogItem[];
  categories: { key: string; label: string; color: string }[];
};

export function CatalogGrid({ title, subtitle, command, items, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const filteredItems = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count: items.filter((item) => item.category === cat.key).length,
  }));

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <SectionHeader command={command} />
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-text-secondary text-lg mb-8 max-w-2xl">{subtitle}</p>

        <CategoryFilter
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredItems.map((item) => (
            <CatalogCard
              key={item.name}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>

        <p className="text-center text-xs text-text-muted mt-6 font-mono">
          Click any item to see details
        </p>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <CatalogDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
