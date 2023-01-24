import { createServer, Factory, Model, Response, Server } from 'miragejs';
import { faker } from '@faker-js/faker';
import { GridSortDirection } from '@mui/x-data-grid';

import type { Employee, StateAbbreviation } from '@types';
import { DEPARTMENTS, STATES } from '@types';

// environment = production | development | test
const environment = import.meta.env.MODE;
const namespace = import.meta.env.VITE_API_URL;
// DATABASE_LENGTH : Number of employees in the DB
const DATABASE_LENGTH = +import.meta.env.VITE_DATABASE_LENGTH;
const SERVER_PAGE_SIZE = +import.meta.env.VITE_PAGE_LENGTH;

/**
 * @function
 * @name MockServer
 * @returns {Server} - A server instance with employees model and factory.
 * @description
 * The function creates a server instance with an employees model and factory.
 * The server is seeded with a list of employees with a certain length.
 * The server has routes that handle pagination, filtering, and sorting of the employees data.
 */
function MockServer(): Server {
  return createServer({
    environment,

    models: {
      employee: Model.extend<Partial<Employee>>({}),
    },

    factories: {
      employee: Factory.extend<Partial<Employee>>({
        firstName() {
          const sex = faker.name.sexType();
          return faker.name.firstName(sex);
        },
        lastName() {
          return faker.name.lastName();
        },
        startDate() {
          return faker.date.past(10);
        },
        department() {
          return faker.helpers.arrayElement(Object.values(DEPARTMENTS));
        },
        dateOfBirth() {
          return faker.date.birthdate();
        },
        street() {
          return faker.address.streetAddress();
        },
        city() {
          return faker.address.cityName();
        },
        state() {
          return faker.helpers.arrayElement(
            Object.keys(STATES) as StateAbbreviation[]
          );
        },
        zipcode() {
          return +faker.random.numeric(5);
        },
      }),
    },

    seeds(server) {
      server.createList('employee', DATABASE_LENGTH);
    },

    routes() {
      this.namespace = namespace;

      // TODO: filtering : /employees?filters=dupont&16_05_2002&Sales
      // TODO: sorting : /employees?sort_by=+firstname
      // TODO: pagination : /employees?page=3
      /**
       * READ employees
       */
      this.get(
        '/employees/page/:page/sort/:sortingField/:sortingOrder/filters/:filters',
        (schema, request) => {
          // * Getting params from URL
          const { params } = request;
          const page = params.page || 0;

          const employees = schema.all('employee');
          const sortingField: keyof Employee =
            params.sortingField as keyof Employee;
          const sortingOrder: GridSortDirection =
            params.sortingOrder as GridSortDirection;
          const filtersParam: string = params.filters;

          // * Filtering the DB
          let employeesFiltered;
          if (filtersParam && filtersParam !== 'noFilter') {
            const filtersArray = filtersParam.split('_');
            if (filtersArray && filtersArray.length) {
              employeesFiltered = employees.filter(
                (employee: Partial<Employee>) => {
                  let isAllFiltersIncluded: boolean | undefined = true;
                  let isFilterIncludedAnywhere: boolean | undefined = false;
                  filtersArray.forEach((filter) => {
                    isFilterIncludedAnywhere =
                      employee.firstName?.includes(filter) ||
                      employee.lastName?.includes(filter) ||
                      employee.department?.includes(filter) ||
                      employee.street?.includes(filter) ||
                      employee.city?.includes(filter) ||
                      employee.state?.includes(filter) ||
                      employee.startDate
                        ?.toLocaleDateString()
                        ?.split('/')
                        ?.join('-')
                        ?.includes(filter) ||
                      employee.dateOfBirth
                        ?.toLocaleDateString()
                        ?.split('/')
                        ?.join('-')
                        ?.includes(filter) ||
                      employee.zipcode?.toString()?.includes(filter);

                    isAllFiltersIncluded =
                      isAllFiltersIncluded && isFilterIncludedAnywhere;
                  });

                  return isAllFiltersIncluded;
                }
              );
            }
          }

          if (!employeesFiltered) employeesFiltered = employees;

          // * Sorting the filtered data
          let employeesSorted;
          if (sortingField && sortingOrder) {
            employeesSorted = employeesFiltered.sort(
              (a: Partial<Employee>, b: Partial<Employee>) => {
                let sortingResult = 0;

                const fieldA: Employee[keyof Employee] | undefined =
                  a[sortingField];
                const fieldB: Employee[keyof Employee] | undefined =
                  b[sortingField];

                if (!fieldA || !fieldB) return sortingResult;

                if (typeof fieldA === 'string' && typeof fieldB === 'string') {
                  sortingResult = fieldA.localeCompare(fieldB);
                } else {
                  sortingResult = (fieldA as number) - (fieldB as number);
                }

                if (sortingOrder === 'desc') return -sortingResult;
                return sortingResult;
              }
            );
          }

          if (!employeesSorted) employeesSorted = employeesFiltered;

          // * Pagination
          const slice = employeesSorted.slice(
            +page * SERVER_PAGE_SIZE,
            (+page + 1) * SERVER_PAGE_SIZE
          );

          return {
            total: employeesSorted.length,
            employees: slice.models,
          };
        }
      );

      /**
       * CREATE employee
       */
      this.post('/employees', (schema, request) => {
        const attrs: Omit<Employee, 'id'> = JSON.parse(request.requestBody);
        const employee = schema.findBy('employee', {
          firstName: attrs.firstName,
          lastName: attrs.lastName,
        });
        if (employee) {
          return new Response(
            409,
            {},
            {
              error: 'Employee already exists',
            }
          );
        }
        const id = faker.datatype.uuid();
        schema.create('employee', { id, ...attrs });
        return { id };
      });

      /**
       * DELETE employee
       */
      this.delete('/employees/:id', (schema, request) => {
        const { id } = request.params;
        const employee = schema.findBy('employee', { id });
        if (!employee) {
          return new Response(
            500,
            {},
            {
              error: 'Internal Server Error: Employee does not exist',
            }
          );
        }
        employee.destroy();
        return { id };
      });

      /**
       * UPDATE employee
       */
      this.put('/employees/:id', (schema, request) => {
        const { id } = request.params;
        const attrs: Employee = JSON.parse(request.requestBody);
        const employee = schema.findBy('employee', { id });
        if (!employee) {
          return new Response(
            500,
            {},
            {
              error: 'Internal Server Error: Employee does not exist',
            }
          );
        }
        employee.update(attrs);
        return { id };
      });
    },
  });
}

export default MockServer;
