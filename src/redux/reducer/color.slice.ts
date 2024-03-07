import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getColors = createAsyncThunk("color/get", () => {
  return API.get("color/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const updateColors = createAsyncThunk<any, colorInterface>(
  "color/update",
  (data) => {
    return API.put("color/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const createColors = createAsyncThunk<any, colorInterface>(
  "color/create",
  (data) => {
    return API.post("color/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteColors = createAsyncThunk<any, string>(
  "color/delete",
  (data) => {
    return API({
      method: "DELETE",
      url: "color/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface colorInterface {
  color_id?: string;
  colorname: string;
  color_code: string;
  createddate?: Date | null;
  modifieddate?: Date | null;
  product_quantity?: string;
}

interface colorState {
  color: colorInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  color: [],
  loading: "idle",
} as colorState;

export const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getColors.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.color;
        if (data && data.length > 0) {
          state.color = data;
          state.loading = "succeeded";
        }
      }
    );

    builder.addCase(createColors.fulfilled, (state) => {
      state.loading = "idle";
      state.color = [];
    });
    builder.addCase(updateColors.fulfilled, (state) => {
      state.loading = "idle";
      state.color = [];
    });
    builder.addCase(deleteColors.fulfilled, (state) => {
      state.loading = "idle";
      state.color = [];
    });

    builder.addCase(getColors.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch color from backend!!!");
    });
  },
});

export const {} = colorSlice.actions;

export default colorSlice.reducer;
