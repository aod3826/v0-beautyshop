import { KDSDashboard } from "@/components/kds-dashboard"
import { SimplePinGate } from "@/components/simple-pin-gate"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "หน้าครัว | Beautyshop KDS",
  description: "ระบบหน้าครัวสำหรับจัดการออเดอร์",
}

export default function KitchenPage() {
  return (
    <SimplePinGate storageKey="kitchen_pin_passed" pin="1234" title="Kitchen Access">
      <KDSDashboard />
    </SimplePinGate>
  )
}
