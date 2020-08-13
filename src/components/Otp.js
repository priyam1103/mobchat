import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, useFormik, FormikProvider } from "formik";
import TextInput from "./TextInput";
import axios from "axios";
import * as Yup from "yup";
import { addUser } from "../redux/user/action";
import { navigate } from "@reach/router";
let error = {};
const Otp = ({ location }) => {
  const [error, setError] = React.useState({});
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  React.useEffect(() => {
    if (user.user) {
    } else {
      navigate("/signup");
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    onSubmit: (value) => {
      axios
        .post("http://localhost:3001/user/verify", {
          otp: value.otp,
          emailId: location.state.auth.emailId,
        })
        .then((res) => {
          dispatch(addUser(res.data));

          navigate("/");
          console.log(user);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            setError({ otp: err.response.data.message });
          }
        });
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .min(0, "Too Short!")
        .max(15, "Too Long!")
        .required("Required"),
    }),
  });

  return (
    <FormikProvider value={formik}>
      <div>
        Hi {location.state.auth.username} , please enter otp to continue...
      </div>
      <Form>
        <TextInput
          label="otp"
          id="otp"
          name="otp"
          helpText="Enter otp"
          type="text"
          errorText={error.otp}
        />

        <div>
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </Form>
    </FormikProvider>
  );
};
export default Otp;
