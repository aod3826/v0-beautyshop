"use client"

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CartSummary() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart()

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <button
          onClick={() => setIsCartOpen(false)}
          aria-label="Close cart"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-base font-bold text-foreground">Your Order</h2>
        {items.length > 0 ? (
          <button
            onClick={clearCart}
            className="text-xs text-destructive hover:underline"
          >
            Clear
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
            <p className="text-xs text-muted-foreground">
              {"เพิ่มอาหารจากเมนูได้เลย"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-xl border border-border bg-card p-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      {item.nameTh}
                    </p>
                    {item.options && item.options.length > 0 && (
                      <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                        {item.options.join(" / ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">
                      {item.price * item.quantity}&#3647;
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.id)
                            : updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                      </button>
                      <span className="w-5 text-center text-sm font-semibold text-card-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold text-primary">
              {totalPrice}&#3647;
            </span>
          </div>
          <button className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:opacity-90 active:scale-[0.98]">
            Confirm Order
          </button>
        </div>
      )}
    </div>
  )
}
