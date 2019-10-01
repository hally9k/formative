import { combineReducers } from 'redux';
import {
  FormAction,
  ActionUnion,
  FormUpdatedAction,
  FormValidatedAction,
  FormFieldValidationResetAction,
  FormSubmittedAction,
  Validation,
  Touched,
  Errors,
  FormTouchedAction,
  FormErroredAction,
} from './actions';
import zipObject from 'lodash/zipObject';
import { Schema, ValidationError } from 'yup';

// * NOTES: Can we rewrite this typesafe? Or should these be explicit switches?
const createReducer = <F, S = F>(
  handlers: any,
  defaultState: S | null = null
) => {
  const allHandlers = {
    ...handlers,
  };

  return (state: S | null = defaultState, action: ActionUnion<F>) => {
    const handler = allHandlers[action.type];
    return handler ? handler(state, action) : state;
  };
};

export function createFormReducer<F>(defaultState: F, schema: Schema<F>) {
  const formFieldKeys = Object.keys(defaultState);

  const DEFAULT_FORM_STATE = defaultState;
  // ! FIXME Make zip typesafe and fix these 3 casts.
  const DEFAULT_VALIDATION_STATE = zipObject(
    formFieldKeys,
    formFieldKeys.map(() => null)
  ) as Validation<F>;
  const DEFAULT_IS_VALID_STATE = false;
  const DEFAULT_IS_SUBMITTED_STATE = false;
  const DEFAULT_TOUCHED_STATE = zipObject(
    formFieldKeys,
    formFieldKeys.map(() => false)
  ) as Touched<F>;
  const DEFAULT_ERROR_STATE = zipObject(
    formFieldKeys,
    formFieldKeys.map(() => null)
  ) as Errors<F>;

  const form = createReducer<F>(
    {
      [FormAction.FORM_UPDATED]: (
        state: F,
        { payload }: FormUpdatedAction<F>
      ) => ({
        ...state,
        ...payload,
      }),
      [FormAction.FORM_CLEARED]: () => DEFAULT_FORM_STATE,
    },
    DEFAULT_FORM_STATE
  );

  const validation = createReducer<F, Validation<F>>(
    {
      [FormAction.FORM_VALIDATED]: (
        _: Validation<F>,
        { payload }: FormValidatedAction<F>
      ) => {
        try {
          schema.validateSync(payload, { abortEarly: false });
        } catch (error) {
          return error.inner.reduce(
            (
              nextState: Validation<F>,
              { path, type, message }: ValidationError
            ) => ({
              ...nextState,
              [path || type]: message,
            }),
            DEFAULT_VALIDATION_STATE
          );
        }

        return DEFAULT_VALIDATION_STATE;
      },
      [FormAction.FORM_VALIDATION_RESET]: () => DEFAULT_VALIDATION_STATE,
      [FormAction.FORM_FIELD_VALIDATION_RESET]: (
        state: Validation<F>,
        { payload }: FormFieldValidationResetAction<F>
      ) => ({
        ...state,
        [payload.fieldName]: null,
      }),
      [FormAction.FORM_CLEARED]: () => DEFAULT_VALIDATION_STATE,
    },
    DEFAULT_VALIDATION_STATE
  );

  const isValid = createReducer<F, boolean>(
    {
      [FormAction.FORM_VALIDATED]: (
        _: boolean,
        { payload }: FormValidatedAction<F>
      ) => schema.isValidSync(payload, { abortEarly: false }),
      [FormAction.FORM_CLEARED]: () => DEFAULT_IS_VALID_STATE,
    },
    DEFAULT_IS_VALID_STATE
  );

  const isSubmitted = createReducer<F, boolean>(
    {
      [FormAction.FORM_SUBMITTED]: (
        _: boolean,
        { payload }: FormSubmittedAction
      ) => payload,
      [FormAction.FORM_CLEARED]: () => DEFAULT_IS_SUBMITTED_STATE,
    },
    DEFAULT_IS_SUBMITTED_STATE
  );

  const touched = createReducer<F, Touched<F>>(
    {
      [FormAction.FORM_TOUCHED]: (
        _: Touched<F>,
        { payload }: FormTouchedAction<F>
      ) => payload,
      [FormAction.FORM_CLEARED]: () => DEFAULT_TOUCHED_STATE,
    },
    DEFAULT_TOUCHED_STATE
  );

  const errors = createReducer<F, Errors<F>>(
    {
      [FormAction.FORM_ERRORED]: (
        _: Errors<F>,
        { payload }: FormErroredAction<F>
      ) => payload,
      [FormAction.FORM_ERRORS_RESET]: () => DEFAULT_ERROR_STATE,
      [FormAction.FORM_CLEARED]: () => DEFAULT_ERROR_STATE,
    },
    DEFAULT_ERROR_STATE
  );

  return combineReducers({
    errors,
    form,
    isValid,
    isSubmitted,
    touched,
    validation,
  });
}
