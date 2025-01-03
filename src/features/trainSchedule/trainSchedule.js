import { createSlice } from '@reduxjs/toolkit'

export const trainScheduleSlice = createSlice({
    name: 'trainSchedule',
    initialState: {
        trainSchedule: [],
        noOfPlatforms: 0,
    },
    reducers: {
        saveTrainSchedule: (state, action) => {
        state.trainSchedule = action.payload;
        },

        setNoOfPlatformsAction: (state, action) => {
        state.noOfPlatforms = action.payload;
        },
    },
    });

export const { saveTrainSchedule, setNoOfPlatformsAction } = trainScheduleSlice.actions;

export default trainScheduleSlice.reducer;