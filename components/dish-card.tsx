"use client"

import { Plus } from "lucide-react"
import type { MenuItem } from "@/lib/menu-data"
import { useCart } from "@/lib/cart-context"

interface DishCardProps {
  item: MenuItem
  onCustomize?: (item: MenuItem) => void
}

export function DishCard({ item, onCustomize }: DishCardProps) {
  const { addItem } = useCart()

  const handleAdd = () => {
    if (item.isCustomizable && onCustomize) {
      onCustomize(item)
    } else {
      addItem({
        id: item.id,
        name: item.name,
        nameTh: item.nameTh,
        price: item.price,
        image: item.image,
      })
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.nameTh}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        {item.isCustomizable && (
          <span className="absolute left-2 top-2 rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-medium text-primary-foreground">
            ปรับได้
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2 p-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-card-foreground">
            {item.nameTh}
          </h3>
          <p className="text-xs font-light text-muted-foreground">{item.name}</p>
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          <p className="mt-1.5 text-base font-bold text-primary">
            {item.price}
            <span className="text-xs font-normal">&#3647;</span>
          </p>
        </div>
        <button
          onClick={handleAdd}
          aria-label={`เพิ่ม ${item.nameTh} ลงตะกร้า`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
