'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const UNITS = ['kg', 'g', 'unidad', 'bandeja', 'paquete', 'porción']

type Props = {
  q: string
  unit: string
}

export default function ProductFilters({ q: initialQ, unit: initialUnit }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ)
  const [unit, setUnit] = useState(initialUnit)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = (newQ: string, newUnit: string) => {
    const params = new URLSearchParams()
    if (newQ) params.set('q', newQ)
    if (newUnit) params.set('unit', newUnit)
    const qs = params.toString()
    router.push(`/products${qs ? `?${qs}` : ''}`)
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => navigate(q, unit), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [q])

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit)
    navigate(q, newUnit)
  }

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar producto..."
        className="w-full sm:max-w-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
      />

      <select
        value={unit}
        onChange={(e) => handleUnitChange(e.target.value)}
        className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
      >
        <option value="">Todas las unidades</option>
        {UNITS.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
    </div>
  )
}
