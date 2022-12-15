import {
  GridColTypeDef,
  GridColumns,
  GridComparatorFn,
  GridValueGetterParams,
} from '@mui/x-data-grid';

/**
 * Custom Date comparator
 * @param date1 - first date in format dd/mm/yyyy
 * @param date2 - first date in format dd/mm/yyyy
 * @returns >0 if date1 before date2, <0 if date1 after date2, 0 if date1  equals date 2
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
 * Custom type for Date columns
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
 * Columns of the table
 */
// export const COLUMNS: GridColDef[] = [
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
    editable: true,
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
    editable: true,
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
  { field: 'state', headerName: 'State', description: 'State', width: 60 },
  {
    type: 'number',
    field: 'zipcode',
    headerName: 'Zip Code',
    description: 'Zip Code',
    editable: true,
    width: 80,
  },
];
