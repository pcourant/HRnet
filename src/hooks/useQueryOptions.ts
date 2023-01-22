import { useCallback, useState } from 'react';
import { GridFilterModel, GridSortModel } from '@mui/x-data-grid';

import { QueryOptionsInterface } from '@types';

/**
 * Custom hook for managing the query options and callbacks for filter and sort changes
 * @param {Object} initialState - the initial state of the query options
 * @returns {Object} an object containing the query options, onFilterChange and onSortChange callbacks
 * @property {Object} queryOptions - the current state of the query options
 * @property {Function} onFilterChange - callback function for handling filter changes
 * @property {Function} onSortChange - callback function for handling sort changes
 */
const useQueryOptions = (initialState: QueryOptionsInterface) => {
  const [queryOptions, setQueryOptions] = useState(initialState);

  /**
   * Callback function for handling filter changes
   * @param {Object} filterModel - the new filter model
   */
  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    if (filterModel?.quickFilterValues) {
      setQueryOptions((prevValue) => ({
        ...prevValue,
        filterModel: { ...filterModel },
      }));
    }
  }, []);

  /**
   * Callback function for handling sort changes
   * @param {Object} sortModel - the new sort model
   */
  const onSortChange = useCallback((sortModel: GridSortModel) => {
    if (sortModel?.length) {
      setQueryOptions((prevValue) => ({
        ...prevValue,
        sortModel: { ...sortModel },
      }));
    }
  }, []);

  return { queryOptions, onFilterChange, onSortChange };
};

export default useQueryOptions;
