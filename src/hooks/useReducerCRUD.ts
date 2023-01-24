import { useReducer } from 'react';

import { ActionCRUD, StateCRUD } from '@types';

/**
 * A hook to handle CRUD (create, read, update, delete) actions and corresponding modal displays.
 *
 * Returns an object with the current CRUD state, and a dispatch function to update it.
 * @returns {{stateCRUD: StateCRUD, dispatchCRUD: (state: StateCRUD, action: ActionCRUD) => StateCRUD}}
 *
 * @typedef {Object} StateCRUD
 * @property {boolean} showModalCreate - Determines whether the create modal should be displayed
 * @property {boolean} showModalUpdate - Determines whether the update modal should be displayed
 * @property {boolean} showModalDelete - Determines whether the delete modal should be displayed
 * @property {boolean} showModalResult - Determines whether the result modal should be displayed
 * @property {Object} result - The result of a CRUD action, containing type and error properties.
 * @property {Object} rowUpdateData - The data to be updated, including old and new rows, and resolve and  reject functions.
 * @property {string} rowDeleteId - The id of the row to be deleted.
 *
 * @typedef {Object} ActionCRUD
 * @property {string} type - The type of CRUD action to be performed, can be one of: 'INIT', 'CANCEL', 'CONFIRM_CREATE', 'CONFIRM_UPDATE', 'CONFIRM_DELETE', 'SHOW_RESULT'.
 * @property {Object} payload - Additional data to be passed along with the action, such as rowUpdateData or * rowDeleteId.
 */
const useReducerCRUD = () => {
  const initialState: StateCRUD = {
    showModalCreate: false,
    showModalUpdate: false,
    showModalDelete: false,
    showModalResult: false,
    result: null,
    rowUpdateData: null,
    rowDeleteId: null,
  };

  const reducerCRUD = (state: StateCRUD, action: ActionCRUD) => {
    switch (action.type) {
      case 'INIT':
        return {
          ...state,
          showModalCreate: false,
          showModalUpdate: false,
          showModalDelete: false,
          showModalResult: false,
          result: null,
          rowUpdateData: null,
          rowDeleteId: null,
        };
      case 'CANCEL':
        return {
          ...state,
          showModalCreate: false,
          showModalUpdate: false,
          showModalDelete: false,
          showModalResult: false,
          result: null,
          rowUpdateData: null,
          rowDeleteId: null,
        };
      case 'CONFIRM_CREATE':
        return {
          ...state,
          showModalCreate: true,
          showModalUpdate: false,
          showModalDelete: false,
          showModalResult: false,
          result: null,
          rowUpdateData: null,
          rowDeleteId: null,
        };
      case 'CONFIRM_UPDATE':
        return {
          ...state,
          showModalCreate: false,
          showModalUpdate: true,
          showModalDelete: false,
          showModalResult: false,
          result: null,
          rowUpdateData: {
            oldRow: action.payload?.rowUpdateData?.oldRow,
            newRow: action.payload?.rowUpdateData?.newRow,
            resolve: action.payload?.rowUpdateData?.resolve,
            reject: action.payload?.rowUpdateData?.reject,
          },
          rowDeleteId: null,
        };
      case 'CONFIRM_DELETE':
        return {
          ...state,
          showModalCreate: false,
          showModalUpdate: false,
          showModalDelete: true,
          showModalResult: false,
          result: null,
          rowUpdateData: null,
          rowDeleteId: action.payload?.rowDeleteId,
        };
      case 'SHOW_RESULT':
        return {
          ...state,
          showModalCreate: false,
          showModalUpdate: false,
          showModalDelete: false,
          showModalResult: true,
          result: {
            type: action.payload?.result?.type,
            error: action.payload?.result?.error,
          },
          rowUpdateData: null,
          rowDeleteId: null,
        };
      default:
        return state;
    }
  };

  const [stateCRUD, dispatchCRUD] = useReducer(reducerCRUD, initialState);

  return { stateCRUD, dispatchCRUD };
};

export default useReducerCRUD;
