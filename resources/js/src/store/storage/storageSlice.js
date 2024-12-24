import { createSlice } from "@reduxjs/toolkit";

export const storageSlice = createSlice({
    name: "storage",
    initialState: {
        selectedFields: null,
    },
    reducers: {
        onStorageFields: (state, { payload }) => {
            state.selectedFields = payload;
        },
        onClearStorage: (state) => {
            state.selectedFields = null;
        },
    },
});

export const { onStorageFields, onClearStorage } = storageSlice.actions;
