"use client"

import { useState } from "react"
import { X, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import {
  noodleTypes,
  soupStyles,
  sizeOptions,
  extraOptions,
  type MenuItem,
} from "@/lib/menu-data"

interface NoodleBuilderProps {
  item: MenuItem
  onClose: () => void
}

export function NoodleBuilder({ item, onClose }: NoodleBuilderProps) {
  const { addItem } = useCart()
  const [step, setStep] = useState(1)
  const [selectedNoodle, setSelectedNoodle] = useState<string | null>(null)
  const [selectedSoup, setSelectedSoup] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("regular")
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])

  const totalSteps = 4

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedNoodle !== null
      case 2:
        return selectedSoup !== null
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  const calculatePrice = () => {
    let price = item.price
    const size = sizeOptions.find((s) => s.id === selectedSize)
    if (size) price += size.extra
    selectedExtras.forEach((extraId) => {
      const extra = extraOptions.find((e) => e.id === extraId)
      if (extra) price += extra.extra
    })
    return price
  }

  const handleAddToCart = () => {
    const noodle = noodleTypes.find((n) => n.id === selectedNoodle)
    const soup = soupStyles.find((s) => s.id === selectedSoup)
    const size = sizeOptions.find((s) => s.id === selectedSize)
    const extras = selectedExtras
      .map((id) => extraOptions.find((e) => e.id === id))
      .filter(Boolean)

    const options = [
      noodle ? `${noodle.name} (${noodle.nameTh})` : "",
      soup ? `${soup.name} (${soup.nameTh})` : "",
      size ? `${size.name} (${size.nameTh})` : "",
      ...extras.map((e) => `${e!.name} (${e!.nameTh})`),
    ].filter(Boolean)

    const uniqueId = `${item.id}-${selectedNoodle}-${selectedSoup}-${selectedSize}-${selectedExtras.sort().join("-")}-${Date.now()}`

    addItem({
      id: uniqueId,
      name: item.name,
      nameTh: item.nameTh,
      price: calculatePrice(),
      image: item.image,
      options,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-border px-4 py-3">
        <button
          onClick={onClose}
          aria-label="Close builder"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="text-sm font-semibold text-foreground">{item.name}</h2>
          <p className="text-xs text-muted-foreground">{item.nameTh}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {step}/{totalSteps}
        </span>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 py-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < step ? "bg-primary" : "bg-secondary"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {/* Step 1: Noodle Type */}
        {step === 1 && (
          <div>
            <h3 className="mb-1 text-lg font-bold text-foreground">
              Choose Your Noodle
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {"เลือกเส้น"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {noodleTypes.map((noodle) => (
                <button
                  key={noodle.id}
                  onClick={() => setSelectedNoodle(noodle.id)}
                  className={cn(
                    "relative overflow-hidden rounded-xl border-2 transition-all",
                    selectedNoodle === noodle.id
                      ? "border-primary shadow-lg shadow-primary/20"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={noodle.image}
                      alt={noodle.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="bg-card p-2 text-center">
                    <p className="text-sm font-semibold text-card-foreground">
                      {noodle.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{noodle.nameTh}</p>
                  </div>
                  {selectedNoodle === noodle.id && (
                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Soup Style */}
        {step === 2 && (
          <div>
            <h3 className="mb-1 text-lg font-bold text-foreground">
              Soup Style
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {"เลือกประเภทน้ำซุป"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {soupStyles.map((soup) => (
                <button
                  key={soup.id}
                  onClick={() => setSelectedSoup(soup.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-5 transition-all",
                    selectedSoup === soup.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <span className="text-base font-semibold text-card-foreground">
                    {soup.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{soup.nameTh}</span>
                  {selectedSoup === soup.id && (
                    <Check className="mt-1 h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Level Up */}
        {step === 3 && (
          <div>
            <h3 className="mb-1 text-lg font-bold text-foreground">
              Level Up
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {"เลือกขนาด"}
            </p>
            <div className="flex flex-col gap-3">
              {sizeOptions.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border-2 px-5 py-5 transition-all",
                    selectedSize === size.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className="text-left">
                    <p className="text-lg font-bold text-card-foreground">
                      {size.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{size.nameTh}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {size.extra > 0 && (
                      <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-sm font-semibold text-accent">
                        +{size.extra}&#3647;
                      </span>
                    )}
                    {selectedSize === size.id && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Extras */}
        {step === 4 && (
          <div>
            <h3 className="mb-1 text-lg font-bold text-foreground">
              Special Requests
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {"คำขอพิเศษ (ไม่ต้องเลือกก็ได้)"}
            </p>
            <div className="flex flex-col gap-3">
              {extraOptions.map((extra) => (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border-2 px-5 py-4 transition-all",
                    selectedExtras.includes(extra.id)
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className="text-left">
                    <p className="text-sm font-semibold text-card-foreground">
                      {extra.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{extra.nameTh}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {extra.extra > 0 && (
                      <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">
                        +{extra.extra}&#3647;
                      </span>
                    )}
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors",
                        selectedExtras.includes(extra.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {selectedExtras.includes(extra.id) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-primary">
            {calculatePrice()}&#3647;
          </span>
        </div>
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-xl border border-border bg-secondary py-3.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Back
            </button>
          )}
          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className={cn(
                "flex flex-[2] items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all",
                canProceed()
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              )}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:opacity-90"
            >
              Add to Cart - {calculatePrice()}&#3647;
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
