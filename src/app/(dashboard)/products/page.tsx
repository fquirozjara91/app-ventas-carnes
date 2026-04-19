import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductActions from './_components/product-actions'
import ProductFilters from './_components/product-filters'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; unit?: string }>
}) {
  const { q = '', unit = '' } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('products').select('*').order('code', { ascending: true, nullsFirst: false })
  if (q) query = query.ilike('name', `%${q}%`)
  if (unit) query = query.eq('unit', unit)

  const { data: products } = await query

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Productos</h1>
          <p className="text-zinc-500 text-sm mt-1">{products?.length ?? 0} productos</p>
        </div>
        <Link
          href="/products/new"
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-5 uppercase tracking-widest text-sm transition-colors"
        >
          + Nuevo
        </Link>
      </div>

      <ProductFilters q={q} unit={unit} />

      {/* Lista */}
      {products && products.length > 0 ? (
        <div className="flex flex-col gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-zinc-200 px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {product.code != null && (
                    <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5">
                      #{product.code}
                    </span>
                  )}
                  <p className="font-semibold text-zinc-900 text-sm">{product.name}</p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
                      product.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-zinc-100 text-zinc-400'
                    }`}
                  >
                    {product.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {product.description && (
                  <p className="text-zinc-400 text-xs mt-0.5 truncate">{product.description}</p>
                )}
                <p className="text-zinc-500 text-xs mt-1">
                  <span className="font-mono font-semibold text-zinc-700">
                    ${product.price.toLocaleString('es-CL', { minimumFractionDigits: 0 })}
                  </span>
                  {' · '}
                  {product.unit}
                  {product.stock != null && ` · Stock: ${product.stock}`}
                </p>
              </div>

              <ProductActions
                id={product.id}
                active={product.active}
                name={product.name}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 p-12 text-center">
          <p className="text-zinc-400 font-medium">
            {q || unit ? 'Sin resultados para los filtros aplicados' : 'No hay productos aún'}
          </p>
          {!q && !unit && (
            <Link
              href="/products/new"
              className="inline-block mt-4 text-red-600 hover:text-red-500 text-sm font-bold uppercase tracking-widest"
            >
              Crear primer producto →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
