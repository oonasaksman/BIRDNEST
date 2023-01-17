// server/index.js
const path = require("path");
const express = require("express");
var bodyParser = require("body-parser");
var axios = require("axios");
const request = require("request");

const PORT = process.env.PORT || 3001;

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../frontend/build")));

//TODO: ADD ERROR CODES
app.get("/api/drones", (req, res) => {
  var axios = require("axios");

  var config = {
    method: "get",
    url: "http://assignments.reaktor.com/birdnest/drones",
    headers: { "Content-Type": "application/xml" },
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/api/users", (req, res) => {
  var axios = require("axios");
  var dataObj = {};
  res.header({ "Access-Control-Allow-Origin": "*" });

  const chunks = [];
  req.on("data", (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", () => {
    console.log("all parts/chunks have arrived");
    const data = Buffer.concat(chunks);
    const stringData = data.toString();
    console.log("stringData: ", stringData);
    const parsedData = new URLSearchParams(stringData);
    for (var pair of parsedData.entries()) {
      dataObj[pair[0]] = pair[1];
    }

    var config = {
      method: "get",
      url:
        "http://assignments.reaktor.com/birdnest/pilots/" +
        dataObj.serialNumber,
      validateStatus: () => true,
      headers: { "Content-Type": "application/json" },
    };

    axios(config)
      .then(function (response) {
        res.json(response.data);
        console.log(response.data);
        res.status(200).end();
      })
      .catch(function (error) {
        console.log(error);
        //console.log("errorbutwontsay: ", response.data);
        console.log(
          "http://assignments.reaktor.com/birdnest/pilots/" +
            dataObj.serialNumber
        );
        res.status(404).end();
      });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});
