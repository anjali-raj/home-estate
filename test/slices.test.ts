import reducer, {
  hydrateFavourites,
  toggleFavourite,
  clearFavourites,
} from '@/store/favourites-slice';
import savedReducer, {
  hydrateSavedSearches,
  addSavedSearch,
  removeSavedSearch,
} from '@/store/saved-searches-slice';

describe('favourites slice', () => {
  it('starts empty and un-hydrated', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ ids: [], hydrated: false });
  });

  it('hydrates from persistence', () => {
    const state = reducer(undefined, hydrateFavourites(['a', 'b']));
    expect(state.ids).toEqual(['a', 'b']);
    expect(state.hydrated).toBe(true);
  });

  it('toggles an id on then off, newest-first', () => {
    let state = reducer(undefined, hydrateFavourites(['x']));
    state = reducer(state, toggleFavourite('y'));
    expect(state.ids).toEqual(['y', 'x']);
    state = reducer(state, toggleFavourite('y'));
    expect(state.ids).toEqual(['x']);
  });

  it('clears all', () => {
    const state = reducer(
      { ids: ['a', 'b'], hydrated: true },
      clearFavourites(),
    );
    expect(state.ids).toEqual([]);
  });
});

describe('savedSearches slice', () => {
  it('adds a search with a stamped id/createdAt', () => {
    const state = savedReducer(undefined, addSavedSearch('Mumbai flats', 'city=Mumbai'));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      label: 'Mumbai flats',
      query: 'city=Mumbai',
    });
    expect(state.items[0].id).toBeTruthy();
    expect(state.items[0].createdAt).toBeTruthy();
  });

  it('de-dupes by query, keeping newest first', () => {
    let state = savedReducer(undefined, addSavedSearch('old', 'city=Pune'));
    state = savedReducer(state, addSavedSearch('newer label', 'city=Pune'));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].label).toBe('newer label');
  });

  it('removes by id', () => {
    let state = savedReducer(undefined, addSavedSearch('a', 'q=1'));
    const id = state.items[0].id;
    state = savedReducer(state, removeSavedSearch(id));
    expect(state.items).toHaveLength(0);
  });

  it('hydrates', () => {
    const state = savedReducer(
      undefined,
      hydrateSavedSearches([
        { id: '1', label: 'l', query: 'q', createdAt: 'now' },
      ]),
    );
    expect(state.items).toHaveLength(1);
    expect(state.hydrated).toBe(true);
  });
});
