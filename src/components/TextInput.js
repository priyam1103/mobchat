import React from "react";
import {
  Formik,
  Form,
  Field,
  useFormik,
  useField,
  FormikProvider,
} from "formik";
import "./styles.css";
import * as Yup from "yup";

const TextInput = ({ label, helpText, errorText, ...props }) => {
  const [field, meta] = useField(props);
  const [didFocus, setDidFocus] = React.useState(false);
  const handleFocus = () => setDidFocus(true);
  const showFeedback =
    (!!didFocus && field.value.trim().len > 2) || meta.touched;

  return (
    <div
      className={`form-control ${
        showFeedback ? (meta.error || errorText ? "invalid" : "valid") : ""
      }`}
    >
      <div className="flex items-center space-between">
        <label htmlFor={props.id}>{label}</label>{" "}
        {showFeedback ? (
          <div
            id={`${props.id}-feedback`}
            aria-live="polite"
            className="feedback text-sm"
          >
            {meta.error || errorText ? meta.error || errorText : "✓"}
          </div>
        ) : null}
      </div>
      <input
        {...props}
        {...field}
        aria-describedby={`${props.id}-feedback ${props.id}-help`}
        onFocus={handleFocus}
      />
      <div className="text-xs" id={`${props.id}-help`} tabIndex="-1">
        {helpText}
      </div>
    </div>
  );
};

export default TextInput;
