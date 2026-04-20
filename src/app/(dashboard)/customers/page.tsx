import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CustomerActions from './_components/customer-actions'
import CustomerFilters from './_components/customer-filters'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  const { data: all } = await supabase.from('customers').select('*').order('name')

  const customers = q
    ? (all ?? []).filter((c) => {
        const qLower = q.toLowerCase()
        const numericQ = q.replace(/[.\-\s]/g, '')
        return (
          c.name.toLowerCase().includes(qLower) ||
          (c.phone && c.phone.toLowerCase().includes(qLower)) ||
          (c.rut && c.rut.toString().includes(numericQ))
        )
      })
    : (all ?? [])

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Clientes</h1>
          <p className="text-zinc-500 text-sm mt-1">{customers?.length ?? 0} clientes</p>
        </div>
        <Link
          href="/customers/new"
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-5 uppercase tracking-widest text-sm transition-colors"
        >
          + Nuevo
        </Link>
      </div>

      <CustomerFilters q={q ?? ''} />

      {/* Lista */}
      {customers && customers.length > 0 ? (
        <div className="flex flex-col gap-2">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white border border-zinc-200 px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-zinc-900 text-sm">{customer.name}</p>
                  {customer.rut && customer.dv && (
                    <span className="font-mono text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5">
                      {customer.rut.toLocaleString('es-CL')}-{customer.dv}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-3 mt-0.5">
                  {customer.phone && (
                    <p className="text-zinc-400 text-xs">{customer.phone}</p>
                  )}
                  {customer.address && (
                    <p className="text-zinc-400 text-xs truncate">{customer.address}</p>
                  )}
                </div>
                {customer.notes && (
                  <p className="text-zinc-400 text-xs mt-0.5 italic truncate">{customer.notes}</p>
                )}
              </div>

              <CustomerActions id={customer.id} name={customer.name} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 p-12 text-center">
          <p className="text-zinc-400 font-medium">
            {q ? `Sin resultados para "${q}"` : 'No hay clientes aún'}
          </p>
          {!q && (
            <Link
              href="/customers/new"
              className="inline-block mt-4 text-red-600 hover:text-red-500 text-sm font-bold uppercase tracking-widest"
            >
              Crear primer cliente →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
