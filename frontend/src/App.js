import React, { useReducer, createContext } from "react";
import { Reducer } from "./Reducer";
import { getToken } from "./Token";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
export const stateContext = createContext();

function App() {
  const [state, dispatch] = useReducer(Reducer, {
    id: getToken(),
  });
  console.log(state);
  return (
    <Router>
      <stateContext.Provider value={{ state, dispatch }}>
        <Switch>
          <Route exact path="/">
            {state.id ? <Redirect to="/profile" /> : <Register />}
          </Route>
          <Route exact path="/login">
            {state.id ? <Redirect to="/profile" /> : <Login />}
          </Route>
          <Route exact path="/profile">
            {!state.id ? <Redirect to="/login" /> : <Profile />}
          </Route>
        </Switch>
      </stateContext.Provider>
    </Router>
  );
}

export default App;
