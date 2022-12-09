import EmployeesTable from '@components/EmployeesTable/EmployeesTable';
import { Link } from 'react-router-dom';

function EmployeeList() {
  return (
    <div id="employee-div" className="container">
      <Link to="/">Home</Link>
      <h1>Current Employees</h1>
      <EmployeesTable />
    </div>
  );
}

export default EmployeeList;
