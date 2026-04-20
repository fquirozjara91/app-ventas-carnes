import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CustomerActions from './_components/customer-actions'
import CustomerFilters from './_components/customer-filters'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; comuna?: string }>
}) {
  const { q, comuna } = await searchParams
  const supabase = await createClient()

  const { data: all } = await supabase.from('customers').select('*').order('name')

  const comunasExistentes = Array.from(
    new Set((all ?? []).map((c) => c.comuna).filter(Boolean))
  ).sort() as string[]

  const customers = (all ?? []).filter((c) => {
    if (comuna && c.comuna !== comuna) return false
    if (q) {
      const qLower = q.toLowerCase()
      const numericQ = q.replace(/[.\-\s]/g, '')
      return (
        c.name.toLowerCase().includes(qLower) ||
        (c.phone && c.phone.toLowerCase().includes(qLower)) ||
        (c.rut && c.rut.toString().includes(numericQ))
      )
    }
    return true
  })

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Clientes</h1>
          <p className="text-slate-500 text-sm mt-1">{customers?.length ?? 0} clientes</p>
        </div>
        <Link
          href="/customers/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-lg uppercase tracking-widest text-sm transition-colors"
        >
          + Nuevo
        </Link>
      </div>

      <CustomerFilters q={q ?? ''} comuna={comuna ?? ''} comunas={comunasExistentes} />

      {/* Lista */}
      {customers && customers.length > 0 ? (
        <div className="flex flex-col gap-2">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900 text-sm">{customer.name}</p>
                  {customer.rut && customer.dv && (
                    <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5">
                      {customer.rut.toLocaleString('es-CL')}-{customer.dv}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-3 mt-0.5">
                  {customer.phone && (
                    <p className="text-slate-400 text-xs">{customer.phone}</p>
                  )}
                  {customer.comuna && (
                    <p className="text-slate-400 text-xs">{customer.comuna}</p>
                  )}
                  {customer.address && (
                    <p className="text-slate-400 text-xs truncate">{customer.address}</p>
                  )}
                </div>
                {customer.notes && (
                  <p className="text-slate-400 text-xs mt-0.5 italic truncate">{customer.notes}</p>
                )}
              </div>

              <CustomerActions id={customer.id} name={customer.name} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-12 text-center">
          <p className="text-slate-400 font-medium">
            {q ? `Sin resultados para "${q}"` : 'No hay clientes aún'}
          </p>
          {!q && (
            <Link
              href="/customers/new"
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-500 text-sm font-bold uppercase tracking-widest"
            >
              Crear primer cliente →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
