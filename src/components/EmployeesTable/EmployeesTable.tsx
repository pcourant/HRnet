import { useCallback, useEffect, useState } from 'react';
import { Box, Button, LinearProgress } from '@mui/material';
import {
  DataGrid,
  GridEventListener,
  GridRowParams,
  MuiEvent,
} from '@mui/x-data-grid';
import { Modal } from 'react-modal-simple-customizable';

import type { Employee } from '@types';
import {
  useDeleteEmployee,
  useEmployees,
  usePrefetchEmployees,
  useUpdateEmployee,
} from '@services';
import { useQueryOptions, useReducerCRUD } from '@hooks';
import computeErrorFromQuery from 'src/utils';
import {
  Footer,
  NoRowsOverlay,
  Toolbar,
  useCRUDactionsColumn,
} from './TableComponents';

import styles from './Modal.module.css';
import { computeConfirmationMessages } from './utils';

/**
 * Fetch data from the server and display the dynamic MUI Table of employees
 * @component
 * @returns Table of employees
 */
function EmployeesTable() {
  // * Pagination states ****************************************************
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  // ************************************************************************

  // ! States for workaround to fix pagination MUI bug **********************
  const [previousPageSize, setPreviousPageSize] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [fetchEnabled, setFetchEnabled] = useState(true);
  // ! ************************************************************************

  // * CRUD states **********************************************************
  const { stateCRUD, dispatchCRUD } = useReducerCRUD();
  const {
    showModalUpdate,
    showModalDelete,
    showModalResult,
    result,
    rowUpdateData,
    rowDeleteId,
  } = stateCRUD;
  // *************************************************************************

  // * Add CRUD actions columns to the DataGrid ******************************
  const { columns, rowModesModel, setRowModesModel } =
    useCRUDactionsColumn(dispatchCRUD);
  // *************************************************************************

  // * Fetching and prefetching data *****************************************
  const { queryOptions, onFilterChange, onSortChange } = useQueryOptions({
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

  // * Deleting Handler *********************************************************
  const onSuccessDeleteHandler = useCallback(
    () =>
      dispatchCRUD({
        type: 'SHOW_RESULT',
        payload: {
          result: { type: 'DELETE', error: undefined },
          rowUpdateData: null,
          rowDeleteId: null,
        },
      }),
    [dispatchCRUD]
  );
  const onErrorDeleteHandler = useCallback(
    (err: unknown) => {
      dispatchCRUD({
        type: 'SHOW_RESULT',
        payload: {
          result: { type: 'DELETE', error: computeErrorFromQuery(err) },
          rowUpdateData: null,
          rowDeleteId: null,
        },
      });
    },
    [dispatchCRUD]
  );
  const deleteEmployeeMutation = useDeleteEmployee(
    onSuccessDeleteHandler,
    onErrorDeleteHandler
  );
  const onDeleteConfirmHandler = () => {
    if (rowDeleteId) deleteEmployeeMutation.mutate(rowDeleteId.toString());
  };
  // *************************************************************************

  // * Updating handlers *****************************************************
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onRowEditStartHandler = useCallback(
    (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
      // eslint-disable-next-line no-param-reassign
      event.defaultMuiPrevented = true;
    },
    []
  );
  const onRowEditStopHandler: GridEventListener<'rowEditStop'> =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCallback((params, event) => {
      // eslint-disable-next-line no-param-reassign
      event.defaultMuiPrevented = true;
    }, []);

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
          dispatchCRUD({
            type: 'CONFIRM_UPDATE',
            payload: {
              result: null,
              rowUpdateData: { resolve, reject, newRow, oldRow },
              rowDeleteId: null,
            },
          });
        }
      }),
    [dispatchCRUD]
  );

  const onCancelUpdateHandler = () => {
    if (rowUpdateData?.reject) rowUpdateData?.reject(rowUpdateData?.oldRow);
    dispatchCRUD({
      type: 'CANCEL',
      payload: {
        result: null,
        rowUpdateData: null,
        rowDeleteId: null,
      },
    });
  };

  const onSuccessUpdateHandler = (employee: Employee) => {
    if (rowUpdateData?.resolve) rowUpdateData?.resolve(employee);
    dispatchCRUD({
      type: 'SHOW_RESULT',
      payload: {
        result: { type: 'UPDATE', error: undefined },
        rowUpdateData: null,
        rowDeleteId: null,
      },
    });
  };

  const onErrorUpdateHandler = (err: unknown) => {
    if (rowUpdateData?.reject) rowUpdateData?.reject(rowUpdateData?.oldRow);
    dispatchCRUD({
      type: 'SHOW_RESULT',
      payload: {
        result: { type: 'UPDATE', error: computeErrorFromQuery(err) },
        rowUpdateData: null,
        rowDeleteId: null,
      },
    });
  };
  const updateEmployeeMutation = useUpdateEmployee(
    onSuccessUpdateHandler,
    onErrorUpdateHandler
  );
  const onUpdateConfirmHandler = () => {
    if (rowUpdateData) {
      const { newRow, oldRow } = rowUpdateData;

      if (newRow && oldRow)
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
          onRowEditStart={onRowEditStartHandler}
          onRowEditStop={onRowEditStopHandler}
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
        show={showModalUpdate}
        onClose={onCancelUpdateHandler}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalBody}>
          <h2>Are you sure?</h2>
          <h3>{`Pressing 'Yes' will change:`}</h3>
          <ul className={styles.listOfChanges}>
            {computeConfirmationMessages(
              rowUpdateData?.newRow,
              rowUpdateData?.oldRow
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
            onClick={onUpdateConfirmHandler}
          >
            YES
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="button"
            onClick={onCancelUpdateHandler}
          >
            CANCEL
          </Button>
        </div>
      </Modal>
      <Modal
        show={showModalDelete}
        onClose={() => dispatchCRUD({ type: 'CANCEL' })}
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
            onClick={() => dispatchCRUD({ type: 'CANCEL' })}
          >
            CANCEL
          </Button>
        </div>
      </Modal>
      <Modal
        show={showModalResult}
        onClose={() => dispatchCRUD({ type: 'INIT' })}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalBody}>
          {updateEmployeeMutation.isError && (
            <>
              <p className={styles.firstLine}>Error!</p>
              <p className={styles.lastLine}>{result?.error}</p>
            </>
          )}
          {result?.type === 'UPDATE' && updateEmployeeMutation.isSuccess && (
            <p className={styles.firstLine}>Employee successfully updated!</p>
          )}
          {result?.type === 'DELETE' && deleteEmployeeMutation.isSuccess && (
            <p className={styles.firstLine}>Employee successfully deleted!</p>
          )}
        </div>
        <div className={styles.modalFooter}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="button"
            onClick={() => dispatchCRUD({ type: 'INIT' })}
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
