import React, { useEffect, useState } from "react";
import axios from "axios";
import address from "./address";
import "../styles/loginpage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [a, seta] = useState("btn white-btn");
  const [b, setb] = useState("btn");
  const [x, setx] = useState({ left: "4px", opacity: "1" });
  const [y, sety] = useState({ right: "-520px", opacity: "0" });
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [logDetails, setLogDetails] = useState({
    loginUsername: "",
    loginPassword: "",
  });
  const [details, setDetails] = useState({
    registerFirstname: "",
    registerLastname: "",
    registerUsername: "",
    registerPassword: "",
    registerConfirmPassword: "",
  });

  function displayLogin(e) {
    seta("btn white-btn");
    setb("btn");
    setx({ left: "4px", opacity: "1" });
    sety({ right: "-520px", opacity: "0" });
  }

  function displayRegister(e) {
    seta("btn");
    setb("btn white-btn");
    setx({ left: "-510px", opacity: "0" });
    sety({ right: "5px", opacity: "1" });
  }

  async function handleLogin() {
    //check if all fields are filled
    if (!(logDetails.loginUsername && logDetails.loginPassword)) {
      alert("Please fill all fields!");
      return;
    }

    //create req
    const loginReq = await axios.post(address + "/api/login", logDetails);

    //check if user exists
    console.log(loginReq.data);
    if (!(loginReq.data.status === "ok")) {
      alert("Wrong Credentials!");
      setLogDetails({
        loginUsername: "",
        loginPassword: "",
      });
      return;
    }

    //login if all ok
    navigate("/homepage/" + logDetails.loginUsername);
  }

  async function handleRegister() {
    //check if all fields are filled
    if (
      !(
        details.registerFirstname &&
        details.registerLastname &&
        details.registerUsername &&
        details.registerPassword
      )
    ) {
      setErrorMsg("Fill all fields");
      setBtnDisabled(true);
    }

    //create req
    console.log("Register:", details);
    const regisReq = await axios.post(address + "/api/register", details);
    console.log("Response from regisReq", regisReq.data);

    //check for integrity error
    if (regisReq.data.status.sqlState === "23000") {
      alert("Username already in use");
      return;
    }

    //get confirmation of ok
    if (regisReq.data.status === "ok") {
      alert("Created Successfully :D");
      setDetails({
        registerFirstname: "",
        registerLastname: "",
        registerUsername: "",
        registerPassword: "",
        registerConfirmPassword: "",
      });
      setBtnDisabled(true);
    }
    //show login screen
    displayLogin();
  }

  function handleLoginChange(e) {
    setLogDetails((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  function handleRegisterChange(e) {
    setDetails((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  //validate password of register section
  useEffect(() => {
    if (!details.registerPassword) {
      return;
    }
    // if (details.registerPassword.length < 8) {
    //   setErrorMsg("Password must have 8 characters");
    //   setBtnDisabled(true);
    //   return;
    // }
    // const regx = /([!-/]|[:-@])/;
    // const regx2 = /[\d]/;
    // if (!regx.test(details.registerPassword)) {
    //   setErrorMsg("Password must have special characters");
    //   setBtnDisabled(true);
    //   return;
    // }
    // if (!regx2.test(details.registerPassword)) {
    //   setErrorMsg("Password must have numeric characters");
    //   setBtnDisabled(true);
    //   return;
    // }
    // if (details.registerPassword !== details.registerConfirmPassword) {
    //   setErrorMsg("Password do not match");
    //   setBtnDisabled(true);
    //   return;
    // }
    setErrorMsg("");
    setBtnDisabled(false);
  }, [details]);

  return (
    <section id="main-con-login">
      <div className="wrapper">
        <nav className="nav">
          <div className="nav-button">
            <button
              className={a}
              id="loginBtn"
              onClick={(e) => displayLogin(e)}
            >
              Login
            </button>
            <button
              className={b}
              id="registerBtn"
              onClick={(e) => displayRegister(e)}
            >
              Sign Up
            </button>
          </div>
        </nav>

        <div className="form-box">
          <div className="login-container" id="login" style={x}>
            <div className="top">
              <header>Login</header>
            </div>

            <div className="input-box">
              <input
                type="text"
                className="input-field"
                placeholder="Username"
                id="loginUsername"
                onChange={(e) => {
                  handleLoginChange(e);
                }}
                value={logDetails.loginUsername}
              />
              <i className="bx bx-user"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                id="loginPassword"
                onChange={(e) => {
                  handleLoginChange(e);
                }}
                value={logDetails.loginPassword}
              />
              <i className="bx bx-lock-alt"></i>
            </div>

            <div className="input-box">
              <input
                type="submit"
                className="submit"
                value="Login"
                onClick={handleLogin}
              />
            </div>
          </div>

          <div className="register-container" id="register" style={y}>
            <div className="top">
              <header>Sign Up</header>
            </div>

            <div className="two-forms">
              <div className="input-box">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Firstname"
                  id="registerFirstname"
                  value={details.registerFirstname}
                  onChange={(e) => {
                    handleRegisterChange(e);
                  }}
                />
                <i className="bx bx-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Lastname"
                  id="registerLastname"
                  value={details.registerLastname}
                  onChange={(e) => {
                    handleRegisterChange(e);
                  }}
                />
                <i className="bx bx-user"></i>
              </div>
            </div>

            <div className="input-box">
              <input
                type="text"
                className="input-field"
                placeholder="Username"
                id="registerUsername"
                value={details.registerUsername}
                onChange={(e) => {
                  handleRegisterChange(e);
                }}
              />
              <i className="bx bx-envelope"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                id="registerPassword"
                value={details.registerPassword}
                onInput={(e) => handleRegisterChange(e)}
              />
              <i className="bx bx-lock-alt"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                className="input-field"
                placeholder="Confirm Password"
                id="registerConfirmPassword"
                value={details.registerConfirmPassword}
                onInput={(e) => handleRegisterChange(e)}
              />
              <i className="bx bx-lock-alt"></i>
              <p id="error-message">{errorMsg}</p>
            </div>

            <div className="input-box">
              <input
                type="submit"
                className="submit"
                value="Register"
                id="signup"
                onClick={handleRegister}
                disabled={btnDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
