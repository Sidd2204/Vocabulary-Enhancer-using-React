import React from "react";
import "../styles/landingpage.css";
import logo from "../images/logo.png";
import review1 from "../images/review1.png";
import score from "../images/score.png";
import auto1 from "../images/auto1.png";
import { useNavigate } from "react-router-dom";

function Landingpage() {
  const navigate = useNavigate();

  function goToLogin() {
    navigate("/login");
  }

  return (
    <section id="main-con-landing">
      <section className="header">
        <nav>
          <a href="/">
            <img src={logo} alt="Vocablearn" />
          </a>

          <div className="nav-links">
            <ul>
              <li>
                <p className="nav-p" onClick={goToLogin}>
                  LOGIN
                </p>
              </li>
              --
              <li>
                <p
                  className="nav-p"
                  onClick={() => {
                    window.scrollTo(0, 1524);
                  }}
                >
                  ABOUT
                </p>
              </li>
              --
            </ul>
          </div>
        </nav>

        <div className="text-box">
          <h1>English Vocabulary Enhancer</h1>
          <p>
            This website is designed to help users expand and improve their
            English language skills. By using this tool regularly, users can
            significantly increase their vocabulary, aiding in better
            communication and comprehension.
          </p>

          <p
            onClick={() => {
              window.scrollTo(0, 924);
            }}
            className="btn"
          >
            Know More
          </p>
        </div>
      </section>

      <section className="features" id="jump">
        <h1>Why Choose Vocablearn ?</h1>
        <p>
          Vocablearn has various features for improved and better user
          experience.
        </p>

        <div className="row">
          <div className="features-col">
            <h3>Word Review</h3>
            <img src={review1} alt="" />
            <p>
              The user can go thought the words that they have mastered , hence
              can be revised.
            </p>
          </div>

          <div className="features-col">
            <h3>Score Viewing</h3>
            <img src={score} alt="" />
            <p>
              Based upon the progress and performance of the user, scores will
              be alloted and can be viewed in the form of graphs.
            </p>
          </div>

          <div className="features-col">
            <h3>Auto Word Adjustment</h3>
            <img src={auto1} alt="" />
            <p>
              According to the performance of the user, the difficulty level is
              altered by the model automatically.
            </p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h1>New User ?</h1>
        <p onClick={goToLogin} className="btn">
          Get Started
        </p>
      </section>

      <section className="footer" id="jumpp">
        <h4>About Us</h4>
        <p>
          gaurisasikumar04@gmail.com
          <br />
          A. P. Shah Institute Of Technology
        </p>
        <div className="icons">
          <i className="fa fa-facebook"></i>
          <i className="fa fa-twitter"></i>
          <i className="fa fa-instagram"></i>
          <i className="fa fa-linkedin"></i>
        </div>
      </section>
    </section>
  );
}

export default Landingpage;
