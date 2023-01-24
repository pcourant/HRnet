import { Link } from 'react-router-dom';

import { CreateEmployeeForm } from '@components';
import { useEmployees } from '@services';
import { useQueryOptions } from '@hooks';

/**
 * Display Home page with create employee form
 * @returns {React.ReactElement} home page
 * @component
 */
function Home() {
  // * Prefetch the first employees to anticipate employee-list page
  const { queryOptions } = useQueryOptions({
    sortModel: [{ field: 'firstname', sort: 'asc' }],
    filterModel: { items: [], quickFilterValues: [] },
  });
  useEmployees(0, 10, true, queryOptions);

  return (
    <>
      <div className="title">
        <h1>HRnet</h1>
      </div>
      <div className="container">
        <Link to="employee-list">View Current Employees</Link>
        <h2>Create Employee</h2>
        <CreateEmployeeForm />
      </div>
    </>
  );
}

export default Home;
