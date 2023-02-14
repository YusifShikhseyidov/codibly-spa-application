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
