import React from "react";
import { Form, useFormik, FormikProvider } from "formik";
import "./styles.css";
import * as Yup from "yup";
import axios from "axios";
import { navigate, redirectTo } from "@reach/router";
import TextInput from "./TextInput";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/user/action";

const Signin = () => {
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
      console.log(value);
      axios
        .post("http://localhost:3001/user/signin", value)
        .then((res) => {
          dispatch(addUser(res.data));
          console.log(res);
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
        })
        .catch((err) => {
          console.log(err.response);

          //   if (err.response.data.username === value.username) {
          //     setError((prevState) => {
          //       return { ...prevState, username: "Username already taken" };
          //     });
          //   }

          //   if (err.response.data.emailId === value.emailId) {
          //     setError((prevState) => {
          //       return { ...prevState, emailId: "EmailId already taken" };
          //     });
          //   }
          //   if (err.response.data.mobileNo === value.mobileNo) {
          //     setError((prevState) => {
          //       return { ...prevState, mobileNo: "Mobile number already taken" };
          //     });
          //   }

          //   if (err.response.status === 400) {
          //     setError({ error: err.response.data.message });
          //   }
        });
    },
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
          label="password"
          id="password"
          name="password"
          helpText="enter"
          type="text"
          errorText={error.password}
        />

        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default Signin;
