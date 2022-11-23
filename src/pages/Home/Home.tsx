import CreateEmployeeForm from '@components/CreateEmployeeForm/CreateEmployeeForm';
import { Link } from 'react-router-dom';

function Home() {
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
