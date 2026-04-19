'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toggleProductActive, deleteProduct } from '../actions'

type Props = {
  id: string
  active: boolean
  name: string
}

export default function ProductActions({ id, active, name }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await toggleProductActive(id, !active)
    router.refresh()
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return
    setLoading(true)
    await deleteProduct(id)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-1 justify-end">
      <a
        href={`/products/${id}`}
        className="p-1.5 text-zinc-400 hover:text-zinc-700 transition-colors"
        title="Editar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </a>

      <button
        onClick={handleToggle}
        disabled={loading}
        title={active ? 'Desactivar' : 'Activar'}
        className="p-1.5 text-zinc-400 hover:text-zinc-700 disabled:opacity-40 transition-colors"
      >
        {active ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
            <circle cx="16" cy="12" r="3" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
            <circle cx="8" cy="12" r="3" />
          </svg>
        )}
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        title="Eliminar"
        className="p-1.5 text-zinc-400 hover:text-red-600 disabled:opacity-40 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  )
}
