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
    description: "น้ำซุปต้มยำรสจัดจ้าน หอมสมุนไพร เสิร์ฟพร้อมหมูและถั่วงอก",
    price: 50,
    image: "/images/tom-yum-noodle.jpg",
    category: "noodles",
    isCustomizable: true,
  },
  {
    id: "boat-noodle",
    name: "Boat Noodle",
    nameTh: "ก๋วยเตี๋ยวเรือ",
    description: "น้ำซุปเข้มข้นสไตล์ก๋วยเตี๋ยวเรือ พร้อมหมู ลูกชิ้น และผักบุ้ง",
    price: 50,
    image: "/images/boat-noodle.jpg",
    category: "noodles",
    isCustomizable: true,
  },
  {
    id: "clear-soup-noodle",
    name: "Clear Soup Noodle",
    nameTh: "ก๋วยเตี๋ยวน้ำใส",
    description: "น้ำซุปใสรสกลมกล่อม เสิร์ฟพร้อมลูกชิ้นหมู ถั่วงอก และกระเทียมเจียว",
    price: 45,
    image: "/images/clear-soup-noodle.jpg",
    category: "noodles",
    isCustomizable: true,
  },
  {
    id: "pad-see-ew",
    name: "Pad See Ew",
    nameTh: "ผัดซีอิ๊ว",
    description: "เส้นใหญ่ผัดซีอิ๊วหอมกระทะ ใส่คะน้าและไข่",
    price: 55,
    image: "/images/pad-see-ew.jpg",
    category: "noodles",
  },

  // Rice dishes
  {
    id: "pad-kra-pao",
    name: "Pad Kra Pao + Rice",
    nameTh: "ผัดกะเพราข้าว",
    description: "ผัดกะเพราหมูสับหอมใบกะเพรา เสิร์ฟพร้อมข้าวสวยและไข่ดาว",
    price: 55,
    image: "/images/pad-kra-pao.jpg",
    category: "rice",
  },
  {
    id: "khao-pad",
    name: "Fried Rice",
    nameTh: "ข้าวผัด",
    description: "ข้าวผัดรสกลมกล่อม ใส่ไข่ ต้นหอม และมะนาว",
    price: 50,
    image: "/images/khao-pad.jpg",
    category: "rice",
  },
  {
    id: "omelette-rice",
    name: "Omelette + Rice",
    nameTh: "ข้าวไข่เจียว",
    description: "ไข่เจียวสไตล์ไทยทอดฟูกรอบ เสิร์ฟพร้อมข้าวหอมมะลิ",
    price: 40,
    image: "/images/omelette-rice.jpg",
    category: "rice",
  },

  // Sides & Drinks
  {
    id: "spring-rolls",
    name: "Spring Rolls",
    nameTh: "ปอเปี๊ยะทอด",
    description: "ปอเปี๊ยะทอดกรอบสีทอง ไส้วุ้นเส้นและผัก",
    price: 35,
    image: "/images/spring-rolls.jpg",
    category: "sides",
  },
  {
    id: "pork-satay",
    name: "Pork Satay",
    nameTh: "หมูสะเต๊ะ",
    description: "หมูสะเต๊ะย่างหอม เสิร์ฟพร้อมน้ำจิ้มถั่วและอาจาด",
    price: 40,
    image: "/images/pork-satay.jpg",
    category: "sides",
  },
  {
    id: "thai-tea",
    name: "Thai Iced Tea",
    nameTh: "ชาเย็น",
    description: "ชาไทยรสหวานมัน หอมชา เสิร์ฟเย็น",
    price: 30,
    image: "/images/thai-tea.jpg",
    category: "sides",
  },
  {
    id: "water",
    name: "Water",
    nameTh: "น้ำเปล่า",
    description: "น้ำดื่มบรรจุขวด แช่เย็น",
    price: 10,
    image: "/images/water.jpg",
    category: "sides",
  },
]

export const noodleTypes = [
  { id: "small", name: "เส้นเล็ก", nameTh: "เส้นเล็ก", image: "/images/noodle-small.jpg" },
  { id: "large", name: "เส้นใหญ่", nameTh: "เส้นใหญ่", image: "/images/noodle-large.jpg" },
  { id: "vermicelli", name: "เส้นหมี่", nameTh: "เส้นหมี่", image: "/images/noodle-vermicelli.jpg" },
  { id: "egg", name: "บะหมี่", nameTh: "บะหมี่", image: "/images/noodle-egg.jpg" },
  { id: "instant", name: "มาม่า", nameTh: "มาม่า", image: "/images/noodle-instant.jpg" },
]

export const soupStyles = [
  { id: "soup", name: "น้ำ", nameTh: "น้ำ" },
  { id: "dry", name: "แห้ง", nameTh: "แห้ง" },
  { id: "tom-yum-soup", name: "ต้มยำน้ำ", nameTh: "ต้มยำน้ำ" },
  { id: "tom-yum-dry", name: "ต้มยำแห้ง", nameTh: "ต้มยำแห้ง" },
]

export const sizeOptions = [
  { id: "regular", name: "ธรรมดา", nameTh: "ธรรมดา", extra: 0 },
  { id: "special", name: "พิเศษ", nameTh: "พิเศษ", extra: 10 },
]

export const extraOptions = [
  { id: "no-spicy", name: "ไม่เผ็ด", nameTh: "ไม่เผ็ด", extra: 0 },
  { id: "no-veggies", name: "ไม่ใส่ผัก", nameTh: "ไม่ใส่ผัก", extra: 0 },
  { id: "no-garlic", name: "ไม่ใส่กระเทียมเจียว", nameTh: "ไม่ใส่กระเทียมเจียว", extra: 0 },
  { id: "extra-crackling", name: "เพิ่มกากหมู", nameTh: "เพิ่มกากหมู", extra: 10 },
]
