import React from "react";
import { Form, useFormik, FormikProvider } from "formik";
import "./styles.css";
import * as Yup from "yup";
import "./screen.css";
import axios from "axios";
import { navigate, Link } from "@reach/router";
import TextInput from "./TextInput";
import { useDispatch } from "react-redux";
import "./loader.css";
import { addUser } from "../redux/user/action";
const SignUp = () => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (localStorage.getItem("mobchat_token")) {
      navigate("/");
    }
  }, []);
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const dispatch = useDispatch();
  const [error, setError] = React.useState({});
  const formik = useFormik({
    initialValues: {
      username: "",
      emailId: "",
      password: "",
      mobileNo: "",
    },
    onSubmit: (value) => {
      setLoading(true);
      axios
        .post("https://mobchat-2020.herokuapp.com/user/signup", value)
        .then((res) => {
          dispatch(addUser(res.data));
          console.log(res);
          navigate("/otp", {
            state: {
              auth: {
                username: res.data.user_.username,
                emailId: res.data.user_.emailId,
              },
            },
          });
          setError(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.username === value.username) {
            setError((prevState) => {
              return { ...prevState, username: "Username already taken" };
            });
          }

          if (err.response.data.emailId === value.emailId) {
            setError((prevState) => {
              return { ...prevState, emailId: "EmailId already taken" };
            });
          }
          if (err.response.data.mobileNo === value.mobileNo) {
            setError((prevState) => {
              return { ...prevState, mobileNo: "Mobile number already taken" };
            });
          }

          if (err.response.status === 400) {
            setError({ error: err.response.data.message });
          }
        });
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, "Too short!")
        .max(10, "Too long!")
        .required("Username required"),
      emailId: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(4, "Too Short!")
        .max(10, "Too Long!")
        .required("Required"),
      mobileNo: Yup.string()
        .required("required")
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "To short")
        .max(10, "To long"),
    }),
  });

  return (
    <div style={{ backgroundColor: "#3b3b38", height: window.innerHeight }}>
      <div className="sty">
        {!loading ? (
          <>
            <FormikProvider value={formik}>
              <Form>
                <TextInput
                  label="Username"
                  id="username"
                  name="username"
                  helpText="A unique username"
                  type="text"
                  errorText={error.username}
                />
                <TextInput
                  label="Email-Id"
                  id="emailId"
                  name="emailId"
                  helpText="Your email address"
                  type="text"
                  errorText={error.emailId}
                />
                <TextInput
                  label="Password"
                  id="password"
                  name="password"
                  helpText="Please protect your account"
                  type="password"
                  errorText={error.password}
                />
                <TextInput
                  label="Mobile No"
                  id="mobileNo"
                  name="mobileNo"
                  helpText="Your mobile number"
                  type="text"
                  errorText={error.mobileNo}
                />
                <div>
                  <button type="submit">Sign up</button>
                </div>
              </Form>
            </FormikProvider>
            <Link to="/signin">Having an account?</Link>
          </>
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </div>
  );
};
export default SignUp;
