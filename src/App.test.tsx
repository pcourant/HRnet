import { describe, expect, it } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import App, { appRoute } from './App';

describe('App routes', () => {
  describe('When root path', () => {
    it('should renders hello word', () => {
      const router = createMemoryRouter([appRoute], {
        initialEntries: ['/'],
      });
      render(<RouterProvider router={router} />);

      expect(screen.getByRole('heading')).toHaveTextContent('hello world');
    });
  });

  describe('When invalid path', () => {
    it('should renders Not Found', () => {
      const router = createMemoryRouter([appRoute], {
        initialEntries: ['/invalid_path'],
      });
      render(<RouterProvider router={router} />);

      expect(screen.getByRole('heading')).toHaveTextContent('Not Found');
    });
  });
});

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('should renders a header', () => {
    expect(screen.getByRole('banner')).toHaveTextContent('header');
  });
  it('should renders a footer', () => {
    expect(screen.getByRole('contentinfo')).toHaveTextContent('footer');
  });
});
