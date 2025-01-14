const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "siddhesh@123",
  database: "mp2a",
  multipleStatements: true,
});

app.get("/", (req, res) => {
  const q = "select * from login;";

  conn.query(q, (error, result) => {
    if (error) throw error;

    res.json(result);
  });
});

app.post("/api/login", (req, res) => {
  const { loginUsername, loginPassword } = req.body;

  const q = "select  * from login where username = ? and password = ?;";

  conn.query(q, [loginUsername, loginPassword], (error, result) => {
    if (error) throw error;

    if (!result.length) return res.json({ status: "error" });

    return res.json({ status: "ok" });
  });
});

app.post("/api/register", (req, res) => {
  const {
    registerFirstname,
    registerLastname,
    registerUsername,
    registerPassword,
  } = req.body;

  const queries = [
    {
      q: "insert into login (username, password) values(?,?);",
      values: [registerUsername, registerPassword],
    },
    {
      q: "insert into profile (username, fname, lname) values(?,?,?);",
      values: [registerUsername, registerFirstname, registerLastname],
    },
    {
      q: "insert into scores (username) values(?);",
      values: [registerUsername],
    },
    {
      q: "insert into streaks (username) values(?);",
      values: [registerUsername],
    },
  ];

  //Run each query
  queries.forEach((query) => {
    conn.query(query.q, query.values, (error, result) => {
      if (error) return res.json({ status: error });
    });
  });

  //Get all words
  conn.query("select word_id from words", (error, result) => {
    if (error) return res.json({ status: error });

    //Insert data in userprogress
    result.forEach((word) => {
      conn.query(
        "insert into userprogress (username, word_id) values(?, ?);",
        [registerUsername, word.word_id],

        (error, result) => {
          if (error) return res.json({ status: error });
        }
      );
    });
  });

  return res.json({ status: "ok" });
});

app.get("/api/getStreaks/:username", (req, res) => {
  const q = "select * from streaks where username = ?;";

  conn.query(q, [req.params.username], (error, result) => {
    if (error) return res.json({ status: error });

    return res.json(result[0]);
  });
});

app.get("/api/getWords/:username", (req, res) => {
  const q =
    "select username, word_id, word, meaning, correct_answers, incorrect_answers, box_level from userprogress natural join words where username = ? and difficulty = (select userlevel from profile where username = ?) and box_level != 5 order by rand() limit 5";
  conn.query(q, [req.params.username, req.params.username], (error, result) => {
    if (error) return res.json({ status: error });
    return res.json(result);
  });
});

app.get("/api/getScores/:username", (req, res) => {
  const q = "select * from scores where username = ?;";
  conn.query(q, [req.params.username, req.params.username], (error, result) => {
    if (error) return res.json({ status: error });
    return res.json(result[0]);
  });
});

app.get("/api/getUserlevel/:username", (req, res) => {
  const q = "select username, userlevel from profile where username = ?;";
  conn.query(q, [req.params.username], (error, result) => {
    if (error) return res.json({ status: error });
    return res.json(result[0]);
  });
});

app.post("/api/updateStreaks", (req, res) => {
  const { streak_count, laststreak, username } = req.body;
  q = "update streaks set streak_count = ?, laststreak = ? where username = ?;";
  conn.query(q, [streak_count, laststreak, username], (error, result) => {
    if (error) return res.json({ status: error });
    // console.log("Streaks Working");
    return res.json({ status: "ok" });
  });
});

app.post("/api/updateWords", (req, res) => {
  const updatedWords = req.body;

  q =
    "update userprogress set correct_answers = ?, incorrect_answers = ?, box_level = ? where username = ? and word_id = ?;";

  updatedWords.forEach((word) => {
    conn.query(
      q,
      [
        word.correct_answers,
        word.incorrect_answers,
        word.box_level,
        word.username,
        word.word_id,
      ],
      (error, result) => {
        if (error) return res.json({ status: error });
        // console.log("\nWords working");
      }
    );
  });
  return res.json({ status: "ok" });
});

app.post("/api/updateScores", (req, res) => {
  const { username, score1, score2, score3, score4, score5 } = req.body;
  q =
    "update scores set score1 = ?, score2 = ?, score3 = ?, score4 = ?, score5 = ? where username = ?;";
  conn.query(
    q,
    [score1, score2, score3, score4, score5, username],
    (error, result) => {
      if (error) return res.json({ status: error });
      // console.log("Scores Working");
      return res.json({ status: "ok" });
    }
  );
});

app.post("/api/updateUserlevel", (req, res) => {
  const { userlevel, username } = req.body;
  q = "update profile set userlevel = ? where username = ?;";
  conn.query(q, [userlevel, username], (error, result) => {
    if (error) return res.json({ status: error });
    // console.log("Userlevel Working");
    return res.json({ status: "ok" });
  });
});

app.get("/api/getStats/:username", (req, res) => {
  const { username } = req.params;
  let response = {
    totalWords: "",
    masteredWords: "",
    learningWords: "",
    scores: [],
  };
  const q1 = "select count(word_id) as totalWords from words;";
  const q2 = "select * from scores where username = ?;";
  const q3 =
    "select count(word_id) as masteredWords from userprogress where username = ? and box_level = 5;";
  const q4 =
    "select count(word_id) as learningWords from userprogress where username = ? and box_level != 0";
  conn.query(q1, (error, result) => {
    if (error) return res.json({ status: error });
    response.totalWords = result[0].totalWords;
  });

  conn.query(q2, [username], (error, result) => {
    if (error) return res.json({ status: error });
    response.scores = [
      result[0].score1,
      result[0].score2,
      result[0].score3,
      result[0].score4,
      result[0].score5,
    ];
  });

  conn.query(q3, [username], (error, result) => {
    if (error) return res.json({ status: error });
    response.masteredWords = result[0].masteredWords;
  });

  conn.query(q4, [username], (error, result) => {
    if (error) return res.json({ status: error });
    response.learningWords = result[0].learningWords;
  });

  setTimeout(() => {
    // console.log(response);
    return res.json(response);
  }, 100);
});

app.get("/api/getProfile/:username", (req, res) => {
  const q1 = "select * from profile where username = ?";
  conn.query(q1, [req.params.username], (error, result) => {
    if (error) return res.json({ status: error });
    result = result[0];
    // console.log(result);
    return res.json({
      username: result.username,
      fname: result.fname,
      lname: result.lname,
      joining: result.joining,
      userlevel: result.userlevel,
    });
  });
});

app.post("/api/updateProfile", (req, res) => {
  const { username, fname, lname } = req.body;
  const q1 = "update profile set fname = ?, lname = ? where username = ?";

  conn.query(q1, [fname, lname, username], (error, result) => {
    if (error) return res.json({ status: error });
    return res.json({ status: "ok" });
  });

  return;
});

app.get("/api/getMasteredWords/:username", (req, res) => {
  const { username } = req.params;

  q1 =
    "select word, meaning from userprogress natural join words where username = ? and box_level = 5 order by rand() limit 5";

  conn.query(q1, [username], (error, result) => {
    if (error) return res.json({ status: error });
    return res.json(result);
  });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
