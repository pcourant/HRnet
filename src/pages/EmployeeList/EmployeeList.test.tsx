import { Server } from 'miragejs';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { appRoute } from 'src/App';
import MockServer from 'src/MockServer';
import {
  wrapperQueryClient,
  wrapperRouterAndQueryClient,
} from '@tests/test-utils';

import EmployeeList from './EmployeeList';

let server: Server;

beforeEach(() => {
  server = MockServer();
});

afterEach(() => {
  server.shutdown();
});

describe('EmployeeList component', () => {
  beforeEach(() => {
    render(<EmployeeList />, {
      wrapper: wrapperRouterAndQueryClient,
    });
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
    render(<RouterProvider router={router} />, {
      wrapper: wrapperQueryClient,
    });
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
