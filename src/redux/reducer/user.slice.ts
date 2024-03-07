import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export interface userInterface {
  address: string;
  createddate?: Date;
  modifiedby?: Date;
  modifieddate?: Date;
  name: string;
  password: string;
  role_id?: string;
  rolecode?: string;
  rolename?: string;
  status?: string;
  user_id?: string;
  user_tel?: string;
  username: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export const registerAPI = createAsyncThunk<any, userInterface>(
  "user/register",
  (data) => {
    return API({
      method: "POST",
      url: "account/register.php",
      data,
    })
      .then((response) => response.data)
      .catch((error) => error.message);
  }
);
export const updateAPI = createAsyncThunk<any, any>("user/update", (data) => {
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : "";
  return API({
    method: "PUT",
    url: "account/update.php",
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
    .then((response) => response.data)
    .catch((error) => error.message);
});
export const changePassAPI = createAsyncThunk<any, any>(
  "user/changePassword",
  (data) => {
    const token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    return API({
      method: "PUT",
      url: "account/changepass.php",
      headers: { Authorization: `Bearer ${token}` },
      data,
    })
      .then((response) => response.data)
      .catch((error) => error.message);
  }
);
export const loginAPI = createAsyncThunk<any, UserCredentials>(
  "user/login",
  async (data: UserCredentials) => {
    return API({
      method: "POST",
      url: "account/login.php",
      data,
    })
      .then((response) => response.data)
      .catch((error) => error.message);
  }
);
export const getUser = createAsyncThunk("user/getUser", () => {
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : "";
  return API.get("account/user.php", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.data)
    .catch((error) => error.message);
});
export const getOrder = createAsyncThunk<any, any>("user/getOrder", (id) => {
  return API.get("bill/read.php?_MaKH=" + id)
    .then((response) => response.data)
    .catch((error) => error.message);
});

interface userState {
  user: userInterface | null;
  register: null;
  login: null;
  order: any[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  user: null,
  register: null,
  login: null,
  order: [],
  loading: "idle",
} as userState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOutAccount: (state) => {
      state.user = null;
      state.login = null;
      state.register = null;
      state.order = [];
      localStorage.setItem("token", "");
    },
    setUser: (state, action: PayloadAction<userInterface>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      registerAPI.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload;
        if (data) {
          state.register = data;
        }
      }
    );
    builder.addCase(registerAPI.rejected, () => {
      console.error("Truyền dữ liệu đăng ký không thành công!");
    });

    builder.addCase(loginAPI.fulfilled, (state, action: PayloadAction<any>) => {
      const data = action.payload;
      if (data) {
        state.login = data;
        if (data.code === 200) {
          localStorage.setItem("token", action.payload.token);
        }
      }
    });
    builder.addCase(loginAPI.rejected, () => {
      console.error("Truyền dữ liệu đăng nhập không thành công!");
    });

    builder.addCase(getUser.pending, (state) => {
      state.user = null;
    });

    builder.addCase(getUser.fulfilled, (state, action: PayloadAction<any>) => {
      const data = action.payload;
      if (data && data.status === 200) {
        state.user = data.user;
      }
    });
    builder.addCase(getUser.rejected, () => {
      console.error(
        "Truyền dữ liệu lấy thông tin người dùng không thành công!"
      );
    });

    builder.addCase(updateAPI.rejected, () => {
      console.error(
        "Truyền dữ liệu update thông tin người dùng không thành công!"
      );
    });

    builder.addCase(changePassAPI.rejected, () => {
      console.error(
        "Truyền dữ liệu thay đổi mật khẩu người dùng không thành công!"
      );
    });

    builder.addCase(getOrder.fulfilled, (state, action: PayloadAction<any>) => {
      const data = action.payload;
      if (data.bill) {
        state.order = data.bill.map((item: any) => ({
          ...item,
          Total: Number.parseInt(item.Total).toLocaleString(),
        }));
      }
    });
    builder.addCase(getOrder.rejected, () => {
      console.error("Truyền dữ liệu lấy danh sách đơn hàng không thành công!");
    });
  },
});

// export actions
export const { logOutAccount, setUser } = userSlice.actions;

export default userSlice.reducer;
