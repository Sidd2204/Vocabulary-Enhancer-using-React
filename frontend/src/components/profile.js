import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import axios from "axios";
import address from ".bin/address";
import { useLocation, useNavigate } from "react-router-dom";

export default function Profile() {
  const location = useLocation();
  let username = location.pathname.split("/");
  username = username[username.length - 1];

  const navigate = useNavigate();

  const [fieldDisabled, setFieldDisabled] = useState(true);

  const [profileData, setProfileData] = useState({
    username: "",
    fname: "",
    lname: "",
    joining: "",
    userlevel: 0,
  });

  useEffect(() => {
    async function profileFetch() {
      const profileReq = await axios.get(
        address + "/api/getProfile/" + username
      );
      console.log("Initial Profile Fetch", profileReq.data);
      setProfileData(profileReq.data);
    }
    profileFetch();
  }, []);

  function handleChange(e) {
    setProfileData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function saveChanges() {
    setFieldDisabled(true);
    console.log("Final Profile Post", profileData);

    const profReq = await axios.post(
      address + "/api/updateProfile",
      profileData
    );
    if (profReq.data.status === "ok") {
      alert("Details updated successfully");
    } else {
      alert("Something went wrong\n" + String(profReq.data.status));
    }
  }

  function editProfile() {
    setFieldDisabled(false);
  }

  function goToHome() {
    navigate("/homepage/" + username);
  }

  return (
    <section id="main-con-profile">
      <div className="page-content page-container" id="page-content">
        <div className="padding">
          <div className="row container d-flex justify-content-center">
            <div className="col-xl-8 col-md-10">
              <div className="card user-card-full">
                <div className="row m-l-0 m-r-0">
                  <div className="col-sm-4 bg-c-lite-green user-profile">
                    <img
                      id="icon"
                      src={require("../images/logo.png")}
                      alt="logo"
                    />
                    <div className="card-block text-center text-white">
                      <div className="m-b-25">
                        <img
                          id="profile-pic"
                          src="https://img.icons8.com/bubbles/100/000000/user.png"
                          className="img-radius"
                          alt="User-Profile-Image"
                        />
                      </div>
                      <h1 id="dev1" className="f-w-600">
                        Welcome to Your Profile
                      </h1>
                      <h2 id="dev1" className="f-w-600">
                        You are currently at level {profileData.userlevel}
                      </h2>
                    </div>
                    <p>
                      Joined Since:{" "}
                      {new Date(profileData.joining)
                        .toString()
                        .substring(4, 15)
                        .split(" ")
                        .join("-")}{" "}
                    </p>
                  </div>
                  <div className="col-sm-8">
                    <div className="card-block">
                      <h6 className="m-b-20 p-b-5 b-b-default f-w-600">
                        Information
                      </h6>
                      <div className="row">
                        <div className="col-sm-6">
                          <p className="m-b-10 f-w-600">Username</p>
                          <input
                            type="text"
                            id="username"
                            className="form-control info-fields"
                            value={profileData.username}
                            placeholder="Enter your username"
                            disabled={true}
                          />
                        </div>
                        <div className="col-sm-6">
                          <p className="m-b-10 f-w-600">First Name</p>
                          <input
                            type="text"
                            id="fname"
                            className="form-control info-fields"
                            value={profileData.fname}
                            placeholder="Enter your First Name"
                            disabled={fieldDisabled}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          />
                        </div>
                        <div className="col-sm-6">
                          <p className="m-b-10 f-w-600">Last Name</p>
                          <input
                            type="text"
                            id="lname"
                            className="form-control info-fields"
                            value={profileData.lname}
                            placeholder="Enter your Last Name"
                            disabled={fieldDisabled}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          />
                        </div>
                      </div>
                      <div id="btn-container">
                        <button
                          id="edit-btn"
                          className="btn btn-success btn-block m-t-40"
                          onClick={editProfile}
                          disabled={!fieldDisabled}
                        >
                          Edit Profile
                        </button>
                        <button
                          id="save-btn"
                          className="btn btn-success btn-block m-t-40"
                          onClick={saveChanges}
                          disabled={fieldDisabled}
                        >
                          Save Changes
                        </button>
                        <button
                          id="save-btn"
                          className="btn btn-success btn-block m-t-40"
                          onClick={goToHome}
                        >
                          Return To Home
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
