import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getSizes = createAsyncThunk("size/get", () => {
  return API.get("size/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const updateSizes = createAsyncThunk<any, sizeInterface>(
  "size/update",
  (data) => {
    return API.put("size/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const createSizes = createAsyncThunk<any, sizeInterface>(
  "size/create",
  (data) => {
    return API.post("size/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteSizes = createAsyncThunk<any, string>(
  "size/delete",
  (data) => {
    return API({
      method: "DELETE",
      url: "size/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface sizeInterface {
  size_id?: string;
  sizename: string;
  createddate?: Date | null;
  modifieddate?: Date | null;
  product_quantity?: string;
}

interface SizeState {
  size: sizeInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  size: [],
  loading: "idle",
} as SizeState;

export const SizeSlice = createSlice({
  name: "size",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getSizes.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.size;
        if (data && data.length > 0) {
          state.size = data;
          state.loading = "succeeded";
        }
      }
    );

    builder.addCase(createSizes.fulfilled, (state) => {
      state.loading = "idle";
      state.size = [];
    });
    builder.addCase(updateSizes.fulfilled, (state) => {
      state.loading = "idle";
      state.size = [];
    });
    builder.addCase(deleteSizes.fulfilled, (state) => {
      state.loading = "idle";
      state.size = [];
    });


    builder.addCase(getSizes.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch todos from backend!!!");
    });
  },
});

export const {} = SizeSlice.actions;

export default SizeSlice.reducer;
