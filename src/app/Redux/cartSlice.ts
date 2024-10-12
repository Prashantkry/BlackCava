import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoffeeSize } from '../Modals/modal';

interface CartItem {
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
      if(index !=-1){
        state.cart[index].quantity = action.payload.quantity;
      }
      else{
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload.productId && item.size !== action.payload.size);
    },
    clearCart: (state) =>{
      state.cart = [];
    },
  },
});

// Export actions
export const { addToCart, removeFromCart,clearCart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
