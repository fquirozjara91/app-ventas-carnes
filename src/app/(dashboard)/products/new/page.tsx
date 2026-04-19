import Link from 'next/link'
import ProductForm from '@/components/products/product-form'

export default function NewProductPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <Link
          href="/products"
          className="text-zinc-400 hover:text-zinc-700 text-sm font-medium uppercase tracking-widest transition-colors"
        >
          ← Volver
        </Link>
        <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight mt-3">
          Nuevo producto
        </h1>
      </div>

      <ProductForm />
    </div>
  )
}
