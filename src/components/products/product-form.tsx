'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Product } from '@/types'
import { createProduct, updateProduct } from '@/app/(dashboard)/products/actions'

const schema = z.object({
  code: z.number({ error: 'El código es requerido' }).int().positive('El código debe ser un número positivo'),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  unit: z.string().min(1, 'Selecciona una unidad'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').nullable(),
  active: z.boolean(),
})

type FormData = z.infer<typeof schema>

const UNITS = ['kg', 'g', 'unidad', 'bandeja', 'paquete', 'porción']

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const isEdit = !!product

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: product?.code ?? undefined,
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price,
      unit: product?.unit ?? '',
      stock: product?.stock ?? null,
      active: product?.active ?? true,
    },
  })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    const payload = { ...data, stock: data.stock ?? null, description: data.description ?? '' }
    const result = isEdit
      ? await updateProduct(product.id, payload)
      : await createProduct(payload)

    if (result.error) {
      setServerError(result.error)
      return
    }
    router.push('/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full max-w-lg">
      {/* Código */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Código *
        </label>
        <input
          {...register('code', { valueAsNumber: true })}
          type="number"
          min="1"
          placeholder="Ej: 101"
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Nombre *
        </label>
        <input
          {...register('name')}
          placeholder="Ej: Lomo vetado"
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Descripción
        </label>
        <textarea
          {...register('description')}
          placeholder="Descripción opcional"
          rows={2}
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Precio + Unidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Precio *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm select-none">
              $
            </span>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Unidad *
          </label>
          <select
            {...register('unit')}
            className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="">Seleccionar...</option>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit.message}</p>}
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Stock (opcional)
        </label>
        <input
          {...register('stock', { setValueAs: (v: string) => v === '' ? null : parseInt(v, 10) })}
          type="number"
          min="0"
          placeholder="Dejar vacío si no aplica"
          className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
      </div>

      {/* Activo */}
      <div className="flex items-center gap-3 pt-1">
        <input
          {...register('active')}
          type="checkbox"
          id="active"
          className="w-4 h-4 accent-indigo-600"
        />
        <label htmlFor="active" className="text-sm font-medium text-zinc-700 cursor-pointer">
          Producto activo (visible al crear pedidos)
        </label>
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
          {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
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
