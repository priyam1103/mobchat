import React from "react";
import { Form, useFormik, FormikProvider } from "formik";
import "./styles.css";
import * as Yup from "yup";
import axios from "axios";
import { navigate, redirectTo } from "@reach/router";
import TextInput from "./TextInput";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/user/action";
let error = {};
const SignUp = () => {
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
      emailId: "",
      password: "",
      mobileNo: "",
    },
    onSubmit: (value) => {
      axios
        .post("http://localhost:3001/user/signup", value)
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
        })
        .catch((err) => {
          console.log(err);
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
        .min(2, "Too Short!")
        .max(10, "Too Long!")
        .required("Required"),
      mobileNo: Yup.string()
        .min(2, "Too Short!")
        .max(10, "Too Long!")
        .required("Required"),
    }),
  });

  return (
    <FormikProvider value={formik}>
      <Form>
        <TextInput
          label="username"
          id="username"
          name="username"
          helpText="enter"
          type="text"
          errorText={error.username}
        />
        <TextInput
          label="emailId"
          id="emailId"
          name="emailId"
          helpText="enter"
          type="text"
          errorText={error.emailId}
        />
        <TextInput
          label="password"
          id="password"
          name="password"
          helpText="enter"
          type="text"
          errorText={error.password}
        />
        <TextInput
          label="mobileNo"
          id="mobileNo"
          name="mobileNo"
          helpText="enter"
          type="text"
          errorText={error.mobileNo}
        />
        <div>
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </Form>
    </FormikProvider>
  );
};
export default SignUp;
