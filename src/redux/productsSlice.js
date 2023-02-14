import { createSlice } from "@reduxjs/toolkit";


const productsSlice = createSlice({
  name: 'products',
  initialState: [],
  reducers: {
    handleDataFetch: (state, action) =>{
      return [...action.payload];
    }
  }
});

export const {handleDataFetch} = productsSlice.actions;
export default productsSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchProducts = createAsyncThunk(
//   'products/fetchProducts',
//   async (params, thunkAPI) => {
//     const response = await axios.get(
//       `https://reqres.in/api/products?page=${params.page}&per_page=${params.per_page}&sort=${params.sort}`
//     );
//     return response.data;
//   }
// );

// const productsSlice = createSlice({
//   name: 'products',
//   initialState: {
//     data: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: {
//     [fetchProducts.pending]: (state) => {
//       state.loading = true;
//     },
//     [fetchProducts.fulfilled]: (state, action) => {
//       state.data = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     [fetchProducts.rejected]: (state, action) => {
//       state.loading = false;
//       state.error = action.error;
//     },
//   },
// });

// export default productsSlice.reducer;


