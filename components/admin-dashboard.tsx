"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { MenuCategory } from "@/lib/menu-types"

type AdminTab = "home" | "menu"

interface OrderRecord {
  id: string
  status: string
  total_price: number
  created_at: string
}

interface MenuItemRecord {
  id: string
  name: string
  price: number
  category: MenuCategory
  image_url: string | null
  is_available: boolean | null
}

interface MenuFormState {
  id?: string
  name: string
  price: string
  category: MenuCategory
  isAvailable: boolean
  imageFile: File | null
}

const defaultForm: MenuFormState = {
  name: "",
  price: "",
  category: "noodles",
  isAvailable: true,
  imageFile: null,
}

function getTodayRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start: start.toISOString(), end: end.toISOString() }
}

export function AdminDashboard() {
  const supabase = useMemo(() => createClient(), [])
  const [tab, setTab] = useState<AdminTab>("home")
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [form, setForm] = useState<MenuFormState>(defaultForm)

  const refreshOrders = async () => {
    const { start, end } = getTodayRange()
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, total_price, created_at")
      .gte("created_at", start)
      .lt("created_at", end)

    if (error) {
      console.error("Load orders failed", error)
      return
    }

    setOrders(data ?? [])
  }

  const refreshMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, name, price, category, image_url, is_available")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Load menu items failed", error)
      return
    }

    setMenuItems(data ?? [])
  }

  useEffect(() => {
    void refreshOrders()
    void refreshMenuItems()
  }, [])

  const todayCompletedSales = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + Number(order.total_price), 0)
  const todayOrderCount = orders.length
  const pendingOrders = orders.filter((order) => order.status === "pending").length

  const handleOpenCreate = () => {
    setForm(defaultForm)
    setOpenModal(true)
  }

  const handleOpenEdit = (item: MenuItemRecord) => {
    setForm({
      id: item.id,
      name: item.name,
      price: String(item.price),
      category: item.category,
      isAvailable: item.is_available ?? true,
      imageFile: null,
    })
    setOpenModal(true)
  }

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop() ?? "jpg"
    const path = `menu/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from("menu-images")
      .upload(path, file, { upsert: true })

    if (error) throw error

    const { data } = supabase.storage.from("menu-images").getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let imageUrl: string | null = null
    if (form.imageFile) {
      imageUrl = await uploadImage(form.imageFile)
    }

    const payload = {
      name: form.name,
      name_th: form.name,
      price: Number(form.price),
      category: form.category,
      image_url: imageUrl,
      is_available: form.isAvailable,
    }

    if (form.id) {
      const { error } = await supabase
        .from("menu_items")
        .update(payload)
        .eq("id", form.id)

      if (error) {
        console.error("Update menu failed", error)
        return
      }
    } else {
      const { error } = await supabase.from("menu_items").insert(payload)
      if (error) {
        console.error("Create menu failed", error)
        return
      }
    }

    setOpenModal(false)
    setForm(defaultForm)
    void refreshMenuItems()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id)
    if (error) {
      console.error("Delete menu failed", error)
      return
    }
    void refreshMenuItems()
  }

  const toggleAvailability = async (item: MenuItemRecord, checked: boolean) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: checked })
      .eq("id", item.id)

    if (error) {
      console.error("Toggle availability failed", error)
      return
    }

    setMenuItems((prev) =>
      prev.map((menu) =>
        menu.id === item.id ? { ...menu, is_available: checked } : menu
      )
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 text-zinc-900">
      <div className="mx-auto max-w-6xl space-y-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button className={`rounded px-4 py-2 ${tab === "home" ? "bg-zinc-900 text-white" : "bg-white"}`} onClick={() => setTab("home")}>หน้าสรุป</button>
          <button className={`rounded px-4 py-2 ${tab === "menu" ? "bg-zinc-900 text-white" : "bg-white"}`} onClick={() => setTab("menu")}>จัดการเมนู</button>
        </div>

        {tab === "home" ? (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded bg-white p-4 shadow">
              <p className="text-sm text-zinc-500">ยอดขายวันนี้</p>
              <p className="text-2xl font-semibold">฿{todayCompletedSales.toLocaleString()}</p>
            </div>
            <div className="rounded bg-white p-4 shadow">
              <p className="text-sm text-zinc-500">จำนวนออเดอร์วันนี้</p>
              <p className="text-2xl font-semibold">{todayOrderCount}</p>
            </div>
            <div className="rounded bg-white p-4 shadow">
              <p className="text-sm text-zinc-500">ออเดอร์ที่รอดำเนินการ</p>
              <p className="text-2xl font-semibold">{pendingOrders}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={handleOpenCreate} className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white">เพิ่มเมนูใหม่</button>
            <div className="overflow-x-auto rounded bg-white shadow">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-zinc-100 text-sm">
                  <tr>
                    <th className="p-3">ชื่อเมนู</th>
                    <th className="p-3">ราคา</th>
                    <th className="p-3">หมวดหมู่</th>
                    <th className="p-3">พร้อมขาย</th>
                    <th className="p-3">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">฿{item.price}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={item.is_available ?? true}
                            onChange={(event) => toggleAvailability(item, event.target.checked)}
                          />
                          <span>{item.is_available ? "เปิด" : "ปิด"}</span>
                        </label>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenEdit(item)} className="rounded bg-sky-600 px-3 py-1.5 text-white">แก้ไข</button>
                          <button onClick={() => handleDelete(item.id)} className="rounded bg-rose-600 px-3 py-1.5 text-white">ลบ</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded bg-white p-5">
            <h2 className="text-xl font-semibold">{form.id ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}</h2>
            <input className="w-full rounded border px-3 py-2" placeholder="ชื่อเมนู" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <input className="w-full rounded border px-3 py-2" type="number" min="0" placeholder="ราคา" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} required />
            <select className="w-full rounded border px-3 py-2" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as MenuCategory }))}>
              <option value="noodles">noodles</option>
              <option value="rice">rice</option>
              <option value="sides">sides</option>
            </select>
            <input className="w-full rounded border px-3 py-2" type="file" accept="image/*" onChange={(e) => setForm((prev) => ({ ...prev, imageFile: e.target.files?.[0] ?? null }))} />
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((prev) => ({ ...prev, isAvailable: e.target.checked }))} />
              พร้อมขาย
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" className="rounded bg-zinc-200 px-4 py-2" onClick={() => setOpenModal(false)}>ยกเลิก</button>
              <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">บันทึก</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
