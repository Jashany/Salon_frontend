import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    artist: localStorage.getItem("artist") ? JSON.parse(localStorage.getItem("artist")) : null,
};

const artistSlice = createSlice({
    name: "artist",
    initialState,
    reducers: {
        setArtist: (state, action) => {
            const { id } = action.payload;
            state.artist = id; // Store the artist ID as a single string
            localStorage.setItem("artist", JSON.stringify(id));
        },
        clearArtist: (state) => {
            state.artist = null;
            localStorage.removeItem("artist");
        },
    },
});

export const { setArtist, clearArtist } = artistSlice.actions;

export default artistSlice.reducer;
