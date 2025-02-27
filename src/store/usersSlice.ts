import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName:string;
  age:string;
  gender:string;
  email: string;
  phone: string;
  username: string;
  birthDate:string;
  bloodGroup:string;
  eyeColor:string;
}

interface UsersState {
  items: User[];
  total: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  pageSize: number;
  currentPage: number;
}

const initialState: UsersState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  searchTerm: '',
  pageSize: 5,
  currentPage: 1,
};

interface FetchUsersArgs {
  limit: number;
  skip: number;
}


export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ limit, skip }: FetchUsersArgs) => {
    const response = await axios.get(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { setSearchTerm, setPageSize, setCurrentPage } = usersSlice.actions;
export default usersSlice.reducer;