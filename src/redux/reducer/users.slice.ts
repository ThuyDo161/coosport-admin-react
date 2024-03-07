import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getUsers = createAsyncThunk("users/get", () => {
  return API.get("users/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export const updateUsers = createAsyncThunk<any, usersInterface>(
  "users/update",
  (data) => {
    return API.put("users/update.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const createUsers = createAsyncThunk<any, usersInterface>(
  "users/create",
  (data) => {
    return API.post("users/create.php", data)
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const deleteUsers = createAsyncThunk<any, string>(
  "users/delete",
  (data) => {
    return API({
      method: "DELETE",
      url: "users/delete.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);
export const resetUser = createAsyncThunk<any, string>(
  "users/delete",
  (data) => {
    return API({
      method: "DELETE",
      url: "users/reset.php",
      data,
    })
      .then((response) => response.data)
      .catch((err) => err.message);
  }
);

export interface usersInterface {
  users_id?: string;
  name: string;
  address: string;
  user_tel: string;
  role_id?: string;
  role_name?: string;
  status?: string;
  username?: string;
  password?: string;
  createddate?: string;
  modifieddate?: string;
}

export interface roleInterface {
  role_id: string;
  rolename: string;
}

interface usersState {
  allUsers: usersInterface[];
  users: usersInterface[];
  staff: usersInterface[];
  roles: roleInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  allUsers:[],
  users: [],
  staff: [],
  roles: [],
  loading: "idle",
} as usersState;

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state, action: PayloadAction<any>) => {
      const users: usersInterface[] = action.payload.users;
      const roles = action.payload.roles;
      if (users && users.length > 0) {
        state.users = users.filter(
          (user) => user.role_id === "3" || user.role_id === "4"
        );
        state.staff = users.filter(
          (user) => user.role_id === "1" || user.role_id === "2"
        );
        state.loading = "succeeded";
      }
      if (roles && roles.length > 0) {
        state.roles = roles;
        state.loading = "succeeded";
      }
      state.allUsers = state.users.concat(state.staff)
    });

    builder.addCase(createUsers.fulfilled, (state) => {
      state.loading = "idle";
      state.users = [];
    });
    builder.addCase(updateUsers.fulfilled, (state) => {
      state.loading = "idle";
      state.users = [];
    });
    builder.addCase(deleteUsers.fulfilled, (state) => {
      state.loading = "idle";
      state.users = [];
    });

    builder.addCase(getUsers.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch users from backend!!!");
    });
  },
});

export const {} = usersSlice.actions;

export default usersSlice.reducer;
