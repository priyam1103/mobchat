import React from "react";
import { Form, useFormik, FormikProvider } from "formik";
import "./styles.css";
import * as Yup from "yup";
import axios from "axios";
import "./screen.css";
import { navigate, Link, useLocation } from "@reach/router";
import TextInput from "./TextInput";
import { parse } from "query-string";
import "./loader.css";
const Reset = (props) => {
  const [allowReset, setAllowReset] = React.useState(false);
  const [resetError, setResetError] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const location = useLocation();
  const params = parse(location.search);
  React.useEffect(() => {
    setResetError();
    if (!props.token) {
      navigate("/", { replace: true });
      return;
    }
    async function checkToken(token) {
      setLoading(true);
      await axios
        .get(`http://localhost:3000/user/resetPassVerify/${token}`)
        .then((res) => {
          if (res.status === 200) {
            setAllowReset(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);

          if (err.response.status === 401) {
            setResetError("Invalid reset link !!");
          }
          if (err.response.status === 400) {
            setResetError("Reset Link expired");
          }
        });
    }
    checkToken(props.token);
  }, []);
  const [error, setError] = React.useState({});
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    onSubmit: (value) => {
      setResetError();
      setLoading(true);
      axios
        .post("https://mobchat-2020.herokuapp.com/user/resetPassword", {
          resetToken: params.token,
          password: value.password,
        })
        .then((res) => {
          if (res.status === 200) {
            navigate("/signin");
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.status === 401) {
            setResetError("Invalid reset link");
          }
          if (err.response.status === 400) {
            setResetError("Reset link expired");
          }
        });
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(2, "Too Short!")
        .max(10, "Too Long!")
        .required("Required"),
    }),
  });
  return (
    <div style={{ backgroundColor: "#3b3b38", height: window.innerHeight }}>
      <div className="sty">
        {!loading ? (
          <>
            {allowReset ? (
              <FormikProvider value={formik}>
                <Form>
                  <TextInput
                    label="New Password"
                    id="password"
                    name="password"
                    helpText="Change key of your account"
                    type="password"
                    errorText={error.password}
                  />
                  <div>
                    <button type="submit">Reset Password</button>
                  </div>
                </Form>
              </FormikProvider>
            ) : (
              <> {resetError ? <p>{resetError}</p> : null}</>
            )}
            <Link to="/signin">Having an account?</Link>
          </>
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </div>
  );
};
export default Reset;
