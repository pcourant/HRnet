import axios from 'axios';

/**
 * @function
 * @param {unknown} err - the error object to process
 * @returns {string} - the error message
 * @description - this function take the unknown error object and try to extract the error message from it.
 * It checks for the error object if it's an axios error or a javascript error, and return the error message accordingly.
 * if it doesn't find any error message it will return a default message 'Unknown error, look in the devTool console'
 */
function computeErrorFromQuery(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err?.response?.data?.error) return err?.response?.data?.error;
    if (err?.message) return err?.message;
  } else if (err instanceof Error) {
    return err?.message;
  }
  return 'Unknown error, look in the devTool console';
}

export default computeErrorFromQuery;
