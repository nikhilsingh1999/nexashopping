import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Create a new order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      console.log("Order data:", orderData);
      const response = await axiosInstance.post("/api/v1/user/order", orderData);
      return response.data;
    } catch (error: any) {
      console.error("Error creating order:", error, 'orderData',orderData);
      
      return rejectWithValue(error.response?.data?.message || "Failed to create order");
    }
  }
);

// Fetch all orders for the user
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/user/order");
      console.log("API Response for fetchOrders:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error("Error fetching orders:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);


// Get order by ID
export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      console.log("Fetching order details for ID:", orderId);
      const response = await axiosInstance.get(`/api/v1/user/order/${orderId}`);
      console.log("API Response for getOrderById:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error("Error fetching order details:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
    }
  }
);




// Cancel an order
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/v1/user/order/${orderId}/cancel`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to cancel order");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    pagination: null,
    currentOrder: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrderErrors: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        console.log("fetchOrders.fulfilled payload:", JSON.stringify(action.payload, null, 2));
        
        // Detailed checking and logging
        if (!action.payload) {
          console.error("fetchOrders.fulfilled: payload is null or undefined");
          state.orders = [];
          return;
        }
        
        if (!action.payload.order) {
          console.error("fetchOrders.fulfilled: payload.order is missing", action.payload);
          state.orders = [];
          return;
        }
        
        if (!action.payload.order.orders) {
          console.error("fetchOrders.fulfilled: payload.order.orders is missing", action.payload.order);
          state.orders = [];
          return;
        }
        
        // If we got here, we have the expected structure
        state.orders = action.payload.order.orders;
        console.log("Setting orders state to:", state.orders.length, "items");
        
        if (action.payload.order.pagination) {
          state.pagination = action.payload.order.pagination;
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("fetchOrders.rejected:", action.payload);
      })

       // Get order by ID
       .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        console.log("getOrderById.fulfilled payload:", JSON.stringify(action.payload, null, 2));
        
        if (!action.payload || !action.payload.order) {
          console.error("getOrderById.fulfilled: invalid payload structure", action.payload);
          return;
        }
        
        state.currentOrder = action.payload.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("getOrderById.rejected:", action.payload);
      })

      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
        state.success = true;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderErrors, resetOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;