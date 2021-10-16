import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "../cssfiles/auth.css";
import { stateContext } from "../App";
import { setToken } from "../Token";
import axios from "axios";
import Error from "./Error";
import Loader from "./Loader";

function Login(props) {
  const history = useHistory();
  const { state, dispatch } = useContext(stateContext);
  const [localState, setLocalState] = useState({
    loading: false,
    error: false,
    msg: null,
  });
  const [auth_details, setAuthDetails] = useState({
    name: "",
    password: "",
  });

  //--------------------------submit handler-------------------
  function submitHandler(e) {
    e.preventDefault();
    let name = auth_details.name.trim();
    let password = auth_details.password.trim();

    setLocalState((prev) => ({ ...prev, loading: true }));
    let data = { name, password };
    axios
      .post("/api/login", data)
      .then((response) => {
        if (response.data.res) {
          setToken(response.data.id);
          dispatch({ type: "login", payload: { id: response.data.id } });
          history.push("/profile");
        } else
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
        <h2>Login</h2>
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

        <input type="submit" />
        <p id="footer">
          Don't have an account?
          <Link to="/"> Register here </Link>
        </p>
      </form>
    </>
  );
}

export default Login;
