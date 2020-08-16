import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, useFormik, FormikProvider } from "formik";
import TextInput from "./TextInput";
import axios from "axios";
import * as Yup from "yup";
import "./screen.css";
import { addUser } from "../redux/user/action";
import { navigate, Link } from "@reach/router";
import "./loader.css";
const Otp = ({ location }) => {
  const [error, setError] = React.useState({});
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (user.user && location.state != null) {
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
    <div style={{ backgroundColor: "#3b3b38", height: window.innerHeight }}>
      <div className="sty">
        {!loading ? (
          <>
            {location.state ? (
              <>
                <FormikProvider value={formik}>
                  <div>
                    Hi {location.state.auth.username} , Please enter the otp
                    sent to your email id.
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
                    </div>
                  </Form>
                </FormikProvider>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Link to="/signup">Don't have an account ?</Link>
                  <Link to="/signin">Having an account?</Link>
                </div>
              </>
            ) : null}
          </>
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </div>
  );
};
export default Otp;
