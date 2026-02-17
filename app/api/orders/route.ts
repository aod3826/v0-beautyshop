import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      table_number,
      items,
      total_price,
      order_type,
      delivery_address,
      latitude,
      longitude,
      scheduled_time,
    } = body

    const validOrderTypes = ["pickup", "delivery"]
    const normalizedOrderType =
      typeof order_type === "string" ? order_type.toLowerCase() : "pickup"

    const parsedLatitude =
      latitude === undefined || latitude === null ? null : Number(latitude)
    const parsedLongitude =
      longitude === undefined || longitude === null ? null : Number(longitude)

    const parsedScheduledTime =
      typeof scheduled_time === "string"
        ? new Date(scheduled_time)
        : scheduled_time instanceof Date
          ? scheduled_time
          : null

    if (!table_number || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      )
    }

    if (!validOrderTypes.includes(normalizedOrderType)) {
      return NextResponse.json(
        { error: "order_type must be pickup or delivery" },
        { status: 400 }
      )
    }

    if (normalizedOrderType === "delivery" && !delivery_address) {
      return NextResponse.json(
        { error: "delivery_address is required for delivery orders" },
        { status: 400 }
      )
    }

    if (
      parsedLatitude !== null &&
      (Number.isNaN(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90)
    ) {
      return NextResponse.json(
        { error: "latitude must be a valid value between -90 and 90" },
        { status: 400 }
      )
    }

    if (
      parsedLongitude !== null &&
      (Number.isNaN(parsedLongitude) ||
        parsedLongitude < -180 ||
        parsedLongitude > 180)
    ) {
      return NextResponse.json(
        { error: "longitude must be a valid value between -180 and 180" },
        { status: 400 }
      )
    }

    if (
      parsedScheduledTime &&
      Number.isNaN(parsedScheduledTime.getTime())
    ) {
      return NextResponse.json(
        { error: "scheduled_time must be a valid timestamp" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("orders")
      .insert({
        table_number,
        items,
        total_price,
        order_type: normalizedOrderType,
        delivery_address: delivery_address ?? null,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        scheduled_time: parsedScheduledTime
          ? parsedScheduledTime.toISOString()
          : null,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }

    return NextResponse.json({ order: data }, { status: 201 })
  } catch (err) {
    console.error("Order API error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
