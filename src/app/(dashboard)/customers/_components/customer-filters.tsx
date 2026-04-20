'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

type Props = {
  q: string
}

export default function CustomerFilters({ q: initialQ }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      const qs = params.toString()
      router.push(`/customers${qs ? `?${qs}` : ''}`)
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [q])

  return (
    <div className="mb-6">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nombre, teléfono o RUT..."
        className="w-full max-w-sm bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
      />
    </div>
  )
}
