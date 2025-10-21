export type Food = {
  img: string
  price: number
  category?: string
  name: string
  id?: number
  des?: string
  quantity: number
}

 export type Pack = {
  id: number
  packNo: number
  items: Food[]
}