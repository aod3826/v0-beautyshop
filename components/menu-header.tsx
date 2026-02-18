"use client"

import { MapPin } from "lucide-react"

export function MenuHeader() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero-noodles.jpg"
          alt="ก๋วยเตี๋ยวสตรีทฟู้ดไทย"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>
      <div className="relative flex flex-col items-center px-4 pb-8 pt-10">
        <div className="mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-xs font-light tracking-widest uppercase text-muted-foreground">
            สตรีทฟู้ดไทย
          </span>
        </div>
        <h1 className="text-balance text-center text-3xl font-bold tracking-tight text-foreground">
          Beautyshop
        </h1>
        <p className="mt-1 text-sm font-light text-muted-foreground">
          ก๋วยเตี๋ยวและอาหารตามสั่ง
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
          <span className="text-xs font-medium text-primary">โต๊ะ: 5</span>
        </div>
      </div>
    </header>
  )
}
