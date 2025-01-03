import { createSlice } from '@reduxjs/toolkit'

export const platformInfoSlice = createSlice({
    name: 'platformInfo',
    initialState: {
        noOfPlatforms: 0,
        platformInfo: [],
    },
    reducers: {
        setNoOfPlatformsAction: (state, action) => {
        state.noOfPlatforms = action.payload;
        },

        setPlatformInfoAction: (state, action) => {
        state.platformInfo = action.payload;
        },
    },
    });

export const { setPlatformInfoAction, setNoOfPlatformsAction } = platformInfoSlice.actions;

export default platformInfoSlice.reducer;