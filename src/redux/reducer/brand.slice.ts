import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getBrands = createAsyncThunk("brand/get", () => {
  return API.get("brand/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const updateBrands = createAsyncThunk<any, BrandInterface>(
  "brand/update",
  (data) => {
    return API.put("brand/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const createBrands = createAsyncThunk<any, BrandInterface>(
  "brand/create",
  (data) => {
    return API.post("brand/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteBrands = createAsyncThunk<any, string>(
  "brand/delete",
  (data) => {
    return API({
      method: "DELETE",
      url: "brand/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface BrandInterface {
  brand_id: string;
  brandname: string;
  brand_slug: string;
  createddate?: Date | null;
  modifieddate?: Date | null;
  product_quantity?: string;
}

interface brandState {
  brand: BrandInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  brand: [],
  loading: "idle",
} as brandState;

export const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getBrands.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.brand;
        if (data && data.length > 0) {
          state.brand = data;
          state.loading = "succeeded";
        }
      }
    );

    builder.addCase(createBrands.fulfilled, (state) => {
      state.loading = "idle";
      state.brand = [];
    });
    builder.addCase(updateBrands.fulfilled, (state) => {
      state.loading = "idle";
      state.brand = [];
    });
    builder.addCase(deleteBrands.fulfilled, (state) => {
      state.loading = "idle";
      state.brand = [];
    });

    builder.addCase(getBrands.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch brands from backend!!!");
    });
  },
});

export const {} = brandSlice.actions;

export default brandSlice.reducer;
