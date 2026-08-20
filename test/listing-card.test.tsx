import { renderWithProviders, screen } from './utils';
import { ListingCard } from '@/components/listing-card';
import { sampleListing } from './fixtures';

describe('<ListingCard />', () => {
  it('shows price, title, location and specs', () => {
    renderWithProviders(<ListingCard listing={sampleListing} />);

    expect(screen.getByText(/1,25,00,000/)).toBeInTheDocument(); // ₹1.25 Cr
    expect(screen.getByText('3 BHK Apartment in Powai')).toBeInTheDocument();
    expect(screen.getByText('Powai, Mumbai')).toBeInTheDocument();
    expect(screen.getByText('3 Beds')).toBeInTheDocument();
    expect(screen.getByText('1,450 sqft')).toBeInTheDocument();
  });

  it('links to the detail page', () => {
    renderWithProviders(<ListingCard listing={sampleListing} />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/listings/pf-0001',
    );
  });
});
