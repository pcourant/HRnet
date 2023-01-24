import { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface PageData {
  pageSize: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  fetchEnabled: boolean;
}

/**
 * Custom hook that manages pagination state and provides an API to update the current page size.
 *
 * @param initialPageSize - The initial value for the page size. Defaults to 10.
 * @param initialPage - The initial value for the current page. Defaults to 0.
 * @returns An array containing the pagination state and a function to update the page size.
 *
 * @example const [paginationData, handlePageSizeChange] = usePagination(10, 0);
 */
const usePagination = (
  initialPageSize = 10,
  initialPage = 0
): [PageData, (newPageSize: number) => void] => {
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(initialPage);

  const [previousPageSize, setPreviousPageSize] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [fetchEnabled, setFetchEnabled] = useState(true);

  /**
   * handlePageSizeChange - function to handle changes in page size
   *
   * @param {number} newPageSize - new page size
   */
  const handlePageSizeChange = (newPageSize: number) => {
    setFetchEnabled(false);
    setPreviousPageSize(pageSize);
    setPreviousPage(page);

    setPageSize(newPageSize);
  };

  /**
   * useEffect hook that updates the current page when the page size changes.
   */
  useEffect(() => {
    const previousRow = previousPage * previousPageSize;
    const newPageFixed = Math.floor(previousRow / pageSize);
    setFetchEnabled(true);
    setPage(newPageFixed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  return [{ pageSize, page, setPage, fetchEnabled }, handlePageSizeChange];
};

export default usePagination;
