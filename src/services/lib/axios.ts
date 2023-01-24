import axios from 'axios';

/**
 * Create an axios client with a specific configuration
 * @type {AxiosInstance}
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
