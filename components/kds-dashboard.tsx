"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Flame, Clock, CheckCircle2, History, ChefHat } from "lucide-react"

interface OrderItem {
  name: string
  nameTh: string
  quantity: number
  price: number
  options?: string[]
}

interface Order {
  id: string
  table_number: number
  status: "pending" | "cooking" | "done"
  items: OrderItem[]
  total_price: number
  created_at: string
  updated_at: string
}

function getElapsedTime(createdAt: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / 1000
  )
  if (diff < 60) return `${diff}s`
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m`
}

function getTimerColor(createdAt: string, status: string): string {
  if (status === "done") return "text-green-400"
  const mins = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / 1000 / 60
  )
  if (mins >= 10) return "text-red-400"
  if (mins >= 5) return "text-amber-400"
  return "text-zinc-400"
}

function OrderTicket({
  order,
  onStatusChange,
}: {
  order: Order
  onStatusChange: (id: string, status: "cooking" | "done") => void
}) {
  const [elapsed, setElapsed] = useState(getElapsedTime(order.created_at))
  const [timerColor, setTimerColor] = useState(
    getTimerColor(order.created_at, order.status)
  )

  useEffect(() => {
    if (order.status === "done") return
    const interval = setInterval(() => {
      setElapsed(getElapsedTime(order.created_at))
      setTimerColor(getTimerColor(order.created_at, order.status))
    }, 1000)
    return () => clearInterval(interval)
  }, [order.created_at, order.status])

  const statusBorder =
    order.status === "cooking"
      ? "border-amber-500"
      : order.status === "done"
        ? "border-green-500"
        : "border-zinc-600"

  const statusBg =
    order.status === "cooking"
      ? "bg-amber-500/10"
      : order.status === "done"
        ? "bg-green-500/10"
        : "bg-zinc-900"

  return (
    <div
      className={`flex w-72 flex-shrink-0 flex-col rounded-lg border-2 ${statusBorder} ${statusBg} transition-colors md:w-80`}
    >
      {/* Ticket Header */}
      <div
        className={`flex items-center justify-between rounded-t-md px-4 py-3 ${
          order.status === "cooking"
            ? "bg-amber-500/20"
            : order.status === "done"
              ? "bg-green-500/20"
              : "bg-zinc-800"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-100">
            TABLE {order.table_number}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 ${timerColor}`}>
          <Clock className="h-4 w-4" />
          <span className="text-lg font-semibold tabular-nums">{elapsed}</span>
        </div>
      </div>

      {/* Ticket Items */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="border-b border-zinc-700/50 pb-2 last:border-b-0 last:pb-0">
            <div className="flex gap-2">
              <span className="text-lg font-bold text-zinc-100">
                [{item.quantity}x]
              </span>
              <div className="flex-1">
                <span className="text-lg font-semibold text-zinc-100">
                  {item.nameTh || item.name}
                </span>
                {item.options && item.options.length > 0 && (
                  <p className="text-base leading-snug text-amber-300/90">
                    {item.options.join(" - ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Actions */}
      <div className="flex gap-2 border-t border-zinc-700/40 px-3 py-3">
        {order.status === "pending" && (
          <button
            onClick={() => onStatusChange(order.id, "cooking")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3.5 text-base font-bold text-zinc-900 transition-all hover:bg-amber-400 active:scale-[0.97]"
          >
            <Flame className="h-5 w-5" />
            {"กำลังทำ"}
          </button>
        )}
        {order.status === "cooking" && (
          <button
            onClick={() => onStatusChange(order.id, "done")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3.5 text-base font-bold text-zinc-900 transition-all hover:bg-green-400 active:scale-[0.97]"
          >
            <CheckCircle2 className="h-5 w-5" />
            {"เสร็จแล้ว / เสิร์ฟ"}
          </button>
        )}
        {order.status === "done" && (
          <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500/20 px-4 py-3.5 text-base font-bold text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            {"เสิร์ฟแล้ว"}
          </div>
        )}
      </div>
    </div>
  )
}

export function KDSDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [view, setView] = useState<"active" | "history">("active")
  const [now, setNow] = useState(Date.now())

  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setOrders(data as Order[])
    }
  }, [supabase])

  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new as Order, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === (payload.new as Order).id
                  ? (payload.new as Order)
                  : o
              )
            )
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) =>
              prev.filter((o) => o.id !== (payload.old as Order).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchOrders, supabase])

  // Update clock for timer refresh
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = async (
    id: string,
    newStatus: "cooking" | "done"
  ) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (!error) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, status: newStatus, updated_at: new Date().toISOString() }
            : o
        )
      )
    }
  }

  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "cooking"
  )
  const completedOrders = orders.filter((o) => o.status === "done")
  const pendingCount = orders.filter((o) => o.status === "pending").length
  const cookingCount = orders.filter((o) => o.status === "cooking").length

  const displayOrders = view === "active" ? activeOrders : completedOrders

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* KDS Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <ChefHat className="h-7 w-7 text-amber-500" />
          <h1 className="text-xl font-bold text-zinc-100 md:text-2xl">
            Kitchen Display
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
            <span className="text-base font-bold text-red-400">
              {"รอ: "}{pendingCount}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />
            <span className="text-base font-bold text-amber-400">
              {"ทำอยู่: "}{cookingCount}
            </span>
          </div>
        </div>

        <div className="flex rounded-lg border border-zinc-700 bg-zinc-800 p-0.5">
          <button
            onClick={() => setView("active")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-all ${
              view === "active"
                ? "bg-amber-500 text-zinc-900"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Flame className="h-4 w-4" />
            Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setView("history")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-all ${
              view === "history"
                ? "bg-green-500 text-zinc-900"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <History className="h-4 w-4" />
            History ({completedOrders.length})
          </button>
        </div>
      </header>

      {/* Order Tickets */}
      <main className="flex-1 overflow-x-auto p-4 md:p-6">
        {displayOrders.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <ChefHat className="mx-auto mb-3 h-16 w-16 text-zinc-700" />
              <p className="text-xl font-bold text-zinc-600">
                {view === "active"
                  ? "ไม่มีออเดอร์ค้าง"
                  : "ยังไม่มีประวัติ"}
              </p>
              <p className="text-sm text-zinc-700">
                {view === "active"
                  ? "Waiting for new orders..."
                  : "Completed orders will appear here"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 pb-4">
            {displayOrders.map((order) => (
              <OrderTicket
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer status bar */}
      <footer className="border-t border-zinc-800 bg-zinc-900 px-4 py-2 text-center">
        <span className="text-xs text-zinc-600">
          Live updates via Supabase Realtime &mdash; Last refresh:{" "}
          {new Date(now).toLocaleTimeString("th-TH")}
        </span>
      </footer>
    </div>
  )
}
