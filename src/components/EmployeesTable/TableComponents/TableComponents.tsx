import { Dispatch, useCallback, useMemo, useState } from 'react';
import { Cancel, Delete, Edit, Save } from '@mui/icons-material';
import {
  Box,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  styled,
} from '@mui/material';
import {
  GridActionsCellItem,
  gridPageCountSelector,
  gridPageSelector,
  gridPageSizeSelector,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';

import { Employee, ActionCRUD } from '@types';
import { COLUMNS } from '../utils';

/**
 * A custom hook that adds CRUD (Create, Read, Update, Delete) functionality to a DataGrid component in a React application using Material-UI library.
 * It uses the React Hooks `useState` and `useCallback` to manage the state and behavior of the DataGrid.
 * @param {Dispatch<ActionCRUD>} dispatch - The dispatch function provided by the context store.
 * @returns {Object} columns - An array of columns with an added actions column
 * @returns {string} deleteId - The id of the row that is to be deleted
 * @returns {GridRowModesModel} rowModesModel - An object that contains the current mode of each row in the DataGrid
 * @returns {Function} setRowModesModel - A function that updates the rowModesModel state
 */
export function useCRUDactionsColumn(dispatchCRUD: Dispatch<ActionCRUD>) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  /**
   * A callback function that updates the row mode to "Edit" when the update button is clicked.
   * @param {GridRowId} id - the id of the row that is being updated
   * @returns {Function} - A function that updates the rowModesModel state
   */
  const handleUpdateClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.Edit },
      });
    },
    [rowModesModel]
  );

  /**
   * A callback function that updates the row mode to "View" and ignore modifications when the cancel button is clicked.
   * @param {GridRowId} id - the id of the row that is being canceled
   * @returns {Function} - A function that updates the rowModesModel state
   */
  const handleCancelClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
    },
    [rowModesModel]
  );

  /**
   * A callback function that updates the row mode to "View" when the save button is clicked.
   * @param {GridRowId} id - the id of the row that is being saved
   * @returns {Function} - A function that updates the rowModesModel state
   */
  const handleSaveClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View },
      });
    },
    [rowModesModel]
  );

  const handleDeleteClick = useCallback(
    (id: GridRowId) => () => {
      // Type narrowing
      if (typeof id === 'number') {
        throw new Error('ID of deleted employee should be of type string');
      }
      dispatchCRUD({
        type: 'CONFIRM_DELETE',
        payload: {
          result: null,
          rowUpdateData: null,
          rowDeleteId: id,
        },
      });
    },
    [dispatchCRUD]
  );

  /**
   * A memoized array of columns that includes an actions column that allows the user to perform CRUD operations.
   * The actions column is added to the COLUMNS array.
   * @returns {Array} - An array of columns with an added actions column
   */
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
          const isInUpdateMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInUpdateMode) {
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
              onClick={handleUpdateClick(id)}
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
      handleUpdateClick,
      handleSaveClick,
      rowModesModel,
    ]
  );

  return { columns, rowModesModel, setRowModesModel };
}

/**
 * A functional component that allows the user to select the number of rows to be displayed per page in a grid.
 * The component has a select field that shows the current number of rows per page and allows the user to change it.
 * @returns {JSX.Element} - The JSX markup for the SelectRowsPerPage component
 */
function SelectRowsPerPage(): JSX.Element {
  const apiRef = useGridApiContext();
  const rowsPerPage = useGridSelector(apiRef, gridPageSizeSelector);

  const handleChange = (event: SelectChangeEvent<number>) => {
    apiRef.current.setPageSize(+event.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <p>Show</p>
      <Select
        id="pageSize"
        name="pageSize"
        value={rowsPerPage}
        onChange={handleChange}
        sx={{
          marginLeft: 1,
          marginRight: 1,
        }}
      >
        <MenuItem value={10}>{10}</MenuItem>
        <MenuItem value={25}>{25}</MenuItem>
        <MenuItem value={50}>{50}</MenuItem>
        <MenuItem value={100}>{100}</MenuItem>
      </Select>
      <p>entries</p>
    </Box>
  );
}

/**
 * A functional component that represents a toolbar for a grid.
 * The component contains the SelectRowsPerPage component and the GridToolbarQuickFilter component.
 * @returns {JSX.Element} - The JSX markup for the Toolbar component
 * @component
 */
export function Toolbar(): JSX.Element {
  return (
    <GridToolbarContainer
      sx={{
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {SelectRowsPerPage()}
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

/**
 * A functional component that represents a custom pagination for a grid.
 * It displays the current page and the total number of pages in the grid using the Pagination component.
 * @returns {JSX.Element} - The JSX markup for the CustomPagination component
 * @component
 */
function CustomPagination(): JSX.Element {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

/**
 * A functional component that represents a message displaying the number of displayed entries in a grid.
 * @param {number} rowCount - The total number of rows
 * @returns {JSX.Element} - The JSX markup for the ShowEntries component
 */
function ShowEntries(rowCount: number): JSX.Element {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const rowsPerPage = useGridSelector(apiRef, gridPageSizeSelector);

  if (rowCount === 0) {
    return <p>Showing 0 entries</p>;
  }

  const firstRow = page * rowsPerPage + 1;

  let lastRow = (page + 1) * rowsPerPage;
  if (lastRow > rowCount) lastRow = rowCount;

  return <p>{`Showing ${firstRow} to ${lastRow} of ${rowCount} entries`}</p>;
}

/**
 * A functional component that represents the footer of a grid.
 * The component uses the ShowEntries and CustomPagination components to display the number of displayed entries and the pagination controls.
 * @param {number} rowCount - The total number of rows
 * @returns {Function} - The JSX markup for the Footer component
 */
export const Footer = (rowCount: number) =>
  function FooterFn() {
    return (
      <Box
        sx={{
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {ShowEntries(rowCount)}
        {CustomPagination()}
      </Box>
    );
  };

/**
 * StyledGridOverlay is a styled component that provides styles for a grid overlay.
 * It is used to display a message when there is no data to show in the grid.
 * @param {Object} theme - The theme object passed by the theme provider.
 * @returns {Object} The styles to be applied to the grid overlay element.
 */
const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  marginTop: '1rem',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

/**
 * Renders an overlay when there are no rows in the grid.
 * The overlay displays a svg icon with a message that there are no rows to display
 */
export function NoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
    </StyledGridOverlay>
  );
}
