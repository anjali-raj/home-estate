import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { PurposeTabs } from '@/components/purpose-tabs';

// Mock the nuqs-backed hook so we can test the component in isolation.
const setFilters = jest.fn();
let currentFilters: Record<string, unknown> = {};

jest.mock('@/hooks/use-listing-filters', () => ({
  useListingFilters: () => [currentFilters, setFilters],
}));

beforeEach(() => {
  setFilters.mockClear();
  currentFilters = {};
});

describe('<PurposeTabs />', () => {
  it('renders All / Buy / Rent as tabs', () => {
    render(<PurposeTabs />);
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Buy' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Rent' })).toBeInTheDocument();
  });

  it('marks Buy selected when listingType is sale', () => {
    currentFilters = { listingType: 'sale' };
    render(<PurposeTabs />);
    expect(screen.getByRole('tab', { name: 'Buy' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('sets listingType=rent (and resets page) when Rent is clicked', async () => {
    const user = userEvent.setup();
    render(<PurposeTabs />);

    await user.click(screen.getByRole('tab', { name: 'Rent' }));
    expect(setFilters).toHaveBeenCalledWith({ listingType: 'rent', page: 1 });
  });

  it('clears listingType when All is clicked', async () => {
    const user = userEvent.setup();
    render(<PurposeTabs />);

    await user.click(screen.getByRole('tab', { name: 'All' }));
    expect(setFilters).toHaveBeenCalledWith({ listingType: null, page: 1 });
  });
});
