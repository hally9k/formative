export function createFormHooks(state, dispatchers, schema) {
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
  } = actionCreators;

  const [state, dispatch] = useReducer();

  // State Hooks
  function useFormState() {
    return useSelector(getForm);
  }

  function useUpdateFormState() {
    const dispatch = useDispatch();

    return payload => dispatch(formUpdated(payload));
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

  function useFieldError() {
    const isErrored = useIsErrored();
    const errors = useSelector(getErrors);
    const validation = useSelector(getValidation);

    return fieldName => {
      const isErr = isErrored(fieldName);

      if (isErr) {
        const val = validation[fieldName];
        const err = errors[fieldName];

        return val || err;
      }

      return null;
    };
  }

  function useIsValid() {
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
