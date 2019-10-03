import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as yup from 'yup';
import { useForm } from '../src';

enum FieldKey {
  EMAIL = 'email',
  PASSWORD = 'password'
}

interface Form {
  [FieldKey.EMAIL]: string;
  [FieldKey.PASSWORD]: string;
}

const form: Form = {
  [FieldKey.EMAIL]: '',
  [FieldKey.PASSWORD]: '',
};

const schema = yup.object().shape({
  [FieldKey.EMAIL]: yup
    .string()
    .email()
    .required('Required'),
  [FieldKey.PASSWORD]: yup.string().required('Required'),
});

const App = () => {
  const {
    // useClearForm,
    // useErrors,
    // useFieldError,
    // useFormState,
    // useControlHandlerProps,
    // useInputHandlerProps,
    inputHandlerProps
    useHandleSubmit,
    // useIsErrored,
    isErrored,
    // useIsValid,
    // useResetErrors,
    // useSetFieldValue,
    // useValidation,
    // useOnChange,
    // useOnClick,
    // useOnBlur,
    // useOnFocus,
    // useTouched,
    // useIsSubmitted,
    // useUpdateIsSubmitted,
    // useUpdateValidation,
    // useUpdateTouched,
  } = useForm<Form>(form, schema);

  const handleSubmit = useHandleSubmit((event: React.SyntheticEvent<HTMLButtonElement>) => {

  })

  return (
    <form onSubmit={handleSubmit}>
      <input name={FieldKey.EMAIL} {...inputHandlerProps} />
  { isErrored(FieldKey.EMAIL) && <p style={{ color: 'red' }}>{errors[FieldKey.EMAIL]}</p> }
      <input name={FieldKey.PASSWORD} {...useInputHandlerProps} />
      <p style={{ color: 'red' }}></p>
      <button type="submit">Submit</button>
    </form>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
