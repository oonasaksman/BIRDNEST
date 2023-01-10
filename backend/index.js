// server/index.js
const path = require('path');
const express = require("express");
var axios = require('axios');

const PORT = process.env.PORT || 3001;

const app = express();


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));


app.get("/api", (req, res) => {

    var axios = require('axios');

    var config = {
      method: 'get',
      url: 'http://assignments.reaktor.com/birdnest/drones',
      headers: { }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.json({message: JSON.stringify(response.data) });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});
  
