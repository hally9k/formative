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

export type Touched<F> = {
  [P in keyof F]: boolean;
};

export type Validation<F> = {
  [P in keyof F]: string | null;
} & { message: string | null };

export type Errors<F> = Validation<F>;

interface FieldValidationResetPayload<F> {
  fieldName: keyof F;
}

export type FormUpdatedAction<F> = Action<FormAction.FORM_UPDATED, F>;
export type FormClearedAction = Action<FormAction.FORM_CLEARED>;
export type FormTouchedAction<F> = Action<FormAction.FORM_TOUCHED, Touched<F>>;
export type FormValidatedAction<F> = Action<
  FormAction.FORM_VALIDATED,
  Validation<F>
>;
export type FormValidationFailedAction = Action<
  FormAction.FORM_VALIDATION_FAILED
>;
export type FormValidationResetAction = Action<
  FormAction.FORM_VALIDATION_RESET
>;
export type FormFieldValidationResetAction<F> = Action<
  FormAction.FORM_FIELD_VALIDATION_RESET,
  FieldValidationResetPayload<F>
>;
export type FormErroredAction<F> = Action<FormAction.FORM_ERRORED, Errors<F>>;
export type FormErrorsResetAction = Action<FormAction.FORM_ERRORS_RESET>;
export type FormSubmittedAction = Action<FormAction.FORM_SUBMITTED>;

export type ActionUnion<F> =
  | FormUpdatedAction<F>
  | FormClearedAction
  | FormTouchedAction<F>
  | FormValidatedAction<F>
  | FormValidationFailedAction
  | FormValidationResetAction
  | FormFieldValidationResetAction<F>
  | FormErroredAction<F>
  | FormErrorsResetAction
  | FormSubmittedAction;

type FormUpdatedDispatcher<F> = (payload: Partial<F>) => void;
type FormClearedDispatcher = () => void;
type FormTouchedDispatcher<F> = (payload: Touched<F>) => void;
type FormValidatedDispatcher<F> = (payload: Validation<F>) => void;
type FormValidationFailedDispatcher = () => void;
type FormValidationResetDispatcher = () => void;
type FormFieldValidationResetDispatcher<F> = (
  payload: FieldValidationResetPayload<F>
) => void;
type FormErroredDispatcher<F> = (payload: Errors<F>) => void;
type FormErrorsResetDispatcher = () => void;
type FormSubmittedDispatcher = () => void;

export interface Dispatchers<F> {
  formUpdated: FormUpdatedDispatcher<F>;
  formCleared: FormClearedDispatcher;
  formTouched: FormTouchedDispatcher<F>;
  formValidated: FormValidatedDispatcher<F>;
  formValidationFailed: FormValidationFailedDispatcher;
  formValidationReset: FormValidationResetDispatcher;
  formFieldValidationReset: FormFieldValidationResetDispatcher<F>;
  formErrored: FormErroredDispatcher<F>;
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

export function createFormTouchedDispatcher<F>(
  dispatch: Dispatch<FormTouchedAction<F>>
) {
  return (payload: Touched<F>) =>
    dispatch({
      type: FormAction.FORM_TOUCHED,
      payload,
    });
}

export function createFormValidatedDispatcher<F>(
  dispatch: Dispatch<FormValidatedAction<F>>
) {
  return (payload: Validation<F>) =>
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

export function createFormFieldValidationResetDispatcher<F>(
  dispatch: Dispatch<FormFieldValidationResetAction<F>>
) {
  return (payload: FieldValidationResetPayload<F>) =>
    dispatch({
      type: FormAction.FORM_FIELD_VALIDATION_RESET,
      payload,
    });
}

export function createFormErroredDispatcher<F>(
  dispatch: Dispatch<FormErroredAction<F>>
) {
  return (payload: Errors<F>) =>
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
  return () =>
    dispatch({
      type: FormAction.FORM_SUBMITTED,
      payload: null,
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
    formFieldValidationReset: createFormFieldValidationResetDispatcher<F>(
      dispatch
    ),
    formErrored: createFormErroredDispatcher(dispatch),
    formErrorsReset: createFormErrorsResetDispatcher(dispatch),
    formSubmitted: createFormSubmittedDispatcher(dispatch),
  };
}
