import { Link } from 'react-router-dom';

import { EmployeesTable } from '@components';

/**
 * Display the page showing the table of employees
 * @component
 * @return {React.ReactElement} A JSX representation of the employee list page
 */
function EmployeeList() {
  return (
    <>
      <div className="title">
        <h1>HRnet</h1>
      </div>
      <div className="container">
        <Link to="/">Home</Link>
        <h2>Current Employees</h2>
        <EmployeesTable />
      </div>
    </>
  );
}

export default EmployeeList;
