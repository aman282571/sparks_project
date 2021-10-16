import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../cssfiles/auth.css";
import axios from "axios";
import Error from "./Error";
import Loader from "./Loader";

function Register(props) {
  const history = useHistory();
  const [localState, setLocalState] = useState({
    loading: false,
    error: false,
    msg: null,
  });
  const [auth_details, setAuthDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  function changeLocalStateMsg(msg) {
    setLocalState((prev) => ({
      ...prev,
      msg: msg,
    }));
  }
  //--------------------------submit handler-------------------
  function submitHandler(e) {
    e.preventDefault();
    let name = auth_details.name.trim();
    let email = auth_details.email.trim();
    let password = auth_details.password.trim();
    let confirm_password = auth_details.confirm_password.trim();
    console.log("here");
    if (password !== confirm_password)
      changeLocalStateMsg("Password and Confirm Password does not match");
    else if (password.length < 8)
      changeLocalStateMsg("Minimum password length should be 8");
    else {
      setLocalState((prev) => ({ ...prev, loading: true }));
      let data = { name, email, password };
      axios
        .post("/api/register", data)
        .then((response) => {
          console.log(response);
          if (response.data.res) history.push("/login");
          else
            setLocalState((prev) => ({
              ...prev,
              loading: false,
              msg: response.data.msg,
            }));
        })
        .catch((error) => {
          setLocalState((prev) => ({ ...prev, loading: false, error: true }));
        });
    }
  }
  //-------------------field change handler--------------------
  function fieldChangeHandler(e) {
    setAuthDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    setLocalState((prev) => ({
      loading: false,
      error: false,
      msg: null,
    }));
  }
  return auth_details.loading ? (
    <Loader />
  ) : auth_details.error ? (
    <Error />
  ) : (
    <>
      {localState.msg ? <p id="error_msg">{localState.msg}</p> : ""}
      <form
        id="register_form"
        className="register_form"
        onSubmit={submitHandler}
      >
        <h2>Register</h2>
        <p>
          <label htmlFor="name">Username:</label>
        </p>
        <input
          type="text"
          name="name"
          value={auth_details.name}
          id="username"
          required
          onChange={fieldChangeHandler}
        />
        <p>
          <label htmlFor="email">Email:</label>
        </p>
        <input
          type="email"
          name="email"
          id="email"
          value={auth_details.email}
          required
          onChange={fieldChangeHandler}
        />
        <p>
          <label htmlFor="password">Password:</label>
        </p>
        <input
          type="password"
          name="password"
          id="password"
          value={auth_details.password}
          required
          onChange={fieldChangeHandler}
        />
        <p>
          <label htmlFor="confirm_password">Confirm Password:</label>
        </p>
        <input
          type="password"
          name="confirm_password"
          id="confirm_password"
          value={auth_details.confirm_password}
          required
          onChange={fieldChangeHandler}
        />
        <input type="submit" />
        <p id="footer">
          Have an account?
          <Link to="/login"> Login here </Link>
        </p>
      </form>
    </>
  );
}

export default Register;
