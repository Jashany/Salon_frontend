import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./Slices/apiSlice";
import servicesReducer from "./Slices/servicesSlice";
import artistReducer from "./Slices/artistSlice";
import authReducer from "./Slices/authSlice";
import appointmentReducer from "./Slices/appointmentSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        services: servicesReducer,
        appointment: appointmentReducer,
        auth: authReducer,
        artist: artistReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;