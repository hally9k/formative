import { createSelector } from 'reselect';
import get from 'lodash/get';

export function createSelectors<T>(state: T) {
  const getFormState = () => get(state, `form`, null);

  const getForm = createSelector(
    [getFormState],
    form => form
  );

  const getIsValidState = () => get(state, `isValid`, null);
  const getIsValid = createSelector(
    [getIsValidState],
    isValid => isValid
  );

  const getValidationState = () => get(state, `validation`, null);
  const getValidation = createSelector(
    [getValidationState],
    validation => validation
  );

  const getTouchedState = () => get(state, `touched`, null);
  const getTouched = createSelector(
    [getTouchedState],
    touched => touched
  );

  const getErrorState = () => get(state, `errors`, null);
  const getErrors = createSelector(
    [getErrorState],
    errors => errors
  );

  const getIsSubmittedState = () => get(state, `isSubmitted`, null);
  const getIsSubmitted = createSelector(
    [getIsSubmittedState],
    isSubmitted => isSubmitted
  );

  return {
    getForm,
    getIsValid,
    getValidation,
    getTouched,
    getErrors,
    getIsSubmitted
  };
}
