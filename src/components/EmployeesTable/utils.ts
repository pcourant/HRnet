import {
  GridColTypeDef,
  GridColumns,
  GridComparatorFn,
  GridValueGetterParams,
} from '@mui/x-data-grid';

import { Employee } from '@types';

/**
 * @param {string} date1 - The first date to compare
 * @param {string} date2 - The second date to compare
 * @return {number} Returns negative number if date1 is less than date2, positive number if date1 is greater than date2, and 0 if they are equal.
 * @example dayInMonthComparator("20/01/2022", "20/01/2000")
 */
export const dayInMonthComparator: GridComparatorFn<string> = (
  date1,
  date2
) => {
  const date1Parts = date1.split('/');
  const date2Parts = date2.split('/');
  const date1Object = new Date(
    +date1Parts[2],
    +date1Parts[1] - 1,
    +date1Parts[0]
  );
  const date2Object = new Date(
    +date2Parts[2],
    +date2Parts[1] - 1,
    +date2Parts[0]
  );

  return date2Object.getTime() - date1Object.getTime();
};

/**
 * The dateType object defines the properties for a grid column that represents a date.
 * @property {'string'} type - The type of data in the column
 * @property {number} width - The width of the column
 * @property {function} valueGetter - A function that takes in a GridValueGetterParams object and returns the formatted date string for the column cell. If the value is not present, it returns 'N/A'
 * @property {function} sortComparator - A function that takes in two values and compares them based on their day of the month.
 */
export const dateType: GridColTypeDef = {
  type: 'string',
  width: 110,
  valueGetter: (params: GridValueGetterParams<string>) => {
    if (!params.value) {
      return 'N/A';
    }
    return new Date(params.value).toLocaleDateString();
  },
  sortComparator: dayInMonthComparator,
};

/**
 * @typedef {Object} GridColumns: an array of columns
 * @property {string} field - The field name of the column, used to identify the column in the grid data
 * @property {string} headerName - The display name of the column, used as the column header
 * @property {string} description - The description of the column, used to provide more information about the column
 * @property {boolean} [editable=false] - Indicates if the column cells are editable
 * @property {boolean} [sortable=true] - Indicates if the column is sortable
 * @property {number} [flex=undefined] - The flex value of the column, used to proportionally distribute * the available width among columns
 * @property {number} [minWidth=undefined] - The minimum width of the column
 * @property {number} [width=undefined] - The width of the column
 */
export const COLUMNS: GridColumns = [
  {
    field: 'firstName',
    headerName: 'First name',
    description: 'First name',
    editable: true,
    flex: 50,
    minWidth: 100,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    description: 'Last name',
    editable: true,
    flex: 50,
    minWidth: 100,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    description: 'Start Date',
    ...dateType,
  },
  {
    field: 'department',
    headerName: 'Department',
    description: 'Department',
    editable: true,
    flex: 50,
    minWidth: 100,
  },
  {
    field: 'dateOfBirth',
    headerName: 'Date of Birth',
    description: 'Date of Birth',
    ...dateType,
  },
  {
    field: 'street',
    headerName: 'Street',
    description: 'Street',
    editable: true,
    sortable: false,
    minWidth: 100,
    flex: 50,
  },
  {
    field: 'city',
    headerName: 'City',
    description: 'City',
    editable: true,
    minWidth: 100,
    flex: 50,
  },
  {
    field: 'state',
    headerName: 'State',
    description: 'State',
    editable: true,
    width: 60,
  },
  {
    type: 'number',
    field: 'zipcode',
    headerName: 'Zip Code',
    description: 'Zip Code',
    editable: true,
    width: 80,
  },
];

/**
 * Computes the confirmation messages of the changes made to an employee.
 *
 * @param {Employee | undefined} newRow - The new employee data.
 * @param {Employee | undefined} oldRow - The original employee data.
 * @returns {string[]} An array of strings representing the confirmation messages.
 */
export function computeConfirmationMessages(
  newRow: Employee | undefined,
  oldRow: Employee | undefined
) {
  const confirmationMessages = [];
  if (newRow?.firstName !== oldRow?.firstName) {
    confirmationMessages.push(
      `- First name from '${oldRow?.firstName}' to '${newRow?.firstName}'`
    );
  }
  if (newRow?.lastName !== oldRow?.lastName) {
    confirmationMessages.push(
      `- Last name from '${oldRow?.lastName}' to '${newRow?.lastName}'`
    );
  }
  if (newRow?.department !== oldRow?.department) {
    confirmationMessages.push(
      `- Department from '${oldRow?.department}' to '${newRow?.department}'`
    );
  }
  if (newRow?.street !== oldRow?.street) {
    confirmationMessages.push(
      `- Street from '${oldRow?.street}' to '${newRow?.street}'`
    );
  }
  if (newRow?.city !== oldRow?.city) {
    confirmationMessages.push(
      `- City from '${oldRow?.city}' to '${newRow?.city}'`
    );
  }
  if (newRow?.state !== oldRow?.state) {
    confirmationMessages.push(
      `- State from '${oldRow?.state}' to '${newRow?.state}'`
    );
  }
  if (newRow?.zipcode !== oldRow?.zipcode) {
    confirmationMessages.push(
      `- Zip Code from '${oldRow?.zipcode}' to '${newRow?.zipcode}'`
    );
  }
  return confirmationMessages;
}
