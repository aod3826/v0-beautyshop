"use client"

import { useEffect, useState, type ReactNode } from "react"

interface SimplePinGateProps {
  storageKey: string
  pin: string
  title: string
  children: ReactNode
}

export function SimplePinGate({ storageKey, pin, title, children }: SimplePinGateProps) {
  const [authorized, setAuthorized] = useState(false)
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const isUnlocked = window.sessionStorage.getItem(storageKey) === "true"
    if (isUnlocked) setAuthorized(true)
  }, [storageKey])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (value === pin) {
      window.sessionStorage.setItem(storageKey, "true")
      setAuthorized(true)
      setError("")
      return
    }
    setError("รหัสไม่ถูกต้อง กรุณาลองใหม่")
  }

  if (authorized) return <>{children}</>

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-zinc-400">กรอกรหัส PIN เพื่อเข้าใช้งาน</p>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoFocus
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
          placeholder="PIN"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-amber-500 px-4 py-2 font-semibold text-zinc-900"
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  )
}
