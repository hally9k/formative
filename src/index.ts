import { useEffect, useState, useReducer } from 'react';
import { Schema } from 'yup';
import zipObject from 'lodash/zipObject';

import { createFormReducer, FormState } from './reducer';
import { createDispatchers, Errors, Touched, Validation } from './actions';
import { createFormHooks, FormHooks } from './hooks';
import { createSelectors } from './selectors';

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
  // const [hooks, updateHooks] = useState<FormHooks<F> | null>(null);
  // const [initialState, updateInitialState] = useState<FormState<F>>(
  //   createInitialState<F>(form)
  // );

  // useEffect(() => {
  //   updateInitialState(createInitialState(form));
  // }, [form]);

  const initialState = createInitialState<F>(form);

  const [state, dispatch] = useReducer(
    createFormReducer<F>(form, schema),
    initialState
  );

  const dispatchers = createDispatchers<F>(dispatch);

  // useEffect(() => {
  //   updateHooks(createFormHooks(state, dispatchers, schema));
  // }, [state]);

  return createFormHooks(state, dispatchers, schema);
}
