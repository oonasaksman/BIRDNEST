// server/index.js
const path = require('path');
const express = require("express");
var bodyParser = require('body-parser');
var axios = require('axios');
const request = require('request');

const PORT = process.env.PORT || 3001;

const app = express();


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

// app.get("/api", (req, res) => {

// var request = require('request');
// var options = {
//   'method': 'GET',
//   'url': 'http://assignments.reaktor.com/birdnest/drones',
//   'headers': {
//   }
// };

// request(options, function (error, response) {

//   // var xml = require('xml');
//   if (error){
//     res.status(404).write("NO LUCK"); 
//     throw new Error(error);
//   } 
//   // res.text(response.body);
//   // res.set({ 'content-type': 'application/xml; charset=utf-8' });
//   res.set("Content-Type", "application/xml");
//   // res.set("xml", response.body);
//   // res.send(xml(response.body));
//   // res.type('application/xml');
//   res.status(200).write(response.body);
// });

// });


//TODO: ADD ERROR CODES
app.get("/api/drones", (req, res) => {

var axios = require('axios');

var config = {
  method: 'get',
  url: 'http://assignments.reaktor.com/birdnest/drones',
  headers: {'Content-Type': 'application/xml'}
};

axios(config)
.then(function (response) {
  res.json(response.data)
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});

});



app.post("/api/users", (req, res) => {

  var axios = require('axios');
  var dataObj = {};

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
      method: 'get',
      url: 'http://assignments.reaktor.com/birdnest/pilots/' + dataObj.serialNumber,
      headers: {'Content-Type': 'application/json'}
    };
  
    axios(config)
    .then(function (response) {
      res.json(response.data)
      console.log(response.data);
    })
    .catch(function (error) {
      console.log("404");
      console.log('http://assignments.reaktor.com/birdnest/pilots/' + dataObj.serialNumber);
    });

  })
  

  // var config = {
  //   method: 'get',
  //   url: 'http://assignments.reaktor.com/birdnest/pilots/' + dataObj.serialNumber,
  //   headers: {'Content-Type': 'application/json'}
  // };

  // axios(config)
  // .then(function (response) {
  //   res.json(response.data)
  //   console.log(response.data);
  // })
  // .catch(function (error) {
  //   console.log("404");
  // });
  
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});
  
