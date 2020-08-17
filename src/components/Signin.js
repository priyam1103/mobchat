import React from "react";
import { Form, useFormik, FormikProvider } from "formik";
import "./styles.css";
import axios from "axios";
import * as Yup from "yup";
import "./screen.css";
import { navigate, Link } from "@reach/router";
import TextInput from "./TextInput";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/user/action";
import "./loader.css";
const Signin = () => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (localStorage.getItem("mobchat_token")) {
      navigate("/");
    }
  }, []);
  const dispatch = useDispatch();
  const [error, setError] = React.useState({});
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (value) => {
      setLoading(true);
      axios
        .post("https://mobchat-2020.herokuapp.com/user/signin", value)
        .then((res) => {
          dispatch(addUser(res.data));
          if (!res.data.user_.verified) {
            navigate("/otp", {
              state: {
                auth: {
                  username: res.data.user_.username,
                  emailId: res.data.user_.emailId,
                },
              },
            });
          } else {
            navigate("/");
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError({});
          if (err.response.data.message === "username does not exists") {
            setError((prevState) => {
              return { ...prevState, username: "Username does not exists" };
            });
          }
          if (err.response.data.message === "Invalid password") {
            setError((prevState) => {
              return { ...prevState, password: "Invalid password" };
            });
          }
        });
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username required"),

      password: Yup.string().required(" Password required"),
    }),
  });

  return (
    <>
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
                    helpText="Your unique username"
                    type="text"
                    errorText={error.username}
                  />

                  <TextInput
                    label="Password"
                    id="password"
                    name="password"
                    helpText="Key to your account"
                    type="password"
                    errorText={error.password}
                  />

                  <div>
                    <button type="submit">Sign in</button>
                  </div>
                </Form>
              </FormikProvider>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Link to="/signup">Don't have an account ?</Link>
                <Link to="/resetPassword"> Forgot Password ? </Link>
              </div>
            </>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Signin;
