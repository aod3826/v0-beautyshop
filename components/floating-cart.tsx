"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function FloatingCart() {
  const { totalItems, totalPrice, setIsCartOpen } = useCart()

  if (totalItems === 0) return null

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-2xl shadow-primary/40 transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            {totalItems}
          </span>
        </div>
        <span className="text-sm font-semibold">View Cart</span>
      </div>
      <span className="text-base font-bold">{totalPrice}&#3647;</span>
    </button>
  )
}
