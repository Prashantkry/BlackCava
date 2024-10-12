export interface Coffee {
  productId: string;
  name: string;
  image:string;
  description: string;
  category: string;
  flavour: string;
  small: string;
  medium: string;
  large: string;
}

export interface cartCoffeeItem{
  productId: string;
  name:string;
  size:string;
  quantity:number;
  pricePerQuantity:string;
}

export interface Transaction {
  transactionId: string;
  orderId: number;
  userId:string;
  username: string;
  items: cartCoffeeItem[];
  totalAmount: number;
  date: string;
  orderDelivered:boolean;
  isFavorite:boolean;
}

export interface Testimonial {
  testimonialId: string;
  username: string;
  userId:string;
  review: string;
  coffeeName:string;
  rating:number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  coffeeName:string;
}

export interface user{
  id: string;
  firstName: string;
  middleName: string|null;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  addressLine1: string;
  addressLine2: string|null;
  city: string;
  state: string;
  pinCode: string;
  profile: string; 
}