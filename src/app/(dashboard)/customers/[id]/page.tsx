import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CustomerForm from '@/components/customers/customer-form'

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (!customer) notFound()

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <Link
          href="/customers"
          className="text-slate-400 hover:text-slate-700 text-sm font-medium uppercase tracking-widest transition-colors"
        >
          ← Volver
        </Link>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mt-3">
          Editar cliente
        </h1>
        <p className="text-slate-500 text-sm mt-1">{customer.name}</p>
      </div>

      <CustomerForm customer={customer} />
    </div>
  )
}
