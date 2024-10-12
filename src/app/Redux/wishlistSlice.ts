import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { act } from 'react';

interface WishlistState {
  wishlist: string[];
}

const initialState: WishlistState = {
  wishlist: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {

    toggleWishlist:(state, action: PayloadAction<string>) =>{
      const index=state.wishlist.indexOf(action.payload);
      if(index !==-1){
        state.wishlist.splice(index, 1);
      }
      else{
        state.wishlist.push(action.payload);
      }
    },
    clearWishlist: (state) =>{
      state.wishlist = [];
    },
  },
});

// Export actions
export const { toggleWishlist,clearWishlist } = wishlistSlice.actions;

// Export reducer
export default wishlistSlice.reducer;
