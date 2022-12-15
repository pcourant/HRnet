import { GridSortDirection } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import type {
  Employee,
  GetEmployeesResponse,
  QueryOptionsInterface,
} from '@types';

import ENDPOINTS from './endpoints';
import client from './lib/axios';

const SERVER_PAGE_SIZE = +import.meta.env.VITE_PAGE_LENGTH;

/**
 * Data fetching function
 * @async
 * @param page - the page of employees to be fetched
 * @param sortingField - field for sorting employee (first name, last name, DOB, etc.)
 * @param sortingOrder - order for sorting data (asc or desc)
 * @param filters - filters for filtering data
 * @returns The page of the sorted and filtered employees from server
 */
export const fetchEmployees = async (
  page: number,
  sortingField?: string,
  sortingOrder?: GridSortDirection,
  filters?: string
): Promise<GetEmployeesResponse> => {
  const response = await client.get(
    `${
      ENDPOINTS.employees
    }/page/${page}/sort/${sortingField}/${sortingOrder}/filters/${
      filters || 'noFilter'
    }`
  );
  return response.data;
};

/**
 * Custom hook for fetching employees with React Query
 * @param pageOnClient - page on client side to be fetched
 * @param pageSizeOnClient - page size on client size
 * @param enabled - for enabling or disabling the query
 * @param queryOptions - filtering and sorting options
 * @returns The page of the sorted and filtered employees from server
 */
export const useEmployees = (
  pageOnClient: number,
  pageSizeOnClient: number,
  enabled: boolean,
  queryOptions: QueryOptionsInterface
) => {
  // Page on server side to be fetched
  const pageOnServer = Math.floor(
    (pageOnClient * pageSizeOnClient) / SERVER_PAGE_SIZE
  );

  // The React-Query hook
  const query = useQuery(
    ['employees', pageOnServer, queryOptions],
    () =>
      fetchEmployees(
        pageOnServer,
        queryOptions.sortModel[0]?.field,
        queryOptions.sortModel[0]?.sort,
        queryOptions.filterModel.quickFilterValues
          ?.join('_')
          ?.split('/')
          ?.join('-')
      ),
    {
      keepPreviousData: true,
      staleTime: 5000,
      enabled,
    }
  );

  /**
   * The data returned by the server needs to be sliced because pagination on client and server sides are different
   */

  // The first row of the slice
  const start = (pageOnClient * pageSizeOnClient) % SERVER_PAGE_SIZE;
  // The last row of the slice
  const end =
    ((pageOnClient + 1) * pageSizeOnClient) % SERVER_PAGE_SIZE ||
    SERVER_PAGE_SIZE;

  const employeesSlice = query.data?.employees?.slice(start, end);
  const dataPaginated = employeesSlice
    ? { ...query.data, employees: employeesSlice }
    : query.data;

  return { ...query, data: dataPaginated };
};

/**
 * Prefetch all the client side reachable pages (first, last, previous and next)
 * @param currentPage
 * @param pageSize
 * @param totalEmployees
 * @param queryOptions
 */
export const usePrefetchEmployees = (
  currentPage: number,
  pageSize: number,
  totalEmployees: number,
  queryOptions: QueryOptionsInterface
) => {
  const pagesToPrefetch: number[] = [];
  const lastPage = Math.ceil(totalEmployees / pageSize) - 1;

  if (currentPage <= 3) {
    // Prefetch page : 0, 1, 2, 3, 4 ... lastPage
    for (let i = 0; i <= 4; i += 1) {
      if (i !== currentPage && i <= lastPage) {
        pagesToPrefetch.push(i);
      }
    }
    if (lastPage > 4) pagesToPrefetch.push(lastPage);
  } else if (currentPage >= lastPage - 3) {
    // Prefetch page : 0 ... lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage
    for (let i = lastPage; i >= lastPage - 4; i -= 1) {
      if (i !== currentPage && i >= 0) {
        pagesToPrefetch.push(i);
      }
    }
    if (lastPage - 4 > 0) pagesToPrefetch.push(0);
  } else {
    // Prefetch : 0 ... previous, next ... lastPage
    pagesToPrefetch.push(currentPage - 1);
    pagesToPrefetch.push(currentPage + 1);
    pagesToPrefetch.push(0);
    pagesToPrefetch.push(lastPage);
  }

  const queryClient = useQueryClient();
  useEffect(() => {
    pagesToPrefetch.forEach((page) => {
      const pageOnServerToFetch = Math.floor(
        (page * pageSize) / SERVER_PAGE_SIZE
      );

      queryClient.prefetchQuery(
        ['employees', pageOnServerToFetch, queryOptions],
        () =>
          fetchEmployees(
            pageOnServerToFetch,
            queryOptions.sortModel[0]?.field,
            queryOptions.sortModel[0]?.sort,
            queryOptions.filterModel.quickFilterValues
              ?.join('_')
              ?.split('/')
              ?.join('-')
          ),
        {
          staleTime: 5000,
        }
      );
    });
    // We don't want pagesToPrefetch to be in the dependency array because it's local scope logic
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, totalEmployees, queryOptions, queryClient]);
};

/**
 * Custom hooks for creating an employee in the database
 * @param onSuccess - callback function called on success
 * @returns a mutation to create data on server
 */
export const useCreateEmployee = (onSuccess?: (id: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: Omit<Employee, 'id'>) => {
      return client.post(`/employees`, employee);
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data?.data?.id);
      queryClient.invalidateQueries(['employees']);
    },
  });
};

/**
 * Custom hooks for deleting an employee in the database
 * @param onSuccess - callback function called on success
 * @returns a mutation to delete data on server
 */
export const useDeleteEmployee = (onSuccess?: (id: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return client.delete(`/employees/${id}`);
    },
    onSuccess: (_data, id) => {
      if (onSuccess) onSuccess(id);
      queryClient.invalidateQueries(['employees']);
    },
  });
};

/**
 * Custom hooks for updating an employee in the database
 * @param onSuccess - callback function called on success
 * @returns a mutation to update data on server
 */
export const useUpdateEmployee = (onSuccess?: (id: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: Employee) => {
      return client.put(`/employees/${employee.id}`, employee);
    },
    onSuccess: (_data, employee) => {
      if (onSuccess) onSuccess(employee.id);
      queryClient.invalidateQueries(['employees']);
    },
  });
};

// TODO: create a GET /employees/:id query to fetch only one employee
export const useEmployee = null;
