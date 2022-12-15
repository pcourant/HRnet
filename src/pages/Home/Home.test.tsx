import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { wrapperRouterAndQueryClient } from 'src/__TESTS__/test-utils';
import { appRoute } from 'src/App';
import MockServer from 'src/MockServer/MockServer';
import { Server } from 'miragejs';
import Home from './Home';

let server: Server;

beforeEach(() => {
  server = MockServer();
});

afterEach(() => {
  server.shutdown();
});

describe('Home component', () => {
  beforeEach(() => {
    render(<Home />, { wrapper: wrapperRouterAndQueryClient });
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
