import { createSlice } from "@reduxjs/toolkit";
import sceneType, { forceInfoType, powerupInfoType } from "../library/scene";
import bodyType from "../library/body";
import { flyballInit } from "../library/flyball";

const initialState:sceneType = flyballInit();

export const sceneSlice = createSlice({
    name: "scene",
    initialState,
    reducers: {
        addBody: (state, action) => {
            state.bodies = [ ...state.bodies, action.payload as bodyType ]; 
        },
        setBodies: (state, action) => {
            state.bodies = action.payload;
        },
        addForce: (state, action) => {
            state.forces = [ ...state.forces, action.payload as forceInfoType ]; 
        },
        addPowerup: (state, action) => {
            state.powerups = [ ...state.powerups, action.payload as powerupInfoType ]; 
        },
        setScene: (state, action) => {
            state.bodies = action.payload.bodies; 
            state.forces = action.payload.forces;
            state.powerups = action.payload.powerups;
            state.scrollVelocity = action.payload.scrollVelocity;
            state.nextBodyIndex = action.payload.nextBodyIndex;
            state.score = action.payload.score;
            state.multiplier = action.payload.multiplier;
        }
    }
});

export const { addBody, setBodies, addForce, addPowerup, setScene } = sceneSlice.actions;
export default sceneSlice.reducer;