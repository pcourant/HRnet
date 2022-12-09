import { useQuery } from '@tanstack/react-query';

import ENDPOINTS from './endpoints';
import client from './lib/axios';

export const useEmployees = () => {
  return useQuery(['employees'], async () => {
    const { data } = await client.get(ENDPOINTS.employees);
    return data;
  });
};

export const useEmployee = null;
