import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CustomerActions from './_components/customer-actions'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('customers').select('*').order('name')
  if (q) {
    query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
  }

  const { data: customers } = await query

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

      {/* Búsqueda */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o teléfono..."
          className="w-full max-w-sm bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
        />
      </form>

      {/* Lista */}
      {customers && customers.length > 0 ? (
        <div className="flex flex-col gap-2">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white border border-zinc-200 px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 text-sm">{customer.name}</p>
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
