import { createSlice } from "@reduxjs/toolkit";

const InitialState = {
    Services: localStorage.getItem("services") ? JSON.parse(localStorage.getItem("services")) : [],
};

const servicesSlice = createSlice({
    name: "services",
    initialState: InitialState,
    reducers: {
        setServices: (state, action) => {
            const { id } = action.payload;
            const service = { id };
            state.Services.push(service);
            localStorage.setItem("services", JSON.stringify(state.Services));
        },
        removeServices: (state, action) => {
            const { id } = action.payload;
            state.Services = state.Services.filter((service) => service.id !== id);
            localStorage.setItem("services", JSON.stringify(state.Services));
        },
        clearServices: (state) => {
            state.Services = [];
            localStorage.removeItem("services");
        },
    },
});

export const { setServices, removeServices, clearServices } = servicesSlice.actions;

export default servicesSlice.reducer;
