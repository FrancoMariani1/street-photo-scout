import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Ejemplo de un thunk asíncrono
export const fetchCount = createAsyncThunk('counter/fetchCount', async (amount: number) => {
  const response = await fetch(`https://api.example.com/count?amount=${amount}`);
  return (await response.json()).data;
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    status: 'idle',
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value += action.payload;
      })
      .addCase(fetchCount.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer;