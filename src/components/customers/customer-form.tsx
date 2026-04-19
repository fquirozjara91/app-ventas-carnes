'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Customer } from '@/types'
import { createCustomer, updateCustomer } from '@/app/(dashboard)/customers/actions'

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string(),
  address: z.string(),
  notes: z.string(),
})

type FormData = z.infer<typeof schema>

export default function CustomerForm({ customer }: { customer?: Customer }) {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const isEdit = !!customer

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      address: customer?.address ?? '',
      notes: customer?.notes ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    const result = isEdit
      ? await updateCustomer(customer.id, data)
      : await createCustomer(data)

    if (result.error) {
      setServerError(result.error)
      return
    }
    router.push('/customers')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full max-w-lg">
      {/* Nombre */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
          Nombre *
        </label>
        <input
          {...register('name')}
          placeholder="Ej: Juan Pérez"
          className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
          Teléfono
        </label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="+56 9 1234 5678"
          className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
        />
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
          Dirección
        </label>
        <input
          {...register('address')}
          placeholder="Ej: Av. Principal 123, Santiago"
          className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
        />
      </div>

      {/* Notas */}
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
          Notas
        </label>
        <textarea
          {...register('notes')}
          placeholder="Observaciones, preferencias, horarios de entrega..."
          rows={3}
          className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors resize-none"
        />
      </div>

      {/* Error del servidor */}
      {serverError && (
        <div className="bg-red-950 border border-red-800 px-4 py-3">
          <p className="text-red-400 text-sm">{serverError}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-300 disabled:text-zinc-500 text-white font-bold py-2.5 px-6 uppercase tracking-widest text-sm transition-colors"
        >
          {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear cliente'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-bold py-2.5 px-6 uppercase tracking-widest text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
