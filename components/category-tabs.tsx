"use client"

import { cn } from "@/lib/utils"

const categories = [
  { id: "noodles" as const, name: "Noodles", nameTh: "ก๋วยเตี๋ยว", icon: "🍜" },
  { id: "rice" as const, name: "Rice Dishes", nameTh: "อาหารจานเดียว", icon: "🍚" },
  { id: "sides" as const, name: "Sides/Drinks", nameTh: "ของทานเล่น/น้ำ", icon: "🥤" },
]

interface CategoryTabsProps {
  activeCategory: "noodles" | "rice" | "sides"
  onCategoryChange: (category: "noodles" | "rice" | "sides") => void
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
      <nav className="flex" role="tablist" aria-label="Menu categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 px-2 py-3 text-center transition-colors",
              activeCategory === cat.id
                ? "border-b-2 border-primary text-primary"
                : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="text-lg" aria-hidden="true">{cat.icon}</span>
            <span className="text-[11px] font-medium leading-tight">{cat.name}</span>
            <span className="text-[10px] font-light leading-tight text-muted-foreground">
              {cat.nameTh}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}
