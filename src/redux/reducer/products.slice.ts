import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getProducts = createAsyncThunk("products/get", () => {
  return API.get("product/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});
export const getAllProducts = createAsyncThunk("products/getAll", () => {
  return API.get("product/readAll.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});
export const getProductsDetail = createAsyncThunk<any, any>(
  "products/getDetail",
  (id) => {
    return API.get("product/detail.php?id=" + id)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export const productsBySlug = createAsyncThunk<any, any>(
  "products/getBySlug",
  (data) => {
    if (data.from) {
      return API.get(
        `product/readbyslug.php?slug=${data.slug}&_from=${data.from}&_to=${data.to}`
      )
        .then((response) => response.data)
        .catch((err) => err.message);
    }
    return API.get(`product/readbyslug.php?slug=${data}`)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export const createProduct = createAsyncThunk<any, productInterface>(
  "admin/createSan_pham",
  (data) => {
    return API.post("product/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const updateProduct = createAsyncThunk<any, productInterface>(
  "admin/updateSan_pham",
  (data) => {
    return API.put("product/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteProduct = createAsyncThunk<any, any>(
  "admin/deleteSan_pham",
  (data) => {
    return API({
      method: "DELETE",
      url: "product/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface productInterface {
  product_id: string;
  productname: string;
  pricesell: number;
  priceentry: number;
  count?: number;
  description: string;
  categoryname?: string;
  category_id: string;
  brandname?: string;
  brand_id: string;
  colorname?: string[];
  color?: string;
  sizename?: string[];
  size?: string;
  img?: string[] | any[];
  product_slug: string;
  parent_id?: string | null;
  total_count?: string;
}

interface productState {
  allProduct: productInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  valeModal: any;
}

const initialState = {
  allProduct: [],
  loading: "idle",
  valeModal: "",
} as productState;

export const productsSlice = createSlice({
  name: "productModal",
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
      getProducts.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.product;
        if (data && data.length > 0) {
          state.allProduct = data;
        } else {
          state.allProduct = [];
        }
        state.loading = "succeeded";
      }
    );

    builder.addCase(
      getAllProducts.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.product;
        if (data && data.length > 0) {
          state.allProduct = data;
        } else {
          state.allProduct = [];
        }
        state.loading = "succeeded";
      }
    );

    builder.addCase(
      productsBySlug.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.product;
        if (data && data.length > 0) {
          state.allProduct = data;
        } else {
          state.allProduct = [];
        }
        state.loading = "succeeded";
      }
    );
    builder.addCase(getProductsDetail.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(
      getProductsDetail.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.product;
        if (data && data.length > 0) {
          state.allProduct = data;
        } else {
          state.allProduct = [];
        }
        state.loading = "succeeded";
      }
    );

    builder.addCase(createProduct.fulfilled, (state) => {
      state.loading = "idle";
      state.allProduct = [];
    });
    builder.addCase(updateProduct.fulfilled, (state) => {
      state.loading = "idle";
      state.allProduct = [];
    });
    builder.addCase(deleteProduct.fulfilled, (state) => {
      state.loading = "idle";
      state.allProduct = [];
    });

    builder.addCase(getProducts.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch product from backend!!!");
    });
  },
});

// Action creators are generated for each case reducer function
export const { set, remove, setLoading } = productsSlice.actions;

export default productsSlice.reducer;
