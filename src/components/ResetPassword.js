import React from "react";
import { Form, useFormik, FormikProvider } from "formik";
import "./styles.css";
import axios from "axios";
import * as Yup from "yup";
import { navigate, Link } from "@reach/router";
import TextInput from "./TextInput";
import "./loader.css";
import "./screen.css";
const ResetPassword = () => {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  React.useEffect(() => {
    if (localStorage.getItem("mobchat_token")) {
      navigate("/");
    }
  }, []);
  const [error, setError] = React.useState({});
  const formik = useFormik({
    initialValues: {
      emailId: "",
    },
    onSubmit: (value) => {
      setLoading(true);
      axios
        .post("http://localhost:3001/user/resetPassToken", value)
        .then((res) => {
          if (res.status === 200) {
            setSuccess(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setError({});
          setLoading(false);
          if (err.response.data.message === "email does not exists") {
            setError((prevState) => {
              return { ...prevState, emailId: "Email id does not exists" };
            });
          }
        });
    },
    validationSchema: Yup.object({
      emailId: Yup.string().email("Invalid email").required("Required"),
    }),
  });
  return (
    <div style={{ backgroundColor: "#3b3b38", height: window.innerHeight }}>
      <div className="sty">
        {!loading ? (
          <>
            {!success ? (
              <FormikProvider value={formik}>
                <Form>
                  <TextInput
                    label="Email Id"
                    id="emailId"
                    name="emailId"
                    helpText="Please provide your email id "
                    type="text"
                    errorText={error.emailId}
                  />

                  <div>
                    <button type="submit">Send link</button>
                  </div>
                  <Link to="/signin"> Want to sign in ?</Link>
                </Form>
              </FormikProvider>
            ) : (
              <p style={{ color: " #ffcccc" }}>
                Reset Password link has been sent to your mail id
              </p>
            )}
          </>
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
