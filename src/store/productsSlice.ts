import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  discountPercentage: number;
}

interface ProductsState {
  items: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  pageSize: number;
  currentPage: number;
  activeTab: 'ALL' | 'LAPTOPS';
}

const initialState: ProductsState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  searchTerm: '',
  pageSize: 5,
  currentPage: 1,
  activeTab: 'ALL',
};

interface FetchProductsArgs {
  limit: number;
  skip: number;
  category: string;
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ limit, skip, category }: FetchProductsArgs) => {
    const url = category 
      ? `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`
      : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    const response = await axios.get(url);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'ALL' | 'LAPTOPS'>) => {
      state.activeTab = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { setSearchTerm, setPageSize, setCurrentPage, setActiveTab } = productsSlice.actions;
export default productsSlice.reducer;