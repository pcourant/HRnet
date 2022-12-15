import CreateEmployeeForm from '@components/CreateEmployeeForm';
import { Link } from 'react-router-dom';

import { useEmployees } from '@services';
import { queryOptionsInit } from '@types';

/**
 * Display Home page with create employee form
 * @returns home page
 */
function Home() {
  // * Prefetch the first employees to anticipate employee-list page
  useEmployees(0, 10, true, queryOptionsInit);

  return (
    <>
      <div className="title">
        <h1>HRnet</h1>
      </div>
      <div className="container">
        <Link to="employee-list">View Current Employees</Link>
        <CreateEmployeeForm />
      </div>
    </>
  );
}

export default Home;
