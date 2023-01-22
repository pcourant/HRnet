import { Employee } from '@types';
import { useReducer } from 'react';

interface StateCRUD {
  showModalCreate: boolean;
  showModalUpdate: boolean;
  showModalDelete: boolean;
  showModalResult: boolean;
  result: {
    type: 'CREATE' | 'UPDATE' | 'DELETE' | undefined;
    error: string | undefined;
  } | null;
  rowUpdateData: {
    oldRow: Employee | undefined;
    newRow: Employee | undefined;
    resolve:
      | ((value: Employee | PromiseLike<Employee>) => void | undefined)
      | undefined;
    reject: ((reason?: unknown) => void | undefined) | undefined;
  } | null;
  rowDeleteId: string | null | undefined;
}

export interface ActionCRUD {
  type:
    | 'CANCEL'
    | 'CONFIRM_UPDATE'
    | 'CONFIRM_DELETE'
    | 'CONFIRM_CREATE'
    | 'SHOW_RESULT'
    | 'INIT';
  payload?: {
    result: StateCRUD['result'];
    rowUpdateData: StateCRUD['rowUpdateData'];
    rowDeleteId: StateCRUD['rowDeleteId'];
  };
}

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
