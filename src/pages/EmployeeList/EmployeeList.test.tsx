import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BrowserRouter,
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom';
import { appRoute } from 'src/App';
import { describe, expect, it } from 'vitest';
import EmployeeList from './EmployeeList';

describe('EmployeeList component', () => {
  beforeEach(() => {
    render(<EmployeeList />, { wrapper: BrowserRouter });
  });

  it('should render without crash', () => {});

  it('should render Current Employees title', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Current Employees'
    );
  });
});

describe('EmployeeList integration tests', () => {
  beforeEach(() => {
    const router = createMemoryRouter([appRoute], {
      initialEntries: ['/employee-list'],
    });
    render(<RouterProvider router={router} />);
  });

  describe('When I click on Home link', () => {
    it('should redirect me to the Home page', async () => {
      const user = userEvent.setup();

      expect(screen.getByText('Home')).toBeInTheDocument();

      await user.click(screen.getByText('Home'));
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'HRnet'
      );
    });
  });
});
