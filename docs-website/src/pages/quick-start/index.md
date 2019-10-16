---
path: "/quick-start"
title: "Quick Start"
---

## Quick Start

Install the package with your favorite package manager

`npm install --save formative` &nbsp; / &nbsp; `yarn add formative`

Import the `useForm` &nbsp; hook into your React component

#### Form setup

Define an enum of all your form's field names, these will be the keys that bind your inputs to the form state.

Define the `Form` typescript interface definition.

Define the form's initial state object.

Finally define the form's validation schema using [Yup](https://github.com/jquense/yup).

#### Create the form mark up and bind it to the form state

Use the `inputHandlerProps` to spread the required event handlers onto your input fields.

Pass the `useHandleSubmit` hook to register a submission callback. You can dispatch a Redux action in this callback. If you make this callback async you can call a GraphQL mutation or post a fetch request here.

`embed:quick-start.tsx`

> Important note: The input fields are bound to their respective form state by their `name` attributes. It would be wise to use an `enum` to define these in one place.
