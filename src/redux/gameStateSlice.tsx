import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "Guest",
    highscore: 0,
    playing: false,
    dead: false,
}

export const engineSlice = createSlice({
    name: "gameState",
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload; 
        },
        setHighscore: (state, action) => {
            state.highscore = action.payload;
        },
        setReady: (state, action) => {
            state.playing = action.payload; 
        },
        setDead: (state, action) => {
            state.dead = action.payload; 
        },
    }
});

export const { setName, setHighscore, setReady, setDead, } = engineSlice.actions;
export default engineSlice.reducer;