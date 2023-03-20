import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { authFetch, unauthorizedResponse } from "../utils/auth";

const initialState = {
  adminLoading: false,
  shipToName: "",
  shipToAddress: "",
  shipToEmail: "",
  shipToNumber: "",
  floor: "",
  location: "",
  allClients: [],
  singleClientDetails: {},
  singleClientLocations: [],
  singleLocation: {},
  companyServices: [],
  redirect: false,
  isEditing: false,
  id: "",
};

export const clientRegister = createAsyncThunk(
  "admin/clientRegister",
  async (form, thunkAPI) => {
    try {
      const res = await authFetch.post("/shipTo/client", form);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const singleClient = createAsyncThunk(
  "admin/singleClient",
  async (id, thunkAPI) => {
    try {
      const res = await authFetch.get(`/location/singleShipTo/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const addService = createAsyncThunk(
  "admin/addService",
  async (service, thunkAPI) => {
    try {
      const res = await authFetch.post("/admin/service", service);
      thunkAPI.dispatch(clearAdminValues());
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const getCompanyServices = createAsyncThunk(
  "admin/companyServices",
  async (_, thunkAPI) => {
    try {
      const res = await authFetch.get("/admin/service");
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const editService = createAsyncThunk(
  "admin/editService",
  async ({ serviceId, service }, thunkAPI) => {
    try {
      const res = await authFetch.patch(`/admin/service/${serviceId}`, service);
      thunkAPI.dispatch(clearAdminValues());
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const addLocation = createAsyncThunk(
  "admin/addLocation",
  async ({ locationId, location }, thunkAPI) => {
    try {
      const res = await authFetch.post(
        `/location/addLocation/${locationId}`,
        location
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const getLocation = createAsyncThunk(
  "admin/getLocation",
  async (locationId, thunkAPI) => {
    try {
      const res = await authFetch.get(
        `/location/locationServices/${locationId}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const editLocation = createAsyncThunk(
  "admin/editLocation",
  async ({ locationId, location }, thunkAPI) => {
    try {
      const res = await authFetch.patch(
        `/location/locationServices/${locationId}`,
        location
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const addLocationRecord = createAsyncThunk(
  "user/addLocationRecord",
  async ({ id, reportData }, thunkAPI) => {
    try {
      const res = await authFetch.post(`/report/addRecord/${id}`, {
        reportData,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const createReport = createAsyncThunk(
  "user/createReport",
  async ({ client, fromDate, toDate, subLocation, service }, thunkAPI) => {
    try {
      const res = await authFetch.get(
        `/report/allReports?shipTo=${client}&fromDate=${fromDate}&toDate=${toDate}&serviceId=${service}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    handleAdmin: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearAdminValues: (state) => initialState,
    setEdit: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clientRegister.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(clientRegister.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.floor = payload.id;
        state.redirect = true;
        toast.success(payload.msg);
      })
      .addCase(clientRegister.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(singleClient.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(singleClient.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.singleClientDetails = payload.clientDetails;
        state.singleClientLocations = payload.clientLocations;
      })
      .addCase(singleClient.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(addService.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(addService.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        toast.success(payload.msg);
      })
      .addCase(addService.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(getCompanyServices.pending, (state, { payload }) => {
        state.adminLoading = true;
      })
      .addCase(getCompanyServices.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.allClients = payload.allShipTo;
        state.companyServices = payload.services;
      })
      .addCase(editService.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(editService.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.isEditing = false;
        toast.success(payload.msg);
      })
      .addCase(editService.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(addLocation.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(addLocation.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.floor = "";
        state.location = "";
        toast.success(payload.msg);
      })
      .addCase(addLocation.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(editLocation.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(editLocation.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.isEditing = false;
        state.floor = "";
        state.location = "";
        toast.success(payload.msg);
      })
      .addCase(editLocation.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(getLocation.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(getLocation.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.singleLocation = payload.location;
        toast.success(payload.msg);
      })
      .addCase(getLocation.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(addLocationRecord.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(addLocationRecord.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        toast.success(payload.msg);
      })
      .addCase(addLocationRecord.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      })
      .addCase(createReport.pending, (state) => {
        state.adminLoading = true;
        state.id = "";
      })
      .addCase(createReport.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.id = payload.link;
        toast.success(payload.msg);
      })
      .addCase(createReport.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      });
  },
});

export const { handleAdmin, clearAdminValues, setEdit } = adminSlice.actions;

export default adminSlice.reducer;
