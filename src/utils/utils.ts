import axios from 'axios';

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
