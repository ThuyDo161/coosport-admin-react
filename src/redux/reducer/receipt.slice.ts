import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getReceipts = createAsyncThunk("receipts/get", () => {
  return API.get("receipt/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const createReceipt = createAsyncThunk<any, receiptInterface>(
  "admin/create-receipt",
  (data) => {
    return API.post("receipt/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const updateReceipt = createAsyncThunk<any, receiptInterface>(
  "admin/update-receipt",
  (data) => {
    return API.put("receipt/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteReceipt = createAsyncThunk<any, any>(
  "admin/delete-receipt",
  (data) => {
    return API({
      method: "DELETE",
      url: "receipt/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export const getSpending = createAsyncThunk<any, number | undefined>(
  "receipt/getSpending",
  (year) => {
    return API.get("receipt/spending.php" + (year ? `?year=${year}` : ""))
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface receiptInterface {
  receipt_id?: string;
  receipt_date?: string;
  user_id?: string;
  totalprice?: string;
  supplier_id?: string;
  items?:
    | {
        id: string;
        item_name: string;
        item_price: string;
        quantity: string;
      }[]
    | null;
}

export interface receiptSpending {
  Jan: number;
  Feb: number;
  Mar: number;
  Apr: number;
  May: number;
  Jun: number;
  Jul: number;
  Aug: number;
  Sep: number;
  Oct: number;
  Nov: number;
  Dec: number;
  year: number;
}

interface receiptState {
  allReceipt: receiptInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  valeModal: any;
  spending: receiptSpending | null;
}

const initialState = {
  allReceipt: [],
  loading: "idle",
  valeModal: "",
  spending: null,
} as receiptState;

export const receiptsSlice = createSlice({
  name: "receiptModal",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<"idle" | "pending" | "succeeded" | "failed">
    ) => {
      state.loading = action.payload;
    },
    set: (state, action: PayloadAction<any>) => {
      state.valeModal = action.payload;
    },
    remove: (state) => {
      state.valeModal = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getReceipts.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.receipt;
        if (data && data.length > 0) {
          state.allReceipt = data;
        } else {
          state.allReceipt = [];
        }
        state.loading = "succeeded";
      }
    );

    builder.addCase(
      getSpending.fulfilled,
      (state, action: PayloadAction<receiptSpending>) => {
        const data = action.payload;
        if (data) {
          state.spending = data;
          state.loading = "succeeded";
        }
      }
    );

    builder.addCase(createReceipt.fulfilled, (state) => {
      state.loading = "idle";
      state.allReceipt = [];
    });
    builder.addCase(updateReceipt.fulfilled, (state) => {
      state.loading = "idle";
      state.allReceipt = [];
    });
    builder.addCase(deleteReceipt.fulfilled, (state) => {
      state.loading = "idle";
      state.allReceipt = [];
    });

    builder.addCase(getReceipts.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch receipt from backend!!!");
    });
  },
});

// Action creators are generated for each case reducer function
export const { set, remove, setLoading } = receiptsSlice.actions;

export default receiptsSlice.reducer;
