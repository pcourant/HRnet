import {
  randomAddress,
  randomArrayItem,
  randomCity,
  randomDate,
  randomInt,
} from '@mui/x-data-grid-generator';
import type {
  Department,
  Employee,
  StateAbbreviation,
} from 'src/services/types';
import { States } from 'src/services/types';
import { departments } from './departments';

const EMPLOYEES: Employee[] = [];

for (let i = 1; i < 201; i += 1) {
  EMPLOYEES.push({
    id: i,
    firstName: `FirstName_${i}`,
    lastName: `LastName_${i}`,
    startDate: randomDate(new Date(2000, 1, 1), new Date(Date.now())),
    department: randomArrayItem<Department>(departments),
    dateOfBirth: randomDate(new Date(1945, 5, 8), new Date(1999, 1, 31)),
    street: randomAddress(),
    city: randomCity(),
    state: randomArrayItem<StateAbbreviation>(
      Object.keys(States) as StateAbbreviation[]
    ),
    zipcode: randomInt(10000, 99999),
  });
}

export default EMPLOYEES;
