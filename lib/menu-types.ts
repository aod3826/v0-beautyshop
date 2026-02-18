export type MenuCategory = "noodles" | "rice" | "sides"

export interface MenuItem {
  id: string
  name: string
  nameTh: string
  description: string
  price: number
  image: string
  category: MenuCategory
  isCustomizable?: boolean
  isAvailable?: boolean
}
