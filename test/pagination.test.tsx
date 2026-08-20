import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Pagination } from '@/components/pagination';

describe('<Pagination />', () => {
  it('renders nothing for a single page', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('disables Previous on the first page', () => {
    render(<Pagination page={1} totalPages={5} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });

  it('emits the chosen page number', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    // page=3 keeps 1..5 all within the visible window.
    render(<Pagination page={3} totalPages={5} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '5' }));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('marks the current page', () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
