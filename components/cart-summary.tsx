"use client"

import { useState } from "react"
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
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup")
  const [address, setAddress] = useState("")
  const [scheduleType, setScheduleType] = useState<"now" | "scheduled">("now")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [submitMessage, setSubmitMessage] = useState("")

  const handlePinLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("อุปกรณ์ไม่รองรับการระบุตำแหน่ง")
      return
    }

    setLocationError("")

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setAddress(
          `ตำแหน่งปัจจุบัน (${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)})`
        )
      },
      () => {
        setLocationError("ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้")
      }
    )
  }

  const handleSubmitOrder = async () => {
    setSubmitMessage("")

    if (orderType === "delivery" && !address.trim()) {
      setSubmitMessage("กรุณากรอกที่อยู่สำหรับจัดส่ง")
      return
    }

    if (scheduleType === "scheduled" && !scheduledTime) {
      setSubmitMessage("กรุณาระบุเวลาที่ต้องการ")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table_number: 0,
          items,
          total_price: totalPrice,
          order_type: orderType,
          address: orderType === "delivery" ? address.trim() : null,
          scheduled_time:
            scheduleType === "scheduled" ? new Date(scheduledTime).toISOString() : null,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setSubmitMessage(payload?.error || "ไม่สามารถส่งคำสั่งซื้อได้")
        return
      }

      setSubmitMessage("สั่งซื้อเรียบร้อยแล้ว")
      clearCart()
      setIsCartOpen(false)
    } catch {
      setSubmitMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ")
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <div className="mb-4 space-y-4 rounded-xl border border-border p-3">
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">ประเภทการรับสินค้า</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderType("pickup")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    orderType === "pickup"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-secondary-foreground"
                  }`}
                >
                  รับเองที่ร้าน
                </button>
                <button
                  onClick={() => setOrderType("delivery")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    orderType === "delivery"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-secondary-foreground"
                  }`}
                >
                  ให้ร้านไปส่ง
                </button>
              </div>
            </div>

            {orderType === "delivery" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="delivery-address">
                  ที่อยู่จัดส่ง
                </label>
                <textarea
                  id="delivery-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="กรอกที่อยู่สำหรับจัดส่ง"
                  className="min-h-[72px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
                />
                <button
                  onClick={handlePinLocation}
                  className="w-full rounded-lg border border-border bg-secondary py-2 text-xs font-semibold text-secondary-foreground"
                >
                  ปักหมุดตำแหน่งปัจจุบัน
                </button>
                {locationError && (
                  <p className="text-xs text-destructive">{locationError}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">เวลาที่ต้องการรับสินค้า</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setScheduleType("now")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    scheduleType === "now"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-secondary-foreground"
                  }`}
                >
                  ทำทันที
                </button>
                <button
                  onClick={() => setScheduleType("scheduled")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    scheduleType === "scheduled"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-secondary-foreground"
                  }`}
                >
                  ระบุเวลา
                </button>
              </div>
              {scheduleType === "scheduled" && (
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(event) => setScheduledTime(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
                />
              )}
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-bold text-primary">
              {totalPrice}&#3647;
            </span>
          </div>
          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "กำลังส่งคำสั่งซื้อ..." : "Confirm Order"}
          </button>
          {submitMessage && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {submitMessage}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
