import axios from 'axios';

/**
 * Create an Axios instance
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
