import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SavedSearch = {
  id: string;
  label: string;
  /** serialized URLSearchParams string, e.g. "city=Mumbai&minBeds=2" */
  query: string;
  createdAt: string;
};

type SavedSearchesState = {
  items: SavedSearch[];
  hydrated: boolean;
};

const initialState: SavedSearchesState = {
  items: [],
  hydrated: false,
};

const savedSearchesSlice = createSlice({
  name: 'savedSearches',
  initialState,
  reducers: {
    hydrateSavedSearches(state, action: PayloadAction<SavedSearch[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
    addSavedSearch: {
      // Prepare callback stamps id/createdAt so reducers stay pure.
      reducer(state, action: PayloadAction<SavedSearch>) {
        // De-dupe by query — keep the newest.
        state.items = [
          action.payload,
          ...state.items.filter((s) => s.query !== action.payload.query),
        ];
      },
      prepare(label: string, query: string) {
        return {
          payload: {
            id: `${query}::${label}`,
            label,
            query,
            createdAt: new Date().toISOString(),
          } satisfies SavedSearch,
        };
      },
    },
    removeSavedSearch(state, action: PayloadAction<string>) {
      state.items = state.items.filter((s) => s.id !== action.payload);
    },
  },
});

export const { hydrateSavedSearches, addSavedSearch, removeSavedSearch } =
  savedSearchesSlice.actions;
export default savedSearchesSlice.reducer;
