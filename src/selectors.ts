import { useMemo } from 'react';
import get from 'lodash/get';
import { FormState } from './reducer';

export function createSelectors<F>(state: FormState<F>) {
  const getForm = useMemo(() => get(state, `form`, null), [state.form]);

  const getIsValid = useMemo(() => () => get(state, `isValid`, null), [
    state.isValid,
  ]);

  const getValidation = useMemo(() => get(state, `validation`, null), [
    state.validation,
  ]);

  const getTouched = useMemo(() => get(state, `touched`, null), [
    state.validation,
  ]);

  const getErrors = useMemo(() => get(state, `errors`, null), [
    state.validation,
  ]);

  const getIsSubmitted = useMemo(() => get(state, `isSubmitted`, null), [
    state.isSubmitted,
  ]);

  return {
    getForm,
    getIsValid,
    getValidation,
    getTouched,
    getErrors,
    getIsSubmitted,
  };
}
