import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getSlides = createAsyncThunk("slide/get", () => {
  return API.get("slide/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const createSlide = createAsyncThunk<any, slidePayloadInterface>(
  "slide/create",
  (data) => {
    return API.post("slide/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const updateSlide = createAsyncThunk<any, slidePayloadInterface>(
  "slide/update",
  (data) => {
    return API.put("slide/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteSlide = createAsyncThunk<any, slidePayloadInterface>(
  "slide/delete",
  (data) => {
    return API({
      method: "DELETE",
      url: "slide/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface slideInterface {
  slide_id: string;
  title: string;
  description: string;
  img: string;
  color: string;
  path: string;
}
export interface slidePayloadInterface {
  slide_id?: string;
  title: string;
  description: string;
  img: string;
  color: string;
  path: string;
  fileUpload?: any;
}

interface slideState {
  slide: slideInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  slide: [],
  loading: "idle",
} as slideState;

export const slideSlice = createSlice({
  name: "slide",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getSlides.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.slide;
        if (data && data.length > 0) {
          state.slide = data;
        } else {
          state.slide = [];
        }
        state.loading = "succeeded";
      }
    );

    builder.addCase(getSlides.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch todos from backend!!!");
    });
    builder.addCase(createSlide.fulfilled, (state) => {
      state.loading = "idle";
      state.slide = [];
    });
    builder.addCase(updateSlide.fulfilled, (state) => {
      state.loading = "idle";
      state.slide = [];
    });
    builder.addCase(deleteSlide.fulfilled, (state) => {
      state.loading = "idle";
      state.slide = [];
    });
  },
});

export const {} = slideSlice.actions;

export default slideSlice.reducer;
