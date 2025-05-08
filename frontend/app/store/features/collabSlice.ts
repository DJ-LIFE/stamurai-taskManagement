import { createAsyncThunk } from "@reduxjs/toolkit";

export interface User {
    id: string;
    email: string;
    password: string;
}
interface UserState {
    users: User[] | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    isLoading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async(_,{rejectWithValue}) => {
        try {
            return await 
        }
    }
)