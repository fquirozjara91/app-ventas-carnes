import Link from 'next/link'
import CustomerForm from '@/components/customers/customer-form'

export default function NewCustomerPage() {
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
          Nuevo cliente
        </h1>
      </div>

      <CustomerForm />
    </div>
  )
}
