import "react-app-polyfill/ie11"
import * as React from "react"
import * as ReactDOM from "react-dom"
import * as yup from "yup"
import { useForm } from "formative"

enum FieldKey {
  EMAIL = "email",
  PASSWORD = "password",
}

interface Form {
  [FieldKey.EMAIL]: string
  [FieldKey.PASSWORD]: string
}

const form: Form = {
  [FieldKey.EMAIL]: "",
  [FieldKey.PASSWORD]: "",
}

const schema = yup.object().shape({
  [FieldKey.EMAIL]: yup
    .string()
    .email()
    .required("Required"),
  [FieldKey.PASSWORD]: yup.string().required("Required"),
})

const App = () => {
  const {
    validation,
    errors,
    inputHandlerProps,
    useHandleSubmit,
    isErrored,
  } = useForm<Form>(form, schema)

  const handleSubmit = useHandleSubmit(() => {
    alert("submitted")
  })

  return (
    <form
      style={{ display: "flex", flexDirection: "column", width: 300 }}
      onSubmit={handleSubmit}
    >
      <input name={FieldKey.EMAIL} {...inputHandlerProps} />
      {isErrored(FieldKey.EMAIL) && (
        <p style={{ color: "red" }}>
          {validation[FieldKey.EMAIL] || errors[FieldKey.EMAIL]}
        </p>
      )}
      <input type="password" name={FieldKey.PASSWORD} {...inputHandlerProps} />
      {isErrored(FieldKey.PASSWORD) && (
        <p style={{ color: "red" }}>
          {validation[FieldKey.PASSWORD] || errors[FieldKey.PASSWORD]}
        </p>
      )}
      <button type="submit">Submit</button>
    </form>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
