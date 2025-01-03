import { createSlice } from '@reduxjs/toolkit'

export const simulationControlSlice = createSlice({
    name: 'simulationControl',
    initialState: {
        simulationActive: false,
    },
    reducers: {
        startSimulationAction: (state, action) => {
        state.simulationActive = true;
        },

        stopSimulationAction: (state, action) => {
        state.simulationActive = false;
        },
    },
    });

export const { stopSimulationAction, startSimulationAction } = simulationControlSlice.actions;

export default simulationControlSlice.reducer;