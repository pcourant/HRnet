import { describe, expect, it } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import appRoute, { App } from './App';

describe('App routes', () => {
  describe('When root path', () => {
    it('should render HRnet', () => {
      const router = createMemoryRouter([appRoute], {
        initialEntries: ['/'],
      });
      render(<RouterProvider router={router} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'HRnet'
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Create Employee'
      );
    });
  });

  describe('When invalid path', () => {
    it('should render Not Found', () => {
      const router = createMemoryRouter([appRoute], {
        initialEntries: ['/invalid_path'],
      });
      render(<RouterProvider router={router} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Not Found'
      );
    });
  });

  describe('When employee list path', () => {
    it('should render Current Employees', () => {
      const router = createMemoryRouter([appRoute], {
        initialEntries: ['/employee-list'],
      });
      render(<RouterProvider router={router} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Current Employees'
      );
    });
  });
});

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });
  it('should render without crash', () => {});
  // it('should render a header', () => {
  //   expect(screen.getByRole('banner')).toHaveTextContent('header');
  // });
  // it('should render a footer', () => {
  //   expect(screen.getByRole('contentinfo')).toHaveTextContent('footer');
  // });
});
