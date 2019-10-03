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

export interface FormState<F> {
  errors: Errors<F>;
  form: F;
  isValid: boolean;
  isSubmitted: boolean;
  touched: Touched<F>;
  validation: Validation<F>;
}

// * NOTES: Can we rewrite this typesafe? Or should these be explicit switches?
const createReducer = <F, S = F>(
  handlers: any,
  initialState: S | null = null
) => {
  const allHandlers = {
    ...handlers,
  };

  return (state: S | null = initialState, action: ActionUnion<F>) => {
    const handler = allHandlers[action.type];
    return handler ? handler(state, action) : state;
  };
};

export function createFormReducer<F>(initialState: F, schema: Schema<F>) {
  const formFieldKeys = Object.keys(initialState);

  const INITIAL_FORM_STATE = initialState;
  // ! FIXME Make zip typesafe and fix these 3 casts.
  const INITIAL_VALIDATION_STATE = zipObject(
    formFieldKeys,
    formFieldKeys.map(() => null)
  ) as Validation<F>;
  const INITIAL_IS_VALID_STATE = false;
  const INITIAL_IS_SUBMITTED_STATE = false;
  const INITIAL_TOUCHED_STATE = zipObject(
    formFieldKeys,
    formFieldKeys.map(() => false)
  ) as Touched<F>;
  const INITIAL_ERROR_STATE = zipObject(
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
      [FormAction.FORM_CLEARED]: () => INITIAL_FORM_STATE,
    },
    INITIAL_FORM_STATE
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
            INITIAL_VALIDATION_STATE
          );
        }

        return INITIAL_VALIDATION_STATE;
      },
      [FormAction.FORM_VALIDATION_RESET]: () => INITIAL_VALIDATION_STATE,
      [FormAction.FORM_FIELD_VALIDATION_RESET]: (
        state: Validation<F>,
        { payload }: FormFieldValidationResetAction<F>
      ) => ({
        ...state,
        [payload.fieldName]: null,
      }),
      [FormAction.FORM_CLEARED]: () => INITIAL_VALIDATION_STATE,
    },
    INITIAL_VALIDATION_STATE
  );

  const isValid = createReducer<F, boolean>(
    {
      [FormAction.FORM_VALIDATED]: (
        _: boolean,
        { payload }: FormValidatedAction<F>
      ) => schema.isValidSync(payload, { abortEarly: false }),
      [FormAction.FORM_CLEARED]: () => INITIAL_IS_VALID_STATE,
    },
    INITIAL_IS_VALID_STATE
  );

  const isSubmitted = createReducer<F, boolean>(
    {
      [FormAction.FORM_SUBMITTED]: (
        _: boolean,
        { payload }: FormSubmittedAction
      ) => payload,
      [FormAction.FORM_CLEARED]: () => INITIAL_IS_SUBMITTED_STATE,
    },
    INITIAL_IS_SUBMITTED_STATE
  );

  const touched = createReducer<F, Touched<F>>(
    {
      [FormAction.FORM_TOUCHED]: (
        _: Touched<F>,
        { payload }: FormTouchedAction<F>
      ) => payload,
      [FormAction.FORM_CLEARED]: () => INITIAL_TOUCHED_STATE,
    },
    INITIAL_TOUCHED_STATE
  );

  const errors = createReducer<F, Errors<F>>(
    {
      [FormAction.FORM_ERRORED]: (
        _: Errors<F>,
        { payload }: FormErroredAction<F>
      ) => payload,
      [FormAction.FORM_ERRORS_RESET]: () => INITIAL_ERROR_STATE,
      [FormAction.FORM_CLEARED]: () => INITIAL_ERROR_STATE,
    },
    INITIAL_ERROR_STATE
  );

  return combineReducers<FormState<F>>({
    errors,
    form,
    isValid,
    isSubmitted,
    touched,
    validation,
  });
}
