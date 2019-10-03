import { SyntheticEvent } from 'react';
import { createSelectors } from './selectors';
import { Dispatchers, Errors, Touched, Validation } from './actions';
import { FormState } from './reducer';
import { Schema } from 'yup';

interface FormHooks<F> {
  useClearForm: () => () => void;
  useErrors: () => Errors<F>;
  useFieldError: () => (fieldName: keyof F) => string | null;
  useFormState: () => F;
  useControlHandlerProps: () => {
    onBlur: (event: SyntheticEvent<any>) => void;
    onFocus: (event: SyntheticEvent<any>) => void;
    onClick: (event: SyntheticEvent<any>) => void;
  };
  useInputHandlerProps: () => {
    onBlur: (event: SyntheticEvent<any>) => void;
    onFocus: (event: SyntheticEvent<any>) => void;
    onChange: (event: SyntheticEvent<any>) => void;
  };
  useHandleSubmit: (callback: (event: SyntheticEvent<any>) => void) => (event: SyntheticEvent<any>) => void;
  useIsErrored: () => (fieldName: keyof F) => boolean;
  useIsValid: () => boolean;
  useResetErrors: () => () => void;
  useSetFieldValue: () => (fieldName: keyof F, value: any) => void;
  useValidation: () => Validation<F>;
  useOnChange: () => (event: SyntheticEvent<any>) => void;
  useOnClick: () => (event: SyntheticEvent<any>) => void;
  useOnBlur: () => (event: SyntheticEvent<any>) => void;
  useOnFocus: () => (event: SyntheticEvent<any>) => void;
  useTouched: () => Touched<F>;
  useIsSubmitted: () => boolean;
  useUpdateIsSubmitted: () => (payload: boolean) => void ;
  useUpdateValidation: () => [
    updateValidation: () => void,
    resetFieldValidation: () => void,
    resetFormValidation: () => void
  ];
}

export function createFormHooks<F>(
  state: FormState<F>,
  dispatchers: Dispatchers<F>,
  schema: Schema<F>
) {
  const {
    getForm,
    getIsValid,
    getValidation,
    getTouched,
    getErrors,
    getIsSubmitted,
  } = selectors;

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
  function useFormState() {
    return getForm(state);
  }

  function useUpdateFormState() {
    return (payload: Partial<F>) => formUpdated(payload);
  }

  function useValidation() {
    return useSelector(getValidation);
  }

  function useUpdateValidation() {
    const dispatch = useDispatch();

    const updateValidation = payload => dispatch(formValidated(payload));
    const resetFieldValidation = payload =>
      dispatch(formFieldValidationReset(payload));
    const resetFormValidation = payload =>
      dispatch(formValidationReset(payload));

    return [updateValidation, resetFieldValidation, resetFormValidation];
  }

  function useTouched() {
    return useSelector(getTouched);
  }

  function useUpdateTouched() {
    const dispatch = useDispatch();

    return payload => dispatch(formTouched(payload));
  }

  function useIsSubmitted() {
    return useSelector(getIsSubmitted);
  }

  function useUpdateIsSubmitted() {
    const dispatch = useDispatch();

    return payload => dispatch(formSubmitted(payload));
  }

  function useClearForm() {
    const dispatch = useDispatch();

    return payload => dispatch(formCleared(payload));
  }

  function useHandleSubmit(callback) {
    const [updateValidation] = useUpdateValidation();
    const form = useFormState();
    const resetErrors = useResetErrors();
    const updateIsSubmitted = useUpdateIsSubmitted();

    return event => {
      event.preventDefault();
      updateIsSubmitted(true);
      updateValidation(form);
      resetErrors();

      let isValid = false;

      try {
        isValid = Boolean(schema.validateSync(form, { abortEarly: false }));
      } catch (error) {
        //
      }

      if (isValid) {
        callback(event);
      }
    };
  }

  function useErrors() {
    return useSelector(getErrors);
  }

  function useResetErrors() {
    const dispatch = useDispatch();

    return () => dispatch(formErrorsReset());
  }

  function useIsErrored() {
    const errors = useSelector(getErrors);
    const validation = useSelector(getValidation);
    const touched = useSelector(getTouched);
    const isSubmitted = useIsSubmitted();

    return fieldName =>
      Boolean(
        (errors[fieldName] || validation[fieldName]) &&
          (isSubmitted || touched[fieldName])
      );
  }

  function useFieldError<F>() {
    const isErrored = useIsErrored();
    const errors = useSelector(getErrors);
    const validation = useSelector(getValidation);

    return (fieldName: keyof F) => {
      const isErr = isErrored(fieldName);

      if (isErr) {
        const val = validation[fieldName];
        const err = errors[fieldName];

        return val || err;
      }

      return null;
    };
  }

  function useIsValid()  => boolean{
    return useSelector(getIsValid);
  }

  function useSetFieldValue() {
    const updateForm = useUpdateFormState();

    return (name, value) => {
      updateForm({ [name]: value });
    };
  }

  // Handler Hooks
  function useInputHandlerProps() {
    return {
      onFocus: useOnFocus(),
      onBlur: useOnBlur(),
      onChange: useOnChange(),
    };
  }

  function useControlHandlerProps() {
    return {
      onFocus: useOnFocus(),
      onBlur: useOnBlur(),
      onClick: useOnClick(),
    };
  }

  function useOnFocus(callback) {
    const touched = useTouched();
    const updateTouched = useUpdateTouched();
    const [, resetFieldValidation] = useUpdateValidation();

    return event => {
      const fieldName = event.currentTarget.name;
      if (!touched[fieldName]) {
        updateTouched({ ...touched, [fieldName]: true });
      }
      resetFieldValidation({ fieldName });

      if (callback) {
        callback(event);
      }
    };
  }

  function useOnBlur(callback) {
    const form = useFormState();
    const [updateValidation] = useUpdateValidation();

    return event => {
      const { value, name } = event.currentTarget;
      updateValidation({ ...form, [name]: value });

      if (callback) {
        callback(event);
      }
    };
  }

  function useOnChange(callback) {
    const form = useFormState();
    const updateForm = useUpdateFormState();

    return event => {
      const { value, name } = event.currentTarget;
      updateForm({ ...form, [name]: value });

      if (callback) {
        callback(event);
      }
    };
  }

  function useOnClick(callback) {
    const form = useFormState();
    const updateForm = useUpdateFormState();

    return event => {
      const { value, name } = event.currentTarget;
      updateForm({ ...form, [name]: value });

      if (callback) {
        callback(event);
      }
    };
  }

  return {
    useClearForm,
    useErrors,
    useFieldError,
    useFormState,
    useControlHandlerProps,
    useInputHandlerProps,
    useHandleSubmit,
    useIsErrored,
    useIsValid,
    useResetErrors,
    useSetFieldValue,
    useValidation,
    useOnChange,
    useOnClick,
    useOnBlur,
    useOnFocus,
    useTouched,
    useIsSubmitted,
    useUpdateIsSubmitted,
    useUpdateValidation,
  };
}
