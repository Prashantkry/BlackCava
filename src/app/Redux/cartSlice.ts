import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  userId: string;
  productId: string;
  size: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const index = state.cart.findIndex(item => item.productId === action.payload.productId && item.size === action.payload.size);
      if (index != -1) {
        state.cart[index].quantity = action.payload.quantity;
      }
      else {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload.productId && item.size !== action.payload.size);
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
