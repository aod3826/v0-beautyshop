import { KDSDashboard } from "@/components/kds-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kitchen Display | Beautyshop KDS",
  description: "Kitchen Display System for order management",
}

export default function KitchenPage() {
  return <KDSDashboard />
}
