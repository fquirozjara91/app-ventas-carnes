'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

type Props = {
  q: string
  comuna: string
  comunas: string[]
}

export default function CustomerFilters({ q: initialQ, comuna: initialComuna, comunas }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ)
  const [comuna, setComuna] = useState(initialComuna)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = (newQ: string, newComuna: string) => {
    const params = new URLSearchParams()
    if (newQ) params.set('q', newQ)
    if (newComuna) params.set('comuna', newComuna)
    const qs = params.toString()
    router.push(`/customers${qs ? `?${qs}` : ''}`)
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => navigate(q, comuna), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [q])

  const handleComunaChange = (newComuna: string) => {
    setComuna(newComuna)
    navigate(q, newComuna)
  }

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nombre, teléfono o RUT..."
        className="w-full sm:max-w-sm bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
      />

      {comunas.length > 0 && (
        <select
          value={comuna}
          onChange={(e) => handleComunaChange(e.target.value)}
          className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          <option value="">Todas las comunas</option>
          {comunas.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
    </div>
  )
}
