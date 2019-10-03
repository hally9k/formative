import { Dispatch } from 'react';

export type Action<T, P = null> = {
  type: T;
  payload: P;
};

export enum FormAction {
  FORM_UPDATED = 'FORM_UPDATED',
  FORM_CLEARED = 'FORM_CLEARED',
  FORM_TOUCHED = 'FORM_TOUCHED',
  FORM_VALIDATED = 'FORM_VALIDATED',
  FORM_VALIDATION_FAILED = 'FORM_VALIDATION_FAILED',
  FORM_VALIDATION_RESET = 'FORM_VALIDATION_RESET',
  FORM_FIELD_VALIDATION_RESET = 'FORM_FIELD_VALIDATION_RESET',
  FORM_ERRORED = 'FORM_ERRORED',
  FORM_ERRORS_RESET = 'FORM_ERRORS_RESET',
  FORM_SUBMITTED = 'FORM_SUBMITTED',
}

export type Touched = {
  // ! FIXME This should be indexed with keyof F
  [key: string]: boolean;
};

export type Validation = {
  // ! FIXME This should be indexed with keyof F
  [key: string]: string | null;
};

export type Errors = Validation;

export interface FieldValidationResetPayload {
  fieldName: string;
}

export type FormUpdatedAction<F> = Action<FormAction.FORM_UPDATED, F>;
export type FormClearedAction = Action<FormAction.FORM_CLEARED>;
export type FormTouchedAction = Action<FormAction.FORM_TOUCHED, Touched>;
export type FormValidatedAction<F> = Action<FormAction.FORM_VALIDATED, F>;
export type FormValidationFailedAction = Action<
  FormAction.FORM_VALIDATION_FAILED
>;
export type FormValidationResetAction = Action<
  FormAction.FORM_VALIDATION_RESET
>;
export type FormFieldValidationResetAction = Action<
  FormAction.FORM_FIELD_VALIDATION_RESET,
  FieldValidationResetPayload
>;
export type FormErroredAction = Action<FormAction.FORM_ERRORED, Errors>;
export type FormErrorsResetAction = Action<FormAction.FORM_ERRORS_RESET>;
export type FormSubmittedAction = Action<FormAction.FORM_SUBMITTED, boolean>;

export type ActionUnion<F> =
  | FormUpdatedAction<F>
  | FormClearedAction
  | FormTouchedAction
  | FormValidatedAction<F>
  | FormValidationFailedAction
  | FormValidationResetAction
  | FormFieldValidationResetAction
  | FormErroredAction
  | FormErrorsResetAction
  | FormSubmittedAction;

type FormUpdatedDispatcher<F> = (payload: Partial<F>) => void;
type FormClearedDispatcher = () => void;
type FormTouchedDispatcher = (payload: Touched) => void;
type FormValidatedDispatcher<F> = (payload: F) => void;
type FormValidationFailedDispatcher = () => void;
type FormValidationResetDispatcher = () => void;
type FormFieldValidationResetDispatcher = (
  payload: FieldValidationResetPayload
) => void;
type FormErroredDispatcher = (payload: Errors) => void;
type FormErrorsResetDispatcher = () => void;
type FormSubmittedDispatcher = (payload: boolean) => void;

export interface Dispatchers<F> {
  formUpdated: FormUpdatedDispatcher<F>;
  formCleared: FormClearedDispatcher;
  formTouched: FormTouchedDispatcher;
  formValidated: FormValidatedDispatcher<F>;
  formValidationFailed: FormValidationFailedDispatcher;
  formValidationReset: FormValidationResetDispatcher;
  formFieldValidationReset: FormFieldValidationResetDispatcher;
  formErrored: FormErroredDispatcher;
  formErrorsReset: FormErrorsResetDispatcher;
  formSubmitted: FormSubmittedDispatcher;
}

export function createFormUpdatedDispatcher<F>(
  dispatch: Dispatch<FormUpdatedAction<Partial<F>>>
) {
  return (payload: Partial<F>) =>
    dispatch({
      type: FormAction.FORM_UPDATED,
      payload,
    });
}

export function createFormClearedDispatcher(
  dispatch: Dispatch<FormClearedAction>
) {
  return () =>
    dispatch({
      type: FormAction.FORM_CLEARED,
      payload: null,
    });
}

export function createFormTouchedDispatcher(
  dispatch: Dispatch<FormTouchedAction>
) {
  return (payload: Touched) =>
    dispatch({
      type: FormAction.FORM_TOUCHED,
      payload,
    });
}

export function createFormValidatedDispatcher<F>(
  dispatch: Dispatch<FormValidatedAction<F>>
) {
  return (payload: F) =>
    dispatch({
      type: FormAction.FORM_VALIDATED,
      payload,
    });
}

export function createFormValidationFailedDispatcher(
  dispatch: Dispatch<FormValidationFailedAction>
) {
  return () =>
    dispatch({
      type: FormAction.FORM_VALIDATION_FAILED,
      payload: null,
    });
}

export function createFormValidationResetDispatcher(
  dispatch: Dispatch<FormValidationResetAction>
) {
  return () =>
    dispatch({
      type: FormAction.FORM_VALIDATION_RESET,
      payload: null,
    });
}

export function createFormFieldValidationResetDispatcher(
  dispatch: Dispatch<FormFieldValidationResetAction>
) {
  return (payload: FieldValidationResetPayload) =>
    dispatch({
      type: FormAction.FORM_FIELD_VALIDATION_RESET,
      payload,
    });
}

export function createFormErroredDispatcher(
  dispatch: Dispatch<FormErroredAction>
) {
  return (payload: Errors) =>
    dispatch({
      type: FormAction.FORM_ERRORED,
      payload,
    });
}

export function createFormErrorsResetDispatcher(
  dispatch: Dispatch<FormErrorsResetAction>
) {
  return () =>
    dispatch({
      type: FormAction.FORM_ERRORS_RESET,
      payload: null,
    });
}

export function createFormSubmittedDispatcher(
  dispatch: Dispatch<FormSubmittedAction>
) {
  return (payload: boolean) =>
    dispatch({
      type: FormAction.FORM_SUBMITTED,
      payload,
    });
}

export function createDispatchers<F>(
  dispatch: Dispatch<Action<any, any>> // Dispatch<Action<any, any>>
): Dispatchers<F> {
  return {
    formUpdated: createFormUpdatedDispatcher<F>(dispatch),
    formCleared: createFormClearedDispatcher(dispatch),
    formTouched: createFormTouchedDispatcher(dispatch),
    formValidated: createFormValidatedDispatcher<F>(dispatch),
    formValidationFailed: createFormValidationFailedDispatcher(dispatch),
    formValidationReset: createFormValidationResetDispatcher(dispatch),
    formFieldValidationReset: createFormFieldValidationResetDispatcher(
      dispatch
    ),
    formErrored: createFormErroredDispatcher(dispatch),
    formErrorsReset: createFormErrorsResetDispatcher(dispatch),
    formSubmitted: createFormSubmittedDispatcher(dispatch),
  };
}
