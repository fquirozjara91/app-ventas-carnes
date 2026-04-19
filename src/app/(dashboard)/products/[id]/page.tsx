import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/products/product-form'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

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
          Editar producto
        </h1>
        <p className="text-zinc-500 text-sm mt-1">{product.name}</p>
      </div>

      <ProductForm product={product} />
    </div>
  )
}
