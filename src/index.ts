import { useReducer } from 'react';
import { Schema } from 'yup';
import zipObject from 'lodash/zipObject';

import { createFormReducer } from './reducer';
import { createDispatchers, Errors, Touched, Validation } from './actions';
import { createFormHooks } from './hooks';

function createInitialState<F>(form: F) {
  const formKeys = Object.keys(form);

  return {
    form,
    errors: zipObject(formKeys, formKeys.map(() => null)) as Errors,
    isValid: true,
    isSubmitted: false,
    touched: zipObject(formKeys, formKeys.map(() => false)) as Touched,
    validation: zipObject(formKeys, formKeys.map(() => null)) as Validation,
  };
}

export function useForm<F>(form: F, schema: Schema<F>) {
  const initialState = createInitialState<F>(form);

  const [state, dispatch] = useReducer(
    createFormReducer<F>(form, schema),
    initialState
  );

  const dispatchers = createDispatchers<F>(dispatch);

  return createFormHooks(state, dispatchers, schema);
}
