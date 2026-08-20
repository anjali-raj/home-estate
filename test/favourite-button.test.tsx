import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from './utils';
import { FavouriteButton } from '@/components/favourite-button';

describe('<FavouriteButton />', () => {
  it('reflects and toggles favourite state in the Redux store', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<FavouriteButton id="he-0001" />);

    const btn = screen.getByRole('button', { name: /add to favourites/i });
    expect(btn).toHaveAttribute('aria-pressed', 'false');

    await user.click(btn);

    expect(store.getState().favourites.ids).toContain('he-0001');
    expect(
      screen.getByRole('button', { name: /remove from favourites/i }),
    ).toHaveAttribute('aria-pressed', 'true');

    await user.click(btn);
    expect(store.getState().favourites.ids).not.toContain('he-0001');
  });

  it('renders as already-favourited when the id is preloaded', () => {
    renderWithProviders(<FavouriteButton id="he-0001" />, {
      favourites: ['he-0001'],
    });
    expect(
      screen.getByRole('button', { name: /remove from favourites/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
