import React, { useEffect, useState } from "react";
import "../styles/review.css";
import axios from "axios";
import address from ".bin/address";
import { useLocation, useNavigate } from "react-router-dom";

export default function Review() {
  const [quizData, setQuizData] = useState([
    { question: "propitiate", options: ["", "", "", ""], correct: 0 },
  ]);
  const [currQ, setCurrQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const location = useLocation();
  let username = location.pathname.split("/");
  username = username[username.length - 1];
  const navigate = useNavigate();
  // let selectedOption = null;

  useEffect(() => {
    async function fetchWords() {
      //Get mastered words
      const masteredReq = await axios.get(
        address + "/api/getMasteredWords/" + username
      );
      const words = masteredReq.data;
      console.log("Mastered Words", words);

      //Create Quiz Data
      let quizData = [];
      for (let iter = 0; iter < 5; iter += 1) {
        let tempoptions = [
          words[(iter + 1) % 5].meaning,
          words[(iter + 2) % 5].meaning,
          words[(iter + 3) % 5].meaning,
        ];
        let rand = Math.floor(Math.random() * 4);
        tempoptions.splice(rand, 0, words[iter].meaning);

        let tempword = {
          question: words[iter].word,
          options: tempoptions,
          correct: rand,
          answeredCorrectly: 0,
        };

        quizData.push(tempword);
      }

      //Set quiz data
      console.log("Quiz Data", quizData);
      setQuizData(quizData);
      setCurrQ(0);
    }
    fetchWords();
  }, []);

  function nextQuestion() {
    if (selectedOption == null) {
      alert("Please select an option...");
      return;
    } else if (selectedOption === quizData[currQ].correct) {
      alert("Correct Answer");
      quizData[currQ].answeredCorrectly = 1;
    } else {
      alert("Incorrect Answer");
      quizData[currQ].answeredCorrectly = 0;
    }

    if (currQ < 4) {
      setCurrQ((prev) => prev + 1);
      setSelectedOption("");
    } else {
      let correctWords = "";
      let incorrectWords = "";

      quizData.forEach((question) => {
        if (question.answeredCorrectly === 1) {
          correctWords += question.question + " ";
        } else {
          incorrectWords += question.question + " ";
        }
      });

      alert(
        "Correctly Answered Questions:\n" +
          correctWords +
          "\n\nIncorrectly Answered Questions:\n" +
          incorrectWords
      );
      navigate("/homepage/" + username);
    }
  }

  // function setSelectedOption(optionNumber) {
  //   // e.target.checked = !e.target.checked;
  //   setSelectedOption(optionNumber);
  // }

  return (
    <section id="main-con-review">
      <div className="quiz-wrapper">
        <div className="quiz-container">
          <h2 id="question">
            {quizData[currQ].question ? quizData[currQ].question : ""}
          </h2>

          <div id="options-container">
            {quizData[currQ].options.map((option, index) => {
              return (
                <div className="option" key={index}>
                  <label
                    onClick={() => {
                      setSelectedOption(index);
                    }}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={quizData[currQ].correct}
                      checked={selectedOption === index}
                      readOnly={true}
                    />
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="navigation-buttons">
          {/* <button
            id="prevBtn"
            style={{ display: currQ ? "inline-block" : "none" }}
            onClick={prevQuestion}
          >
            Previous
          </button> */}
          <button
            id="nextBtn"
            style={{ display: currQ - 4 ? "inline-block" : "none" }}
            onClick={nextQuestion}
          >
            Next
          </button>
          <button
            id="endBtn"
            style={{ display: currQ - 4 ? "none" : "inline-block" }}
            onClick={nextQuestion}
          >
            End Test
          </button>
        </div>
      </div>
    </section>
  );
}
