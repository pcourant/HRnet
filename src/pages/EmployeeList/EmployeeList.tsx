import EmployeesTable from '@components/EmployeesTable';
import { Link } from 'react-router-dom';

/**
 * Display the page showing table of employees
 * @component
 * @returns employee list page
 */
function EmployeeList() {
  return (
    <div id="employee-div" className="container">
      <h1>Current Employees</h1>
      <Link to="/">Home</Link>
      <EmployeesTable />
    </div>
  );
}

export default EmployeeList;
