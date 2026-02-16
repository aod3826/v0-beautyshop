"use client"

import { useState } from "react"
import { MenuHeader } from "@/components/menu-header"
import { CategoryTabs } from "@/components/category-tabs"
import { DishCard } from "@/components/dish-card"
import { NoodleBuilder } from "@/components/noodle-builder"
import { FloatingCart } from "@/components/floating-cart"
import { CartSummary } from "@/components/cart-summary"
import { CartProvider } from "@/lib/cart-context"
import { menuItems, type MenuItem } from "@/lib/menu-data"

function MenuContent() {
  const [activeCategory, setActiveCategory] = useState<"noodles" | "rice" | "sides">("noodles")
  const [builderItem, setBuilderItem] = useState<MenuItem | null>(null)

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory
  )

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      <MenuHeader />
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Menu Grid */}
      <main className="px-4 py-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <DishCard
              key={item.id}
              item={item}
              onCustomize={(menuItem) => setBuilderItem(menuItem)}
            />
          ))}
        </div>
      </main>

      {/* Floating Cart */}
      <FloatingCart />

      {/* Cart Summary */}
      <CartSummary />

      {/* Noodle Builder Modal */}
      {builderItem && (
        <NoodleBuilder
          item={builderItem}
          onClose={() => setBuilderItem(null)}
        />
      )}
    </div>
  )
}

export function MenuPage() {
  return (
    <CartProvider>
      <MenuContent />
    </CartProvider>
  )
}
