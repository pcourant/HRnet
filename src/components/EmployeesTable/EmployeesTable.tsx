/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridColumns,
  GridColTypeDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridValueGetterParams,
  GridComparatorFn,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

import EMPLOYEES from 'src/data/employees';
import type { Employee } from 'src/services/types';
import { useEmployees } from 'src/services/services';

// import styles from './EmployeesTable.module.css';

const dayInMonthComparator: GridComparatorFn<string> = (date1, date2) => {
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

// Custom column types
const dateType: GridColTypeDef = {
  type: 'string',
  width: 110,
  valueGetter: (params: GridValueGetterParams<Date>) => {
    if (!params.value) {
      return 'N/A';
    }
    return params.value.toLocaleDateString();
  },
  sortComparator: dayInMonthComparator,
};

const COLUMNS: GridColDef[] = [
  {
    field: 'firstName',
    headerName: 'First name',
    description: 'First name',
    flex: 50,
    minWidth: 100,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    description: 'Last name',
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
    sortable: false,
    minWidth: 100,
    flex: 50,
  },
  {
    field: 'city',
    headerName: 'City',
    description: 'City',
    minWidth: 100,
    flex: 50,
  },
  { field: 'state', headerName: 'State', description: 'State', width: 60 },
  {
    type: 'number',
    field: 'zipcode',
    headerName: 'Zip Code',
    description: 'Zip Code',
    width: 80,
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

function CustomNoRowsOverlay() {
  return (
    // <div className={styles.noDataOverlay}>
    <div>
      <Box sx={{ mt: 1 }}>No data available in table</Box>
    </div>
  );
}

function CustomNoResultsOverlay() {
  return (
    // <div className={styles.noDataOverlay}>
    <div>
      <Box sx={{ mt: 1 }}>No matching records found</Box>
    </div>
  );
}

function EmployeesTable() {
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Employee[]>(EMPLOYEES);

  const { isLoading, isError, isSuccess, error, data } = useEmployees();

  console.log(data);

  const deleteEmployee = useCallback(
    (id: GridRowId) => () => {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    },
    []
  );

  const columns = useMemo<GridColumns<Employee>>(
    () => [
      ...COLUMNS,
      {
        field: 'actions',
        type: 'actions',
        width: 10,
        minWidth: 30,
        getActions: (params) => [
          <GridActionsCellItem
            key={0}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteEmployee(params.id)}
          />,
        ],
      },
    ],
    [deleteEmployee]
  );

  return (
    <Box sx={{ height: 600, width: '90%', maxWidth: 1280 }}>
      <DataGrid
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        autoHeight
        getRowHeight={() => 'auto'}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableColumnMenu
        columns={columns}
        rows={rows}
        // rows={[]}
        components={{
          Toolbar: CustomToolbar,
          NoRowsOverlay: CustomNoRowsOverlay,
          NoResultsOverlay: CustomNoResultsOverlay,
        }}
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
          },
        }}
      />
    </Box>
  );
}

export default EmployeesTable;
