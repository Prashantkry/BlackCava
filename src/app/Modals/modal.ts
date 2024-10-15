export interface Coffee {
  productId: string;
  name: string;
  image:string;
  description: string;
  category: string;
  flavour: string;
  small: number;
  medium: number;
  large: number;
}

export interface cartCoffeeItem{
  productId: string;
  name:string;
  size:string;
  quantity:number;
  pricePerQuantity:number;
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
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  pinCode: string;
  profile: string; 
}