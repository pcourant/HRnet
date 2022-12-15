import { render, screen } from '@testing-library/react';

import { wrapperQueryClient } from '@tests/test-utils';
import CreateEmployeeForm from './CreateEmployeeForm';

describe('CreateEmployeeForm component', () => {
  beforeEach(() => {
    render(<CreateEmployeeForm />, { wrapper: wrapperQueryClient });
  });

  it('should render without crash', () => {});

  it('should render Create Employee title', () => {
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Create Employee'
    );
  });
});
