import { createSlice } from "@reduxjs/toolkit";

//const { artistId, appointmentDate, appointmentStartTime, duration} = req.body;

const initialState = {
    appointment: localStorage.getItem("appointment") ? JSON.parse(localStorage.getItem("appointment")) : null,
};

const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        setAppointment: (state, action) => {
            const { artistId , appointmentDate,appointmentStartTime ,duration ,services } = action.payload;
            state.appointment = { artistId, appointmentDate,appointmentStartTime , duration ,services};
            localStorage.setItem("appointment", JSON.stringify(state.appointment));
        },
        clearAppointment: (state) => {
            state.appointment = null;
            localStorage.removeItem("appointment");
        },
    },
});

export const { setAppointment, clearAppointment } = appointmentSlice.actions;

export default appointmentSlice.reducer;