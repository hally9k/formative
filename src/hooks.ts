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
  // useClearForm: () => () => void;
  // useErrors: () => Errors;
  // useFieldError: () => (fieldName: string) => string | null;
  // useFormState: () => F;
  // useControlHandlerProps: () => {
  //   onBlur: (event: SyntheticEvent<any>) => void;
  //   onFocus: (event: SyntheticEvent<any>) => void;
  //   onClick: (event: SyntheticEvent<any>) => void;
  // };
  // useInputHandlerProps: () => {
  //   onBlur: (event: SyntheticEvent<any>) => void;
  //   onFocus: (event: SyntheticEvent<any>) => void;
  //   onChange: (event: SyntheticEvent<any>) => void;
  // };
  // inputHandlerProps: {
  //   onBlur: (event: SyntheticEvent<any>) => void;
  //   onFocus: (event: SyntheticEvent<any>) => void;
  //   onChange: (event: SyntheticEvent<any>) => void;
  // };
  // useHandleSubmit: (
  //   callback: (event: SyntheticEvent<any>) => void
  // ) => (event: SyntheticEvent<any>) => void;
  // useIsErrored: () => (fieldName: string) => boolean;
  // isErrored: (fieldName: string) => boolean;
  // useIsValid: () => boolean;
  // useResetErrors: () => () => void;
  // useSetFieldValue: () => (fieldName: string, value: any) => void;
  // useValidation: () => Validation;
  // useOnChange: () => (event: SyntheticEvent<any>) => void;
  // useOnClick: () => (event: SyntheticEvent<any>) => void;
  // useOnBlur: () => (event: SyntheticEvent<any>) => void;
  // useOnFocus: () => (event: SyntheticEvent<any>) => void;
  // useTouched: () => Touched;
  // useIsSubmitted: () => boolean;
  // useUpdateIsSubmitted: () => (payload: boolean) => void;
  // useUpdateValidation: () => {
  //   updateValidation: (payload: F) => void;
  //   resetFieldValidation: (payload: FieldValidationResetPayload) => void;
  //   resetFormValidation: () => void;
  // };
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

  // State Hooks
  // function useFormState() {
  //   return state.form;
  // }

  // function useUpdateFormState() {
  //   return (payload: Partial<F>) => formUpdated(payload);
  // }

  // function useValidation() {
  //   return state.validation;
  // }

  // function useUpdateValidation() {
  //   const updateValidation = (payload: F) => formValidated(payload);
  //   const resetFieldValidation = (payload: FieldValidationResetPayload) =>
  //     formFieldValidationReset(payload);
  //   const resetFormValidation = () => formValidationReset();

  //   return { updateValidation, resetFieldValidation, resetFormValidation };
  // }

  // function useTouched() {
  //   return state.touched;
  // }

  // function useUpdateTouched() {
  //   return (payload: Touched) => formTouched(payload);
  // }

  // function useIsSubmitted() {
  //   return state.isSubmitted;
  // }

  // function useUpdateIsSubmitted() {
  //   return (payload: boolean) => formSubmitted(payload);
  // }

  // function useClearForm() {
  //   return () => formCleared();
  // }

  function useHandleSubmit(callback: (event: SyntheticEvent<any>) => void) {
    // const { updateValidation } = useUpdateValidation();
    // const form = useFormState();
    // const resetErrors = useResetErrors();
    // const updateIsSubmitted = useUpdateIsSubmitted();

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

  // function useErrors() {
  //   return state.errors;
  // }

  // function useResetErrors() {
  //   return () => formErrorsReset();
  // }

  // function useIsErrored() {
  //   return (fieldName: string) =>
  //     Boolean(
  //       (state.errors[fieldName] || state.validation[fieldName]) &&
  //         (state.isSubmitted || state.touched[fieldName])
  //     );
  // }

  function isErrored(fieldName: string) {
    return Boolean(
      (state.errors[fieldName] || state.validation[fieldName]) &&
        (state.isSubmitted || state.touched[fieldName])
    );
  }

  // function useFieldError() {
  //   // const isErrored = useIsErrored();

  //   return (fieldName: string) => {
  //     const isErr = isErrored(fieldName);

  //     if (isErr) {
  //       const val = state.validation[fieldName];
  //       const err = state.errors[fieldName];

  //       return val || err;
  //     }

  //     return null;
  //   };
  // }

  // function useIsValid() {
  //   return state.isValid;
  // }

  // function useSetFieldValue() {
  //   return (name: string, value: any) => {
  //     // ! FIXME Lazy cast here:
  //     formUpdated({ [name]: value } as Partial<F>);
  //   };
  // }

  function setFieldValue(name: string, value: any) {
    formUpdated({ [name]: value } as Partial<F>);
  }

  // Handler Hooks
  // function useInputHandlerProps() {
  //   return {
  //     onFocus: useOnFocus(),
  //     onBlur: useOnBlur(),
  //     onChange: useOnChange(),
  //   };
  // }

  const inputHandlerProps = {
    onFocus: useOnFocus(),
    onBlur: useOnBlur(),
    onChange: useOnChange(),
  };

  // function useControlHandlerProps() {
  //   return {
  //     onFocus: useOnFocus(),
  //     onBlur: useOnBlur(),
  //     onClick: useOnClick(),
  //   };
  // }

  const controlHandlerProps = {
    onFocus: useOnFocus(),
    onBlur: useOnBlur(),
    onChange: useOnChange(),
  };

  function useOnFocus(callback?: (event: SyntheticEvent<any>) => void) {
    // const { resetFieldValidation } = useUpdateValidation();

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
    // const form = useFormState();
    // const { updateValidation } = useUpdateValidation();

    return (event: SyntheticEvent<any>) => {
      const { value, name } = event.currentTarget;
      formValidated({ ...state.form, [name]: value });

      if (callback) {
        callback(event);
      }
    };
  }

  function useOnChange(callback?: (event: SyntheticEvent<any>) => void) {
    // const form = useFormState();
    // const updateForm = useUpdateFormState();

    return (event: SyntheticEvent<any>) => {
      const { value, name } = event.currentTarget;
      formUpdated({ ...state.form, [name]: value });

      if (callback) {
        callback(event);
      }
    };
  }

  function useOnClick(callback?: (event: SyntheticEvent<any>) => void) {
    // const form = useFormState();
    // const updateForm = useUpdateFormState();

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
    // Dispatcher
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
