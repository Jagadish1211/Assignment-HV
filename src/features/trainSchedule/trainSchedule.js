import { createSlice } from '@reduxjs/toolkit'

export const trainScheduleSlice = createSlice({
    name: 'trainSchedule',
    initialState: {
        trainSchedule: [],
        noOfPlatforms: 0,
        trainDashboardInfo: [],
    },
    reducers: {
        saveTrainScheduleAction: (state, action) => {
        state.trainSchedule = action.payload;
        },

        saveTrainDashboardInfoAction: (state, action) => {
        state.trainDashboardInfo = action.payload;
        },

        setNoOfPlatformsAction: (state, action) => {
        state.noOfPlatforms = action.payload;
        },
    },
    });

export const { saveTrainScheduleAction, setNoOfPlatformsAction, saveTrainDashboardInfoAction } = trainScheduleSlice.actions;

export default trainScheduleSlice.reducer;