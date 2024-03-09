import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getBills = createAsyncThunk("bills/get", () => {
  return API.get("bill/readAll.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const getTurnover = createAsyncThunk<any, number | undefined>(
  "bills/getTurnover",
  (year) => {
    return API.get("bill/turnover.php" + (year ? `?year=${year}` : ""))
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const getbillsDetail = createAsyncThunk<any, any>(
  "bills/getDetail",
  (id) => {
    return API.get("bill/detail.php?id=" + id)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export const confirm = createAsyncThunk<any, billInterface>(
  "admin/confirm-bill",
  (data) => {
    return API.put("bill/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const updateBill = createAsyncThunk<any, billInterface>(
  "admin/update-bill",
  (data) => {
    return API.put("bill/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteBill = createAsyncThunk<any, any>(
  "admin/delete-bill",
  (data) => {
    return API({
      method: "DELETE",
      url: "bill/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface billInterface {
  bill_id: string;
  bill_date: string;
  user_id: string;
  status: any;
  totalprice?: string;
  note?: string;
  deliverytime?: string;
  modifieddate?: string;
  items: {
    id: string;
    item_name: string;
    item_price: string;
    quantity: string;
  }[];
}
export interface billTurnover {
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

interface billState {
  allBill: billInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  valeModal: any;
  turnover: billTurnover | null;
}

const initialState: billState = {
  allBill: [],
  loading: "idle",
  valeModal: "",
  turnover: null,
};

export const billsSlice = createSlice({
  name: "billModal",
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
    builder.addCase(getBills.fulfilled, (state, action: PayloadAction<any>) => {
      const data = action.payload.bill;
      if (data && data.length > 0) {
        state.allBill = data;
      } else {
        state.allBill = [];
      }
      state.loading = "succeeded";
    });

    builder.addCase(
      getTurnover.fulfilled,
      (state, action: PayloadAction<billTurnover>) => {
        const data = action.payload;
        if (data) {
          state.turnover = data;
          state.loading = "succeeded";
        }
      }
    );

    builder.addCase(getbillsDetail.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getbillsDetail.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.bill;
        if (data && data.length > 0) {
          state.allBill = data;
        } else {
          state.allBill = [];
        }
        state.loading = "succeeded";
      }
    );

    builder.addCase(confirm.fulfilled, (state) => {
      state.loading = "idle";
      state.allBill = [];
    });
    builder.addCase(updateBill.fulfilled, (state) => {
      state.loading = "idle";
      state.allBill = [];
    });
    builder.addCase(deleteBill.fulfilled, (state) => {
      state.loading = "idle";
      state.allBill = [];
    });

    builder.addCase(getBills.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch bill from backend!!!");
    });
  },
});

// Action creators are generated for each case reducer function
export const { set, remove, setLoading } = billsSlice.actions;

export default billsSlice.reducer;
