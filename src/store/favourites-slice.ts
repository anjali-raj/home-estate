import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type FavouritesState = {
  ids: string[];
  hydrated: boolean;
};

const initialState: FavouritesState = {
  ids: [],
  hydrated: false,
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    /** Replace state from persistence for the active user. */
    hydrateFavourites(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
      state.hydrated = true;
    },
    toggleFavourite(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((x) => x !== id)
        : [id, ...state.ids];
    },
    clearFavourites(state) {
      state.ids = [];
    },
  },
});

export const { hydrateFavourites, toggleFavourite, clearFavourites } =
  favouritesSlice.actions;
export default favouritesSlice.reducer;
