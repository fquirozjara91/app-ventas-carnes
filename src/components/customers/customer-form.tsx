'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Customer } from '@/types'
import { createCustomer, updateCustomer } from '@/app/(dashboard)/customers/actions'

function validateChileanRut(rutStr: string): boolean {
  const parts = rutStr.split('-')
  if (parts.length !== 2) return false
  const [body, dv] = parts
  if (!dv || dv.length !== 1) return false
  const num = parseInt(body, 10)
  if (isNaN(num) || num <= 0) return false

  let sum = 0
  let multiplier = 2
  let temp = num
  while (temp > 0) {
    sum += (temp % 10) * multiplier
    temp = Math.floor(temp / 10)
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const remainder = 11 - (sum % 11)
  const calculated = remainder === 11 ? '0' : remainder === 10 ? 'K' : remainder.toString()
  return calculated.toUpperCase() === dv.toUpperCase()
}

const COMUNAS = [
  'Santiago (Centro)', 'Cerrillos', 'Cerro Navia', 'Colina', 'Conchalí',
  'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'Lampa',
  'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina',
  'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú',
  'Ñuñoa', 'Padre Hurtado', 'Pedro Aguirre Cerda', 'Peñalolén', 'Pirque',
  'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal',
  'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín', 'San José de Maipo',
  'San Miguel', 'San Ramón', 'Til Til', 'Vitacura',
]

const schema = z.object({
  rut: z
    .string()
    .refine(
      (v) => v === '' || /^\d{7,8}-[\dKk]$/.test(v),
      'Formato inválido. Ejemplo: 12345678-9'
    )
    .refine(
      (v) => v === '' || validateChileanRut(v),
      'El RUT ingresado no es válido'
    ),
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string(),
  address: z.string(),
  comuna: z.string().refine(
    (v) => v === '' || COMUNAS.includes(v),
    'Selecciona una comuna válida de la lista'
  ),
  notes: z.string(),
})

type FormData = z.infer<typeof schema>

function rutToString(rut: number | null, dv: string | null): string {
  if (!rut || !dv) return ''
  return `${rut}-${dv}`
}

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
      rut: rutToString(customer?.rut ?? null, customer?.dv ?? null),
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      address: customer?.address ?? '',
      comuna: customer?.comuna ?? '',
      notes: customer?.notes ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setServerError('')

    let rutParsed: { rut: number | null; dv: string | null } = { rut: null, dv: null }
    if (data.rut) {
      const [body, dv] = data.rut.split('-')
      rutParsed = { rut: parseInt(body, 10), dv: dv.toUpperCase() }
    }

    const result = isEdit
      ? await updateCustomer(customer.id, { ...data, ...rutParsed })
      : await createCustomer({ ...data, ...rutParsed })

    if (result.error) {
      setServerError(result.error)
      return
    }
    router.push('/customers')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full max-w-lg">
      {/* RUT */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          RUT
        </label>
        <input
          {...register('rut')}
          placeholder="12345678-9"
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        {errors.rut ? (
          <p className="text-red-500 text-xs mt-1">{errors.rut.message}</p>
        ) : (
          <p className="text-zinc-400 text-xs mt-1">Sin puntos, con guión. Ej: 12345678-9</p>
        )}
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Nombre *
        </label>
        <input
          {...register('name')}
          placeholder="Ej: Juan Pérez"
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Teléfono
        </label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="+56 9 1234 5678"
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Dirección
        </label>
        <input
          {...register('address')}
          placeholder="Ej: Av. Principal 123, Santiago"
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Comuna */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Comuna
        </label>
        <input
          {...register('comuna')}
          list="comunas-list"
          placeholder="Selecciona o escribe una comuna"
          autoComplete="off"
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        <datalist id="comunas-list">
          {COMUNAS.map((c) => <option key={c} value={c} />)}
        </datalist>
        {errors.comuna && (
          <p className="text-red-500 text-xs mt-1">{errors.comuna.message}</p>
        )}
      </div>

      {/* Notas */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Notas
        </label>
        <textarea
          {...register('notes')}
          placeholder="Observaciones, preferencias, horarios de entrega..."
          rows={3}
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
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
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 px-6 uppercase tracking-widest text-sm transition-colors"
        >
          {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear cliente'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-6 uppercase tracking-widest text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
