import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BrowserRouter,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import { appRoute } from 'src/App';
import { describe, expect, it } from 'vitest';
import Home from './Home';

describe('Home component', () => {
  beforeEach(() => {
    render(<Home />, { wrapper: BrowserRouter });
  });

  it('should render without crash', () => {});

  it('should render HRnet title', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'HRnet'
    );
  });
});

describe('Home integration tests', () => {
  beforeEach(() => {
    const router = createMemoryRouter([appRoute], {
      initialEntries: ['/'],
    });
    render(<RouterProvider router={router} />);
  });

  describe('When I click on View Current Employees link', () => {
    it('should redirect me to the employees list', async () => {
      const user = userEvent.setup();

      expect(screen.getByText('View Current Employees')).toBeInTheDocument();

      await user.click(screen.getByText('View Current Employees'));
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Current Employees'
      );
    });
  });
});
