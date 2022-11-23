import { render, screen } from '@testing-library/react';
import CreateEmployeeForm from './CreateEmployeeForm';

describe('CreateEmployeeForm component', () => {
  beforeEach(() => {
    render(<CreateEmployeeForm />);
  });

  it('should render without crash', () => {});

  it('should render Create Employee title', () => {
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Create Employee'
    );
  });
});
