import { createSlice } from '@reduxjs/toolkit'

export const simulationControlSlice = createSlice({
    name: 'simulationControl',
    initialState: {
        simulationActive: false,
    },
    reducers: {
        startSimulationAction: (state) => {
        state.simulationActive = true;
        },

        stopSimulationAction: (state) => {
        state.simulationActive = false;
        },
    },
    });

export const { stopSimulationAction, startSimulationAction } = simulationControlSlice.actions;

export default simulationControlSlice.reducer;