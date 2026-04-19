// Tipos principales de la aplicacion

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  unit: string
  stock: number | null
  image_url: string | null
  active: boolean
  created_at: string
}

export type Customer = {
  id: string
  name: string
  phone: string | null
  address: string | null
  notes: string | null
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'delivered'

export type Order = {
  id: string
  customer_id: string
  date: string
  status: OrderStatus
  notes: string | null
  total: number | null
  created_at: string
  customer?: Customer
  order_items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
  product?: Product
}
