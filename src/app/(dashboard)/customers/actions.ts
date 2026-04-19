'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CustomerFormData = {
  name: string
  rut: number | null
  dv: string | null
  phone: string
  address: string
  notes: string
}

export type ActionResult = { error?: string }

export async function createCustomer(data: CustomerFormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('customers').insert({
    name: data.name,
    rut: data.rut,
    dv: data.dv,
    phone: data.phone || null,
    address: data.address || null,
    notes: data.notes || null,
  })
  if (error) return { error: error.message }
  revalidatePath('/customers')
  return {}
}

export async function updateCustomer(id: string, data: CustomerFormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('customers')
    .update({
      name: data.name,
      rut: data.rut,
      dv: data.dv,
      phone: data.phone || null,
      address: data.address || null,
      notes: data.notes || null,
    })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/customers')
  return {}
}

export async function deleteCustomer(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) {
    if (error.code === '23503') {
      return { error: 'No se puede eliminar: el cliente tiene pedidos asociados.' }
    }
    return { error: error.message }
  }
  revalidatePath('/customers')
  return {}
}
