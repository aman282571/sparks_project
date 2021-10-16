import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { stateContext } from "../App";
import Loader from "./Loader";
import Error from "./Error";
import "../cssfiles/Profile.css";
function Profile(props) {
  const history = useHistory();
  const { state, dispatch } = useContext(stateContext);
  const [edit, setEdit] = useState(false);
  const [localState, setLocalState] = useState({
    loading: true,
    error: false,
    data: null,
    msg: null,
  });
  function logout() {
    localStorage.removeItem("id");

    dispatch({ type: "logout" });
    history.push("/");
  }
  function deleteAccount() {
    let response = window.confirm(
      "Your account will be deleted after this action"
    );
    if (!response) return;
    fetch(`/api/deleteaccount/${state.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setLocalState((prev) => ({
            data: null,
            loading: false,
            error: true,
            msg: null,
          }));
        } else {
          localStorage.removeItem("id");
          dispatch({ type: "logout" });
          history.push("/");
        }
      })
      .catch((err) => {
        setLocalState((prev) => ({
          data: null,
          loading: false,
          error: true,
          msg: null,
        }));
      });
  }
  function saveHandler() {
    let e = document.getElementById("input_file");
    let reader = new FileReader();
    if (e.files.length === 0) {
      setLocalState((prev) => ({
        ...prev,
        msg: "Upload image !!",
      }));
      setTimeout(() => {
        setLocalState((prev) => ({
          ...prev,
          msg: null,
        }));
      }, 5000);
      return;
    }
    let file = e.files[0];
    let mimeTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/tiff",
      "image/jpg",
    ];
    if (mimeTypes.indexOf(file.type) !== -1) {
      reader.readAsDataURL(file);
      reader.onload = function () {
        setLocalState((prev) => ({
          ...prev,
          loading: true,
          msg: null,
        }));
        fetch(`/api/updatePic/${state.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            img: reader.result,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res.error) {
              setLocalState((prev) => ({
                ...prev,
                msg: res.error,
              }));
            } else {
              history.go(0);
            }
          })
          .catch((err) => {
            setLocalState((prev) => ({
              ...prev,
              error: "Something went wrong",
            }));
          });
      };
      reader.onerror = function () {
        setLocalState((prev) => ({
          ...prev,
          msg: "Some thing went wrong. Try Again",
        }));
      };
    } else {
      setLocalState((prev) => ({
        ...prev,
        msg: "You can only upload image..",
      }));
    }
  }
  function deleteHandler() {
    setLocalState((prev) => ({
      ...prev,
      loading: true,
      msg: null,
    }));
    fetch(`/api/deletePic/${state.id}`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.error) {
          setLocalState((prev) => ({
            ...prev,
            msg: res.error,
          }));
        } else {
          history.go(0);
        }
      })
      .catch((err) => {
        setLocalState((prev) => ({
          ...prev,
          error: "Something went wrong",
        }));
      });
  }

  useEffect(() => {
    fetch(`/api/user/${state.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.log(res);
          setLocalState((prev) => ({
            data: null,
            loading: false,
            error: true,
            msg: null,
          }));
        } else {
          setLocalState((prev) => ({
            loading: false,
            error: false,
            msg: null,
            data: res.data,
          }));
        }
      })
      .catch((err) => {
        setLocalState((prev) => ({
          loading: false,
          error: true,
          data: null,
          msg: null,
        }));
      });
  }, [state.id]);
  return localState.error ? (
    <Error />
  ) : localState.loading ? (
    <Loader />
  ) : (
    <>
      {localState.msg ? <p id="error_msg">{localState.msg}</p> : ""}
      {edit ? (
        <>
          <div id="user_details">
            <div id="user_info">
              <input type="file" id="input_file" name="profile_pic" />
            </div>

            <p id="buttons">
              <span id="cancel_button" onClick={() => setEdit((prev) => !prev)}>
                Cancel
              </span>
              <span id="save_button" onClick={saveHandler}>
                Save
              </span>
            </p>
          </div>
        </>
      ) : (
        <>
          <p id="logout" onClick={logout}>
            Log Out
          </p>
          <div id="user_details">
            <div id="user_info">
              {localState.data.img ? (
                <img src={localState.data.img} alt="" id="profile_photo" />
              ) : (
                <img alt="" id="profile_photo" />
              )}

              <p id="name">{localState.data.name}</p>
            </div>

            <p id="buttons">
              <span id="edit_button" onClick={() => setEdit((prev) => !prev)}>
                Edit
              </span>
              <span id="delete_button" onClick={deleteAccount}>
                Delete account
              </span>
              {localState.data.img ? (
                <span id="delete_button" onClick={deleteHandler}>
                  Delete Pic
                </span>
              ) : (
                ""
              )}
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default Profile;
