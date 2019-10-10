![Formative](https://raw.githubusercontent.com/hally9k/formative/master/docs-website/src/images/formative.png 'Formative')

# Type Safe Forms with React Hooks

(A work in progress - All contributions welcome!)

## Getting Started

Install the package with you favorite package manager

`npm install --save formative`

or

`yarn add formative`

Import into your React component

```
import React from 'react';
import { useForm } from 'formative';

...

function MyReactFormComponent() {
  const {
    inputHandlerProps,
    useHandleSubmit
  } = useForm<Form>(form, schema);

  const handleSubmit = useHandleSubmit(() => {
    // Async form submission goes here!
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
```

Check out a working example [here](https://github.com/hally9k/formative/tree/master/example)

## Validation

> Formative is opinionated when it comes to validation. `useForm<Form>(form, schema)` requires 3 things, a Typescript `Form` type, the initial `form` object instance, and a [Yup]() `schema`. All validation is defined by the Yup schema definition that you provide to `useForm`.
>
> Note: Currently we only support synchronous Yup validation, async support coming soon.

## Submission

> The `useForm` hook returns a `useHandleSubmit` hook that takes your submission callback function. This callback can contain your async form submission logic.

## Type Safety

> By providing the Typescript type definition to the `useForm<MyFormType>` hook we can provide all the wonders of the Typescript feedback loop and other type safety benefits.
