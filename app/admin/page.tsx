import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin-dashboard"
import { SimplePinGate } from "@/components/simple-pin-gate"

export const metadata: Metadata = {
  title: "แอดมิน | Beautyshop",
  description: "ระบบจัดการร้านค้าและเมนู",
}

export default function AdminPage() {
  return (
    <SimplePinGate storageKey="admin_pin_passed" pin="1234" title="Admin Access">
      <AdminDashboard />
    </SimplePinGate>
  )
}
