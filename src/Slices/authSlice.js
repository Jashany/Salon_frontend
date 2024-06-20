import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    auth: localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : null,
};

//return res.status(201).json({
//     _id: user._id,
//     phoneNumber: user.phoneNumber,
//     role: user.role,
//     isSalon: user.isSalon,
//   });

const artistSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        user: (state, action) => {
            const { _id, phoneNumber,name, role, isSalon } = action.payload;
            state.auth = { _id, phoneNumber,name ,role, isSalon };
            localStorage.setItem("auth", JSON.stringify(state.auth));
        },
        clearUser: (state) => {
            state.auth = null;
            localStorage.removeItem("auth");
        },
    },
});

export const { user, clearUser } = artistSlice.actions;

export default artistSlice.reducer;