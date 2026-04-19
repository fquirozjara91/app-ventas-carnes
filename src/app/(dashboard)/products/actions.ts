'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProductFormData = {
  name: string
  description: string
  price: number
  unit: string
  stock: number | null
  active: boolean
}

export type ActionResult = { error?: string }

export async function createProduct(data: ProductFormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('products').insert({
    name: data.name,
    description: data.description || null,
    price: data.price,
    unit: data.unit,
    stock: data.stock,
    active: data.active,
  })
  if (error) return { error: error.message }
  revalidatePath('/products')
  return {}
}

export async function updateProduct(id: string, data: ProductFormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({
      name: data.name,
      description: data.description || null,
      price: data.price,
      unit: data.unit,
      stock: data.stock,
      active: data.active,
    })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/products')
  return {}
}

export async function toggleProductActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('products').update({ active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/products')
  return {}
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/products')
  return {}
}
