import React from 'react';
import { useForm } from 'formative';

...

function MyReactFormComponent() {
  const {
    inputHandlerProps,
    useHandleSubmit
  } = useForm<Form>(form, schema);

  const handleSubmit = useHandleSubmit(() => {
    alert('submitted');
  });

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" {...inputHandlerProps} />
      <input type="password" name="password" {...inputHandlerProps} />
      <button type="submit">Submit</button>
    </form>
  );
}