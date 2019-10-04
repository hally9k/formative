import { SyntheticEvent } from 'react';
import {
  Dispatchers,
  Errors,
  Touched,
  Validation,
  FieldValidationResetPayload,
} from './actions';
import { FormState } from './reducer';
import { Schema } from 'yup';

export interface FormHooks<F> {
  form: F;
  errors: Errors;
  validation: Validation;
  touched: Touched;
  isValid: boolean;
  isSubmitted: boolean;
  // Dispatchers
  clearForm: () => void;
  resetFormValidation: () => void;
  validateForm: (payload: F) => void;
  resetFieldValidation: (payload: FieldValidationResetPayload) => void;
  resetFormErrors: () => void;
  // Handler Props
  inputHandlerProps: {
    onBlur: (event: SyntheticEvent<any>) => void;
    onFocus: (event: SyntheticEvent<any>) => void;
    onChange: (event: SyntheticEvent<any>) => void;
  };
  controlHandlerProps: {
    onBlur: (event: SyntheticEvent<any>) => void;
    onFocus: (event: SyntheticEvent<any>) => void;
    onClick: (event: SyntheticEvent<any>) => void;
  };
  // Handler Hooks
  useHandleSubmit: (
    callback: (event: SyntheticEvent<any>) => void
  ) => (event: SyntheticEvent<any>) => void;
  useOnChange: () => (event: SyntheticEvent<any>) => void;
  useOnClick: () => (event: SyntheticEvent<any>) => void;
  useOnBlur: () => (event: SyntheticEvent<any>) => void;
  useOnFocus: () => (event: SyntheticEvent<any>) => void;
  // Helpers
  isErrored: boolean;
  setFieldValue: (fieldName: string, value: any) => void;
}

export function createFormHooks<F>(
  state: FormState<F>,
  dispatchers: Dispatchers<F>,
  schema: Schema<F>
) {
  const {
    formUpdated,
    formValidated,
    formFieldValidationReset,
    formTouched,
    formErrorsReset,
    formSubmitted,
    formCleared,
    formValidationReset,
  } = dispatchers;

  function useHandleSubmit(callback: (event: SyntheticEvent<any>) => void) {
    return (event: SyntheticEvent<any>) => {
      event.preventDefault();
      formSubmitted(true);
      formValidated(state.form);
      formErrorsReset();

      let isValid = false;

      try {
        isValid = Boolean(
          schema.validateSync(state.form, { abortEarly: false })
        );
      } catch (error) {
        //
      }

      if (isValid) {
        callback(event);
      }
    };
  }

  function isErrored(fieldName: string) {
    return Boolean(
      (state.errors[fieldName] || state.validation[fieldName]) &&
        (state.isSubmitted || state.touched[fieldName])
    );
  }

  function setFieldValue(name: string, value: any) {
    formUpdated({ [name]: value } as Partial<F>);
  }

  const inputHandlerProps = {
    onFocus: useOnFocus(),
    onBlur: useOnBlur(),
    onChange: useOnChange(),
  };

  const controlHandlerProps = {
    onFocus: useOnFocus(),
    onBlur: useOnBlur(),
    onChange: useOnChange(),
  };

  function useOnFocus(callback?: (event: SyntheticEvent<any>) => void) {
    return (event: SyntheticEvent<any>) => {
      const fieldName = event.currentTarget.name;
      if (!state.touched[fieldName]) {
        formTouched({ ...state.touched, [fieldName]: true });
      }
      formFieldValidationReset({ fieldName });

      if (callback) {
        callback(event);
      }
    };
  }

  function useOnBlur(callback?: (event: SyntheticEvent<any>) => void) {
    return (event: SyntheticEvent<any>) => {
      const { value, name } = event.currentTarget;
      formValidated({ ...state.form, [name]: value });

      if (callback) {
        callback(event);
      }
    };
  }

  function useOnChange(callback?: (event: SyntheticEvent<any>) => void) {
    return (event: SyntheticEvent<any>) => {
      const { value, name } = event.currentTarget;
      formUpdated({ ...state.form, [name]: value });

      if (callback) {
        callback(event);
      }
    };
  }

  function useOnClick(callback?: (event: SyntheticEvent<any>) => void) {
    return (event: SyntheticEvent<any>) => {
      const { value, name } = event.currentTarget;
      formUpdated({ ...state.form, [name]: value });

      if (callback) {
        callback(event);
      }
    };
  }

  return {
    ...state,
    // Dispatchers
    clearForm: formCleared,
    resetFormValidation: formValidationReset,
    validateForm: formValidated,
    resetFieldValidation: formFieldValidationReset,
    resetFormErrors: formErrorsReset,
    // Handler Props
    controlHandlerProps,
    inputHandlerProps,
    // Handler Hooks
    useHandleSubmit,
    useOnChange,
    useOnClick,
    useOnBlur,
    useOnFocus,
    // Helpers
    isErrored,
    setFieldValue,
  };
}
