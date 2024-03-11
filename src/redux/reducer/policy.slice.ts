import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import API from "../axios";

export const getPolicies = createAsyncThunk("policy/get", () => {
  return API.get("policy/read.php")
    .then((response) => response.data)
    .catch((err) => err.message);
});

export interface policyInterface {
  policy_id: string;
  name: string;
  description: string;
  icon: string;
  createddate: Date | null;
  modifieddate: Date | null;
}

interface policyState {
  policy: policyInterface[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  policy: [],
  loading: "idle",
} as policyState;

export const policySlice = createSlice({
  name: "policy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getPolicies.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload.policy;
        if (data && data.length > 0) {
          state.policy = data;
        } else {
          state.policy = [];
        }
        state.loading = "succeeded";
      }
    );

    builder.addCase(getPolicies.rejected, (state) => {
      state.loading = "failed";
      console.log("Failed to fetch todos from backend!!!");
    });
  },
});

export const {} = policySlice.actions;

export default policySlice.reducer;
