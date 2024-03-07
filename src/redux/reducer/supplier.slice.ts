import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getSuppliers = createAsyncThunk("supplier/get", () => {
  return API.get("supplier/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const updateSuppliers = createAsyncThunk<any, supplierInterface>(
  "supplier/update",
  (data) => {
    return API.put("supplier/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const createSuppliers = createAsyncThunk<any, supplierInterface>(
  "supplier/create",
  (data) => {
    return API.post("supplier/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteSuppliers = createAsyncThunk<any, string>(
  "supplier/delete",
  (data) => {
    return API({
      method: "DELETE",
      url: "supplier/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface supplierInterface {
  supplier_id?: string;
  supplier_name: string;
  supplier_address: string;
  supplier_tel: string;
}

interface supplierState {
  supplier: supplierInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  supplier: [],
  loading: "idle",
} as supplierState;

export const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getSuppliers.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.supplier;
        if (data && data.length > 0) {
          state.supplier = data;
          state.loading = "succeeded";
        }
      }
    );

    builder.addCase(createSuppliers.fulfilled, (state) => {
      state.loading = "idle";
      state.supplier = [];
    });
    builder.addCase(updateSuppliers.fulfilled, (state) => {
      state.loading = "idle";
      state.supplier = [];
    });
    builder.addCase(deleteSuppliers.fulfilled, (state) => {
      state.loading = "idle";
      state.supplier = [];
    });

    builder.addCase(getSuppliers.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch supplier from backend!!!");
    });
  },
});

export const {} = supplierSlice.actions;

export default supplierSlice.reducer;
