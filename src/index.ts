import { useEffect, useState, useReducer } from 'react';
import { Schema } from 'yup';
import zipObject from 'lodash/zipObject';

import { createFormReducer, FormState } from './reducer';
import { createDispatchers, Errors, Touched, Validation } from './actions';
import { createFormHooks } from './hooks';

function createInitialState<F>(form: F) {
  const formKeys = Object.keys(form);

  return {
    form,
    errors: zipObject(formKeys, formKeys.map(() => null)) as Errors<F>,
    isValid: true,
    isSubmitted: false,
    touched: zipObject(formKeys, formKeys.map(() => false)) as Touched<F>,
    validation: zipObject(formKeys, formKeys.map(() => null)) as Validation<F>,
  };
}

export function useForm<F>(form: F, schema: Schema<F>) {
  const [hooks, updateHooks] = useState<FormHooks | null>(null);
  const [initialState, updateInitialState] = useState<FormState<F>>(
    createInitialState<F>(form)
  );

  useEffect(() => {
    updateInitialState(createInitialState(form));
  }, [form]);

  const [state, dispatch] = useReducer(
    createFormReducer<F>(form, schema),
    initialState
  );

  const dispatchers = createDispatchers<F>(dispatch);

  useEffect(() => {
    updateHooks(createFormHooks(state, dispatchers, schema));
  }, [state]);

  return hooks;
}
