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
      <Link to={import.meta.env.BASE_URL}>Home</Link>
      <h1>Current Employees</h1>
      <EmployeesTable />
    </div>
  );
}

export default EmployeeList;
