import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getCategories = createAsyncThunk("category/get", () => {
  return API.get("category/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const updateCategories = createAsyncThunk<any, CategoryInterface>(
  "category/update",
  (data) => {
    return API.put("category/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const createCategories = createAsyncThunk<any, CategoryInterface>(
  "category/create",
  (data) => {
    return API.post("category/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteCategories = createAsyncThunk<any, string>(
  "category/delete",
  (data) => {
    return API({
      method: "DELETE",
      url: "category/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface CategoryInterface {
  category_id?: string;
  categoryname: string;
  category_slug: string;
  createddate?: Date | null;
  modifieddate?: Date | null;
  product_quantity?: string;
}

interface CategoryState {
  category: CategoryInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  category: [],
  loading: "idle",
} as CategoryState;

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getCategories.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.category;
        if (data && data.length > 0) {
          state.category = data;
          state.loading = "succeeded";
        }
      }
    );

    builder.addCase(createCategories.fulfilled, (state) => {
      state.loading = "idle";
      state.category = [];
    });
    builder.addCase(updateCategories.fulfilled, (state) => {
      state.loading = "idle";
      state.category = [];
    });
    builder.addCase(deleteCategories.fulfilled, (state) => {
      state.loading = "idle";
      state.category = [];
    });

    builder.addCase(getCategories.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch category from backend!!!");
    });
  },
});

export const {} = categorySlice.actions;

export default categorySlice.reducer;
