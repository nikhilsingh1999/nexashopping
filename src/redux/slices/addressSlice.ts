
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchAddresses = createAsyncThunk('address/fetchAddresses', async () => {
    const response = await axiosInstance.get('/api/v1/base/addresses');
    return response.data.data;
});

export const addAddress = createAsyncThunk('address/add', async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/api/v1/base/address', payload);
      return res.data.data;
    } catch (err: any) {
      console.error('Add Address Error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  });

export const deleteAddress = createAsyncThunk('address/delete', async (id: string) => {
    try{
        const res = await axiosInstance.delete(`/api/v1/base/delete/${id}`);
        return id;
    }
    catch (err: any) {
        console.error('Delete Address Error:', err.response?.data || err.message);
    }
   
});

export const updateAddress = createAsyncThunk('address/update', async ({ id, data }) => {
    const res = await axiosInstance.put(`/api/v1/base/update/${id}`, data);
    return res.data.data;
});

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchAddresses.pending, state => {
                state.loading = true;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.addresses.push(action.payload);
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
                if (index !== -1) state.addresses[index] = action.payload;
            });
    },
});

export default addressSlice.reducer;
