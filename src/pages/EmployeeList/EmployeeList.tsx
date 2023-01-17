import EmployeesTable from '@components/EmployeesTable';
import { Link } from 'react-router-dom';

/**
 * Display the page showing table of employees
 * @component
 * @returns employee list page
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
