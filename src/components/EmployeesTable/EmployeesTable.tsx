import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Box, Button, LinearProgress } from '@mui/material';
import { Edit, Save, Cancel, Delete } from '@mui/icons-material';
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
import { Modal } from 'react-modal-simple-customizable';

import type { Employee, QueryOptionsInterface } from '@types';
import {
  useDeleteEmployee,
  useEmployees,
  usePrefetchEmployees,
  useUpdateEmployee,
} from '@services';
import { Footer, NoRowsOverlay, Toolbar } from './TableComponents';
import { COLUMNS } from './utils';

import styles from './Modal.module.css';

/**
 * Fetch data from the server and display the dynamic MUI Table of employees
 * @component
 * @returns Table of employees
 */
function EmployeesTable() {
  // * Pagination states ***************************************************
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  // ***********************************************************************

  // * Edit and delete states ***************************************
  const [editRowData, setEditRowData] = useState<{
    oldRow: Employee;
    newRow: Employee;
    resolve: (value: Employee | PromiseLike<Employee>) => void;
    reject: (reason?: unknown) => void;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<GridRowId>('');
  // ****************************************************************

  // * Modal states *************************************************
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalResult, setShowModalResult] = useState(false);
  const [modalResult, setModalResult] = useState('');
  const [error, setError] = useState('');
  // ****************************************************************

  // * States for workaround to fix pagination MUI bug *************
  const [previousPageSize, setPreviousPageSize] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [fetchEnabled, setFetchEnabled] = useState(true);
  // ***************************************************************

  // * Fetching data ********************************************************
  const [queryOptions, setQueryOptions] = useState<QueryOptionsInterface>({
    sortModel: [{ field: 'firstname', sort: 'asc' }],
    filterModel: { items: [], quickFilterValues: [] },
  });

  const { isLoading, data } = useEmployees(
    page,
    pageSize,
    fetchEnabled,
    queryOptions
  );
  const rowCount = data?.total ? data?.total : 0;
  const rows = data?.employees ? data.employees : [];
  usePrefetchEmployees(page, pageSize, rowCount, queryOptions);
  // *************************************************************************

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

  // * Deleting data ***********************************************************
  const onSuccessDeleteHandler = () => {
    setShowModalDelete(false);
    setModalResult('delete');
    setShowModalResult(true);
  };
  const onErrorDeleteHandler = (err: unknown) => {
    setShowModalDelete(false);
    setModalResult('delete');
    setShowModalResult(true);
    if (axios.isAxiosError(err)) {
      if (err?.response?.data?.error) setError(err?.response?.data?.error);
      else if (err?.message) setError(err?.message);
    } else if (err instanceof Error) {
      setError(err?.message);
    } else {
      setError('Unknown error, look in the devTool console');
    }
    editRowData?.reject(editRowData?.oldRow);
    setEditRowData(null);
  };
  const deleteEmployeeMutation = useDeleteEmployee(
    onSuccessDeleteHandler,
    onErrorDeleteHandler
  );
  const onDeleteConfirmHandler = () => {
    deleteEmployeeMutation.mutate(deleteId.toString());
  };

  const handleDeleteClick = useCallback(
    (id: GridRowId) => () => {
      // Type narrowing
      if (typeof id === 'number') {
        throw new Error('ID of deleted employee should be of type string');
      }
      setDeleteId(id);
      setShowModalDelete(true);
    },
    []
  );
  // **************************************************************************

  // * Editing data ***********************************************************
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
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View },
      });
    },
    [rowModesModel]
  );

  function computeConfirmationMessages(
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
  const processRowUpdate = useCallback(
    (newRow: Employee, oldRow: Employee) =>
      new Promise<Employee>((resolve, reject) => {
        const confirmationMessages = computeConfirmationMessages(
          newRow,
          oldRow
        );
        if (confirmationMessages.length === 0) {
          resolve(oldRow); // Nothing was changed
        } else {
          // Save the editing data to resolve or reject the promise later
          setEditRowData({ resolve, reject, newRow, oldRow });
          setShowModalEdit(true);
        }
      }),
    []
  );
  const onCancelEditHandler = () => {
    editRowData?.reject(editRowData?.oldRow);
    setEditRowData(null);
    setShowModalEdit(false);
  };
  const onSuccessEditHandler = (employee: Employee) => {
    setModalResult('edit');
    setShowModalResult(true);
    setShowModalEdit(false);
    editRowData?.resolve(employee);
    setEditRowData(null);
  };
  const onErrorEditHandler = (err: unknown) => {
    setModalResult('edit');
    setShowModalResult(true);
    setShowModalEdit(false);
    if (axios.isAxiosError(err)) {
      if (err?.response?.data?.error) setError(err?.response?.data?.error);
      else if (err?.message) setError(err?.message);
    } else if (err instanceof Error) {
      setError(err?.message);
    } else {
      setError('Unknown error, look in the devTool console');
    }
    editRowData?.reject(editRowData?.oldRow);
    setEditRowData(null);
  };
  const updateEmployeeMutation = useUpdateEmployee(
    onSuccessEditHandler,
    onErrorEditHandler
  );
  const onEditConfirmHandler = async () => {
    if (editRowData) {
      const { newRow, oldRow } = editRowData;

      updateEmployeeMutation.mutate({
        id: oldRow?.id,
        firstName: newRow?.firstName,
        lastName: newRow?.lastName,
        dateOfBirth: oldRow?.dateOfBirth,
        startDate: oldRow?.startDate,
        street: newRow?.street,
        city: newRow?.city,
        zipcode: newRow?.zipcode,
        state: newRow?.state,
        department: newRow?.department,
      });
    }
  };
  // **************************************************************************

  // * Add a action column for deleting and editing ***************************
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
                icon={<Save />}
                label="Save"
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key={`${id}_cancel`}
                icon={<Cancel />}
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
              icon={<Edit />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              key={`${id}_cancel`}
              icon={<Delete />}
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
  // **************************************************************************

  // ! Workaround to to fix pagination MUI bug ********************************
  const handlePageSizeChange = (newPageSize: number) => {
    setFetchEnabled(false);
    setPreviousPageSize(pageSize);
    setPreviousPage(page);

    setPageSize(newPageSize);
  };

  useEffect(() => {
    const previousRow = previousPage * previousPageSize;
    const newPageFixed = Math.floor(previousRow / pageSize);
    setFetchEnabled(true);
    setPage(newPageFixed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);
  // ! ************************************************************************

  return (
    <>
      {/* DATA GRID ************************************************************ */}
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
          onProcessRowUpdateError={() => {}}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{
            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
              py: '8px',
            },
            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
              py: '15px',
            },
            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
              py: '22px',
            },
          }}
        />
      </Box>
      {/* ************************************************************************** */}
      {/* MODALS ******************************************************************* */}
      <Modal
        show={showModalEdit}
        onClose={onCancelEditHandler}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalBody}>
          <h2>Are you sure?</h2>
          <h3>{`Pressing 'Yes' will change:`}</h3>
          <ul className={styles.listOfChanges}>
            {computeConfirmationMessages(
              editRowData?.newRow,
              editRowData?.oldRow
            )?.map((val) => (
              <li key={val}>
                <p>{val}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.modalFooter}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="button"
            onClick={onEditConfirmHandler}
          >
            YES
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="button"
            onClick={onCancelEditHandler}
          >
            CANCEL
          </Button>
        </div>
      </Modal>
      <Modal
        show={showModalDelete}
        onClose={() => setShowModalDelete(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalBody}>
          <h2>Are you sure?</h2>
          <p>{`Pressing 'Yes' will delete the employee from the DB server!`}</p>
        </div>
        <div className={styles.modalFooter}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="button"
            onClick={onDeleteConfirmHandler}
          >
            YES
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="button"
            onClick={() => setShowModalDelete(false)}
          >
            CANCEL
          </Button>
        </div>
      </Modal>
      <Modal
        show={showModalResult}
        onClose={() => setShowModalResult(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalBody}>
          {updateEmployeeMutation.isError && (
            <>
              <p className={styles.firstLine}>Error!</p>
              <p className={styles.lastLine}>{error}</p>
            </>
          )}
          {modalResult === 'edit' && updateEmployeeMutation.isSuccess && (
            <p className={styles.firstLine}>Employee successfully updated!</p>
          )}
          {modalResult === 'delete' && deleteEmployeeMutation.isSuccess && (
            <p className={styles.firstLine}>Employee successfully deleted!</p>
          )}
        </div>
        <div className={styles.modalFooter}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="button"
            onClick={() => setShowModalResult(false)}
          >
            CLOSE
          </Button>
        </div>
      </Modal>
      {/* ************************************************************************** */}
    </>
  );
}

export default EmployeesTable;
