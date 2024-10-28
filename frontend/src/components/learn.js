import React, { useEffect, useState } from "react";
import "../styles/learn.css";
import axios from "axios";
import address from ".bin/address";
import { useLocation, useNavigate } from "react-router-dom";

function Learn() {
  const [isFlipped, setFlipped] = useState(false);
  const [wordNum, setWordNum] = useState(0);
  const [username, setUsername] = useState("");
  const [words, setWords] = useState([{}]);
  const [streaks, setStreaks] = useState();
  const [scores, setScores] = useState({ score5: 0 });
  const [userlevel, setUserlevel] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    //set username
    let un = location.pathname.split("/");
    setUsername(un[un.length - 1]);

    //fetch request function
    async function fetchReq() {
      //GET WORDS
      const wdReq = await axios.get(
        address + "/api/getwords/" + un[un.length - 1]
      );
      setWords(wdReq.data);
      console.log("Initial Words Fetch:", wdReq.data);

      //GET STREAKS
      const streaksReq = await axios.get(
        address + "/api/getStreaks/" + un[un.length - 1]
      );
      setStreaks(streaksReq.data);
      console.log("Initial Streak Fetch:", streaksReq.data);

      //GET SCORES
      const scoresReq = await axios.get(
        address + "/api/getScores/" + un[un.length - 1]
      );
      let scores = scoresReq.data;
      scores.score1 = scores.score2;
      scores.score2 = scores.score3;
      scores.score3 = scores.score4;
      scores.score4 = scores.score5;
      scores.score5 = 0;
      setScores(scores);
      console.log("Initial Scores Fetch:", scoresReq.data);

      //GET USERLEVEL
      const userlevelReq = await axios.get(
        address + "/api/getUserlevel/" + un[un.length - 1]
      );
      setUserlevel(userlevelReq.data);
      console.log("Initial Userlevel Fetch:", userlevelReq.data);
    }

    fetchReq();
  }, []);

  async function handleAnswer(answer) {
    if (answer === 1) {
      words[wordNum].correct_answers += 1;

      if (words[wordNum].box_level < 5) {
        words[wordNum].box_level += 1;
      }

      scores.score5 += 100;
      console.log("I KNOW", scores.score5);
    } else {
      words[wordNum].incorrect_answers += 1;

      if (words[wordNum].box_level > 1) {
        words[wordNum].box_level -= 1;
      }

      scores.score5 -= 50;
      console.log("I DON'T KNOW", scores.score5);
    }

    //If all words and traversed
    if (wordNum === 4) {
      // Decision for adjusting userlevel
      if (scores.score5 > 300 && userlevel.userlevel < 4) {
        userlevel.userlevel += 1;
      } else if (scores.score5 < 0 && userlevel.userlevel > 1) {
        userlevel.userlevel -= 1;
      }
      if (scores.score5 < 0) {
        scores.score5 = 0;
      }

      //Decision for streaks
      const newLastStreak = new Date().getTime();
      const timeElapsed = newLastStreak - Number(streaks.laststreak);
      if (timeElapsed > 2 * 86400000) {
        streaks.streak_count = 1;
        streaks.laststreak = String(newLastStreak);
      } else if (timeElapsed > 86400000) {
        streaks.streak_count += 1;
        streaks.laststreak = String(newLastStreak);
      }

      //Update everything in database
      console.log("Final Words Post:", words);
      console.log("Final Streaks Post:", streaks);
      console.log("Final Scores Post:", scores);
      console.log("Final Userlevel Post:", userlevel);

      //Post word req
      const wordPost = await axios.post(address + "/api/updateWords", words);
      if (wordPost.data.status !== "ok") {
        alert("Something went wrong while updating words");
        return;
      }

      //Post streaks
      const streaksPost = await axios.post(
        address + "/api/updateStreaks",
        streaks
      );
      if (streaksPost.data.status !== "ok") {
        alert("Something went wrong while updating streaks");
        return;
      }

      //Post scores
      const scoresPost = await axios.post(
        address + "/api/updateScores",
        scores
      );
      if (scoresPost.data.status !== "ok") {
        alert("Something went wrong while updating scores");
        return;
      }

      //Post Userlevel
      const userlevelPost = await axios.post(
        address + "/api/updateUserlevel",
        userlevel
      );
      if (userlevelPost.data.status !== "ok") {
        alert("Something went wrong while updating userlevel");
        return;
      }

      alert("Your score is " + String(scores.score5));
      navigate("/homepage/" + username);
      return;
    }

    //Flip Card after answer and display next
    setFlipped(false);
    await new Promise((r) => setTimeout(r, 340));
    setWordNum((prev) => {
      return prev + 1;
    });
  }

  return (
    <section id="main-con-learn">
      <section className="header">
        <div className="card-container">
          <div
            className={"card " + (isFlipped ? "is-flipped" : "")}
            id="flipCard"
            onClick={() => {
              setFlipped(!isFlipped);
            }}
          >
            <div className="card-face card-front" id="word">
              {words[wordNum].word}
            </div>
            <div className="card-face card-back" id="meaning">
              {words[wordNum].meaning}
            </div>
          </div>

          <div
            className={"button-container " + (isFlipped ? "show-buttons" : "")}
            id="buttonContainer"
          >
            <button
              className="btn know-btn"
              onClick={() => {
                handleAnswer(1);
              }}
            >
              I know this word
            </button>
            <button
              className="btn dont-know-btn"
              onClick={() => {
                handleAnswer(0);
              }}
            >
              I don't know this word
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Learn;
