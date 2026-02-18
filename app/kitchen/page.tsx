import { KDSDashboard } from "@/components/kds-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "หน้าครัว | Beautyshop KDS",
  description: "ระบบหน้าครัวสำหรับจัดการออเดอร์",
}

export default function KitchenPage() {
  return <KDSDashboard />
}
