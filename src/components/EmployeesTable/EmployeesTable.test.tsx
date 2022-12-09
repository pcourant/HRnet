import { render } from '@testing-library/react';
import EmployeesTable from './EmployeesTable';

describe('EmployeesTable component', () => {
  beforeEach(() => {
    render(<EmployeesTable />);
  });

  it('should render without crash', () => {});
});
