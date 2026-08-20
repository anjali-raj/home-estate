import { render, type RenderOptions } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import type { ReactElement, ReactNode } from 'react';
import { makeStore, type AppStore } from '@/store';
import { hydrateFavourites } from '@/store/favourites-slice';
import { hydrateSavedSearches } from '@/store/saved-searches-slice';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';

/**
 * Render a component with the same providers the app uses. By default the
 * store is pre-hydrated so persistence-gated UI (e.g. the favourite button)
 * is interactive.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    store = makeStore(),
    favourites = [],
    ...options
  }: RenderOptions & { store?: AppStore; favourites?: string[] } = {},
) {
  store.dispatch(hydrateFavourites(favourites));
  store.dispatch(hydrateSavedSearches([]));

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ReduxProvider store={store}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </ReduxProvider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}

export * from '@testing-library/react';
