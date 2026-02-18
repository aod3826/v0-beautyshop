"use client"

import { useEffect, useMemo, useState } from "react"
import { MenuHeader } from "@/components/menu-header"
import { CategoryTabs } from "@/components/category-tabs"
import { DishCard } from "@/components/dish-card"
import { NoodleBuilder } from "@/components/noodle-builder"
import { FloatingCart } from "@/components/floating-cart"
import { CartSummary } from "@/components/cart-summary"
import { CartProvider } from "@/lib/cart-context"
import { createClient } from "@/lib/supabase/client"
import type { MenuCategory, MenuItem } from "@/lib/menu-types"

interface MenuItemRecord {
  id: string
  name: string
  name_th: string | null
  description: string | null
  price: number
  image_url: string | null
  category: MenuCategory
  is_customizable: boolean | null
  is_available: boolean | null
}

function normalizeMenuItem(record: MenuItemRecord): MenuItem {
  return {
    id: record.id,
    name: record.name,
    nameTh: record.name_th ?? record.name,
    description: record.description ?? "",
    price: Number(record.price),
    image: record.image_url ?? "/images/hero-noodles.jpg",
    category: record.category,
    isCustomizable: record.is_customizable ?? false,
    isAvailable: record.is_available ?? true,
  }
}

function MenuContent() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("noodles")
  const [builderItem, setBuilderItem] = useState<MenuItem | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const supabase = createClient()

    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select(
          "id, name, name_th, description, price, image_url, category, is_customizable, is_available"
        )
        .eq("is_available", true)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Failed to load menu items", error)
        return
      }

      setMenuItems((data ?? []).map(normalizeMenuItem))
    }

    void fetchMenuItems()
  }, [])

  const filteredItems = useMemo(
    () => menuItems.filter((item) => item.category === activeCategory),
    [activeCategory, menuItems]
  )

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      <MenuHeader />
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

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

      <FloatingCart />
      <CartSummary />

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
