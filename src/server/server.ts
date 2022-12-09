import { createServer } from 'miragejs';

export default function server() {
  createServer({
    routes() {
      this.get('/api/employees', () => ({
        employees: [],
      }));
    },
  });
}
