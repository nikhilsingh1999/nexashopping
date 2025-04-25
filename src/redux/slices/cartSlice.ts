import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await axiosInstance.get('/api/v1/base/cart');
  return res.data;
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data: { productId: string; quantity: number }) => {
    const res = await axiosInstance.post("/api/v1/base/cart", {
      items: [
        {
          productId: data.productId,
          quantity: data.quantity,
        },
      ],
    });
    console.log("Add to cart response:", res.data);
    return res.data;
  }
);

export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async (data: { id: string; quantity: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/api/v1/base/cart/${data.id}`, { quantity: data.quantity });
      console.log('Update cart response:', res.data);
      return {
        updatedCart: res.data.cart,
        productId: data.id,
        newQuantity: data.quantity
      };
    } catch (error: any) {
      console.error('Error updating cart:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId: string) => {
  await axiosInstance.delete(`/api/v1/base/cart/${itemId}`);
  return itemId;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {
      _id: '',
      userId: '',
      items: [],
      isActive: true,
      createdAt: '',
      updatedAt: '',
      __v: 0
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      
      // Add to cart
      .addCase(addToCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.items) {
          // Full cart received
          state.items = action.payload;
        } else {
          // Single item received
          state.items.items.push(action.payload);
        }
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to cart';
      })
      
      // Update cart - KEY CHANGES HERE FOR INSTANT UPDATES
      .addCase(updateCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // First, update UI immediately with the new quantity
        const { productId, newQuantity } = action.payload;
        
        // Find the item in the state and update its quantity
        const itemIndex = state.items.items.findIndex(
          item => item.productId._id === productId
        );
        
        if (itemIndex !== -1) {
          // Update quantity immediately for instant feedback
          state.items.items[itemIndex].quantity = newQuantity;
        }
        
        // // If the server returns the full updated cart, use that too
        // if (action.payload.updatedCart) {
        //   state.items = action.payload.updatedCart;
        // }
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update cart';
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.payload;
        
        // Remove the item immediately for instant UI feedback
        state.items.items = state.items.items.filter(
          item => item.productId._id !== removedId
        );
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove item';
      });
  },
});

export default cartSlice.reducer;