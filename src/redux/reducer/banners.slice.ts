import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getBanners = createAsyncThunk("Banner/get", () => {
  return API.get("banner/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const createBanner = createAsyncThunk<any, BannerPayloadInterface>(
  "Banner/create",
  (data) => {
    return API.post("banner/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const updateBanner = createAsyncThunk<any, BannerPayloadInterface>(
  "Banner/update",
  (data) => {
    return API.put("banner/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteBanner = createAsyncThunk<any, BannerPayloadInterface>(
  "Banner/delete",
  (data) => {
    return API({
      method: "DELETE",
      url: "banner/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface BannerInterface {
  id: string;
  title: string;
  img: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BannerPayloadInterface {
  id?: string;
  title: string;
  img: string;
  is_active: boolean;
  fileUpload?: any;
}

interface BannerState {
  banner: BannerInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  banner: [],
  loading: "idle",
} as BannerState;

export const bannerSlice = createSlice({
  name: "Banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getBanners.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.banners;
        if (data && data.length > 0) {
          state.banner = data;
        } else {
          state.banner = [];
        }
        state.loading = "succeeded";
      }
    );

    builder.addCase(getBanners.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch todos from backend!!!");
    });
    builder.addCase(createBanner.fulfilled, (state) => {
      state.loading = "idle";
      state.banner = [];
    });
    builder.addCase(updateBanner.fulfilled, (state) => {
      state.loading = "idle";
      state.banner = [];
    });
    builder.addCase(deleteBanner.fulfilled, (state) => {
      state.loading = "idle";
      state.banner = [];
    });
  },
});

export const {} = bannerSlice.actions;

export default bannerSlice.reducer;
