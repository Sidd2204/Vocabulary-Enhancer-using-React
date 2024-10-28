import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "../styles/stats.css";
import axios from "axios";
import address from ".bin/address";
import { useLocation } from "react-router-dom";

export default function Stats() {
  const location = useLocation();
  let username = location.pathname.split("/");
  username = username[username.length - 1];

  const [fetchedData, setFetchedData] = useState({
    totalWords: "",
    masteredWords: "",
    learningWords: "",
    scores: [],
  });

  useEffect(() => {
    async function fetchStats() {
      const statsReq = await axios.get(address + "/api/getStats/" + username);
      console.log("Stats Initial Fetch", statsReq.data);
      setFetchedData(statsReq.data);
    }
    fetchStats();
  }, []);

  return (
    <section id="main-con-stats">
      {/* <section id="mastered-words-number">
        <div>Total Words: {fetchedData.totalWords} </div>
      </section> */}

      {/* <section id="mastered-words-number">
        <div>Words Mastered: {fetchedData.masteredWords} </div>
      </section> */}
      <div id="progress-bar">
        <div
          id="progress-fill"
          style={{
            width: `${
              (fetchedData.masteredWords / fetchedData.totalWords) * 100
            }%`,
          }}
        ></div>
        <section id="mastered-words-number">
          <div>Words Mastered: {fetchedData.masteredWords} </div>
        </section>
      </div>

      <div id="progress-bar">
        <div
          id="progress-fill"
          style={{
            width: `${
              (fetchedData.learningWords / fetchedData.totalWords) * 100
            }%`,
          }}
        ></div>
        <section id="mastered-words-number">
          <div>Learning Words: {fetchedData.learningWords} </div>
        </section>
      </div>

      <div id="graph-div">
        <div id="graph-div-inner">
          <Chart
            width={800}
            height={500}
            type="line"
            options={{
              grid: {
                row: {
                  colors: ["#e1fffb", "#edfffd"],
                  opacity: 0.2,
                },
              },
              yaxis: {
                axisBorder: { show: true, color: "#ffffff", width: "2px" },
                title: {
                  text: "Score",
                  style: { color: "#ffffff", fontSize: "1.5rem" },
                },
                labels: {
                  style: {
                    colors: "#ffffff",
                    fontSize: "1rem",
                  },
                },
              },

              xaxis: {
                axisBorder: { show: true, color: "#ffffff", width: "4px" },
                title: {
                  text: "Last 5 lessons",
                  style: { color: "#ffffff", fontSize: "1.5rem" },
                },
                labels: {
                  style: {
                    colors: "#ffffff",
                    fontSize: "1rem",
                  },
                },
              },
            }}
            series={[
              {
                name: "Scores",
                data: fetchedData.scores,
                color: "#00fff2",
              },
            ]}
          ></Chart>
        </div>
      </div>
    </section>
  );
}
