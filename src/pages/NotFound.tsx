import { Link } from 'react-router-dom';

/**
 * Display not found 404 error page
 * @component
 * @returns not found 404 error page
 */
function NotFound() {
  return (
    <>
      <h1>Not Found</h1>
      <Link to="/">GO HOME</Link>
    </>
  );
}

export default NotFound;
