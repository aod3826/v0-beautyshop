export interface MenuItem {
  id: string
  name: string
  nameTh: string
  description: string
  price: number
  image: string
  category: "noodles" | "rice" | "sides"
  isCustomizable?: boolean
}

export const menuItems: MenuItem[] = [
  // Noodles
  {
    id: "tom-yum-noodle",
    name: "Tom Yum Noodle",
    nameTh: "ก๋วยเตี๋ยวต้มยำ",
    description: "Spicy & sour noodle soup with aromatic herbs, pork, and bean sprouts",
    price: 50,
    image: "/images/tom-yum-noodle.jpg",
    category: "noodles",
    isCustomizable: true,
  },
  {
    id: "boat-noodle",
    name: "Boat Noodle",
    nameTh: "ก๋วยเตี๋ยวเรือ",
    description: "Rich dark broth with pork, meatballs, and morning glory",
    price: 50,
    image: "/images/boat-noodle.jpg",
    category: "noodles",
    isCustomizable: true,
  },
  {
    id: "clear-soup-noodle",
    name: "Clear Soup Noodle",
    nameTh: "ก๋วยเตี๋ยวน้ำใส",
    description: "Light clear broth with pork balls, bean sprouts, and crispy garlic",
    price: 45,
    image: "/images/clear-soup-noodle.jpg",
    category: "noodles",
    isCustomizable: true,
  },
  {
    id: "pad-see-ew",
    name: "Pad See Ew",
    nameTh: "ผัดซีอิ๊ว",
    description: "Stir-fried wide noodles with dark soy, Chinese broccoli, and egg",
    price: 55,
    image: "/images/pad-see-ew.jpg",
    category: "noodles",
  },

  // Rice dishes
  {
    id: "pad-kra-pao",
    name: "Pad Kra Pao + Rice",
    nameTh: "ผัดกะเพราข้าว",
    description: "Holy basil stir-fry with minced pork, fried egg on steamed rice",
    price: 55,
    image: "/images/pad-kra-pao.jpg",
    category: "rice",
  },
  {
    id: "khao-pad",
    name: "Fried Rice",
    nameTh: "ข้าวผัด",
    description: "Classic Thai fried rice with egg, spring onion, and lime",
    price: 50,
    image: "/images/khao-pad.jpg",
    category: "rice",
  },
  {
    id: "omelette-rice",
    name: "Omelette + Rice",
    nameTh: "ข้าวไข่เจียว",
    description: "Crispy Thai-style omelette served over steamed jasmine rice",
    price: 40,
    image: "/images/omelette-rice.jpg",
    category: "rice",
  },

  // Sides & Drinks
  {
    id: "spring-rolls",
    name: "Spring Rolls",
    nameTh: "ปอเปี๊ยะทอด",
    description: "Golden crispy rolls with glass noodle & veggie filling",
    price: 35,
    image: "/images/spring-rolls.jpg",
    category: "sides",
  },
  {
    id: "pork-satay",
    name: "Pork Satay",
    nameTh: "หมูสะเต๊ะ",
    description: "Grilled skewers with peanut sauce and cucumber relish",
    price: 40,
    image: "/images/pork-satay.jpg",
    category: "sides",
  },
  {
    id: "thai-tea",
    name: "Thai Iced Tea",
    nameTh: "ชาเย็น",
    description: "Sweet creamy orange Thai tea over ice",
    price: 30,
    image: "/images/thai-tea.jpg",
    category: "sides",
  },
  {
    id: "water",
    name: "Water",
    nameTh: "น้ำเปล่า",
    description: "Cold bottled water",
    price: 10,
    image: "/images/water.jpg",
    category: "sides",
  },
]

export const noodleTypes = [
  { id: "small", name: "Small", nameTh: "เส้นเล็ก", image: "/images/noodle-small.jpg" },
  { id: "large", name: "Large", nameTh: "เส้นใหญ่", image: "/images/noodle-large.jpg" },
  { id: "vermicelli", name: "Vermicelli", nameTh: "เส้นหมี่", image: "/images/noodle-vermicelli.jpg" },
  { id: "egg", name: "Egg Noodle", nameTh: "บะหมี่", image: "/images/noodle-egg.jpg" },
  { id: "instant", name: "Instant", nameTh: "มาม่า", image: "/images/noodle-instant.jpg" },
]

export const soupStyles = [
  { id: "soup", name: "Soup", nameTh: "น้ำ" },
  { id: "dry", name: "Dry", nameTh: "แห้ง" },
  { id: "tom-yum-soup", name: "Tom Yum Soup", nameTh: "ต้มยำน้ำ" },
  { id: "tom-yum-dry", name: "Tom Yum Dry", nameTh: "ต้มยำแห้ง" },
]

export const sizeOptions = [
  { id: "regular", name: "Regular", nameTh: "ธรรมดา", extra: 0 },
  { id: "special", name: "Special", nameTh: "พิเศษ", extra: 10 },
]

export const extraOptions = [
  { id: "no-spicy", name: "No Spicy", nameTh: "ไม่เผ็ด", extra: 0 },
  { id: "no-veggies", name: "No Veggies", nameTh: "ไม่ผัก", extra: 0 },
  { id: "no-garlic", name: "No Garlic", nameTh: "ไม่กระเทียมเจียว", extra: 0 },
  { id: "extra-crackling", name: "Extra Pork Crackling", nameTh: "เพิ่มกากหมู", extra: 10 },
]
