import { render } from '@testing-library/react';

import { wrapperQueryClient } from '@tests/test-utils';
import EmployeesTable from './EmployeesTable';

describe('EmployeesTable component', () => {
  beforeEach(() => {
    render(<EmployeesTable />, { wrapper: wrapperQueryClient });
  });

  it('should render without crash', () => {});
});
