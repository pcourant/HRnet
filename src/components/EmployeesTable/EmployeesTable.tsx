/* eslint-disable no-console */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DataGrid,
  GridRowId,
  GridActionsCellItem,
  GridFilterModel,
  GridSortModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  MuiEvent,
  GridEventListener,
} from '@mui/x-data-grid';

import {
  useDeleteEmployee,
  useEmployees,
  usePrefetchEmployees,
  useUpdateEmployee,
} from '@services';

import type { Employee, QueryOptionsInterface } from '@types';

import { Footer, NoRowsOverlay, Toolbar } from './TableComponents';
import { COLUMNS } from './utils';

/**
 * Fetch data from the server and display the dynamic MUI Table of employees
 * @component
 * @returns Table of employees
 */
function EmployeesTable() {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  // * Workaround to fix pagination MUI bug ************************
  const [previousPageSize, setPreviousPageSize] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [fetchEnabled, setFetchEnabled] = useState(true);
  // ***************************************************************

  const [queryOptions, setQueryOptions] = useState<QueryOptionsInterface>({
    sortModel: [{ field: 'firstname', sort: 'asc' }],
    filterModel: { items: [], quickFilterValues: [] },
  });

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    if (filterModel?.quickFilterValues) {
      setQueryOptions((prevValue) => ({
        ...prevValue,
        filterModel: { ...filterModel },
      }));
    }
  }, []);

  const onSortChange = useCallback((sortModel: GridSortModel) => {
    if (sortModel?.length) {
      setQueryOptions((prevValue) => ({
        ...prevValue,
        sortModel: { ...sortModel },
      }));
    }
  }, []);

  const { isLoading, data } = useEmployees(
    page,
    pageSize,
    fetchEnabled,
    queryOptions
  );
  const rowCount = data?.total ? data?.total : 0;
  const rows = data?.employees ? data.employees : [];
  usePrefetchEmployees(page, pageSize, rowCount, queryOptions);

  const deleteEmployeeMutation = useDeleteEmployee();
  const updateEmployeeMutation = useUpdateEmployee();

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    // eslint-disable-next-line no-param-reassign
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    // eslint-disable-next-line no-param-reassign
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    },
    [rowModesModel]
  );

  const handleCancelClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    },
    [rowModesModel]
  );

  const handleSaveClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    },
    [rowModesModel]
  );

  const processRowUpdate = (newRow: Employee) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Do you really want to modify this employee ?')) {
      updateEmployeeMutation.mutate(newRow);
    }
    return newRow;
  };

  const handleDeleteClick = useCallback(
    (id: GridRowId) => () => {
      // Type narrowing
      if (typeof id === 'number') {
        throw new Error('ID of deleted employee should be of type string');
      }
      // eslint-disable-next-line no-alert
      if (window.confirm('Do you really want to delete this employee ?')) {
        deleteEmployeeMutation.mutate(id);
      }
    },
    [deleteEmployeeMutation]
  );

  // * Add a action column for deleting and editing
  const columns = useMemo(
    () => [
      ...COLUMNS,
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        cellClassName: 'actions',
        // width: 10,
        width: 100,
        minWidth: 30,
        getActions: (params: Employee) => {
          const { id } = params;
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key={`${id}_save`}
                icon={<SaveIcon />}
                label="Save"
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key={`${id}_cancel`}
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              key={`${id}_save`}
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              key={`${id}_cancel`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [
      handleCancelClick,
      handleDeleteClick,
      handleEditClick,
      handleSaveClick,
      rowModesModel,
    ]
  );

  const handlePageSizeChange = (newPageSize: number) => {
    // * Workaround to fix pagination MUI bug ****
    setFetchEnabled(false);
    setPreviousPageSize(pageSize);
    setPreviousPage(page);
    // *******************************************

    setPageSize(newPageSize);
  };

  // * Workaround to to fix pagination MUI bug ****************
  useEffect(() => {
    const previousRow = previousPage * previousPageSize;
    const fixedPage = Math.floor(previousRow / pageSize);
    setFetchEnabled(true);
    setPage(fixedPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);
  // **********************************************************

  return (
    <Box sx={{ width: '90%', maxWidth: 1280 }}>
      <DataGrid
        rows={rows}
        rowCount={rowCount}
        loading={isLoading}
        rowsPerPageOptions={[10, 25, 50, 100]}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        onPageChange={(newPage: number) => setPage(newPage)}
        onPageSizeChange={handlePageSizeChange}
        columns={columns}
        autoHeight
        getRowHeight={() => 'auto'}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableColumnMenu
        components={{
          LoadingOverlay: LinearProgress,
          Toolbar,
          NoRowsOverlay,
          Footer: Footer(rowCount),
        }}
        sortingMode="server"
        filterMode="server"
        onSortModelChange={onSortChange}
        onFilterModelChange={onFilterChange}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
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
