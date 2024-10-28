import React, { useEffect, useState } from "react";
import "../styles/homepage.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import address from ".bin/address";

function Homepage() {
  const [username, setUsername] = useState("");
  const [streakCount, setStreakCount] = useState(0);
  const [toggleMenu, setToggleMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    setToggleMenu(!toggleMenu);
    navigate("/");
  }
  function openLearn() {
    navigate("/learn/" + username);
  }

  function openReview() {
    navigate("/review/" + username);
  }

  function openStats() {
    navigate("/stats/" + username);
  }

  function openProfile() {
    navigate("/profile/" + username);
  }

  // document.addEventListener("DOMContentLoaded", getstreak);

  // async function getstreak() {
  //   username = window.location.href;
  //   username = username.split("/");
  //   username = username[username.length - 1];

  //   let streakreq = await fetch(`http://127.0.0.1:5000/getstreak/${username}`);
  //   if (!streakreq.ok) {
  //     alert("RESULT NOT OK!");
  //     return;
  //   }

  //   let streak = await streakreq.json();
  //   document.getElementById("streakdays").innerText = streak.streak_count;
  // }

  useEffect(() => {
    let un = location.pathname.split("/");
    setUsername(un[un.length - 1]);

    async function getStreak() {
      const streakReq = await axios.get(
        address + "/api/getStreaks/" + un[un.length - 1]
      );

      console.log("Streak req:", streakReq.data);
      setStreakCount(streakReq.data.streak_count);
    }

    getStreak();
  }, [location]);

  return (
    <section id="main-con-homepage">
      <div className="head">
        <nav>
          <img src={require("../images/logo.png")} className="logo" alt="" />
          <div className="streak">
            <h2 id="streakdays">{streakCount}</h2>
            <img src={require("../images/streak.png")} alt="" />
          </div>

          <img
            src={require("../images/user.png")}
            className="user-pic"
            onClick={() => {
              setToggleMenu(!toggleMenu);
            }}
            alt=""
          />

          <div
            className={"sub-menu-wrap " + (toggleMenu ? "open-menu" : "")}
            id="submenu"
          >
            <div className="sub-menu">
              <div className="user-info">
                <img src={require("../images/user.png")} alt="" />
                <h3>{username}</h3>
              </div>

              <hr />

              <div className="sub-menu-link" onClick={openProfile}>
                <img src={require("../images/profile.png")} alt="" />
                <p>Edit profile</p>
                <span></span>
              </div>
              <div className="sub-menu-link" onClick={logout}>
                <img src={require("../images/logout.png")} alt="" />
                <p>Logout</p>
                <span></span>
              </div>
            </div>
          </div>
        </nav>

        <section className="features">
          <div className="row">
            <div className="features-col" onClick={openLearn}>
              <img src={require("../images/h1.png")} alt="" />
              <div className="layer">
                <h3>Learn</h3>
              </div>
            </div>

            <div className="features-col" onClick={openReview}>
              <img src={require("../images/h2.png")} alt="" />
              <div className="layer">
                <h3>Review</h3>
              </div>
            </div>

            <div className="features-col" onClick={openStats}>
              <img src={require("../images/h3.png")} alt="" />
              <div className="layer">
                <h3>Your Scores</h3>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Homepage;
