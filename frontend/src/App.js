    // //logs nothing
    // fetch("/api", {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/xml',
    //   }
    // })
    //   .then((res) => res.text())
    //   .then((data) => console.log(data.body))

    // //logs nothing
    // fetch("/api")
    // .then(res => res.text())
    // .then(data => {
    //     var xml = new XMLParser().parseFromString(data); 
    //     console.log(xml)
    // })
    // .catch(err => console.log(err));

    // //logs readablestream, just res logs response 
    //   fetch("/api")
    //  .then((res) => res.body)
    //  .then((data) => console.log(data));

          // fetch("/api")
    //   .then((res) => res.json())
    //   .then((data) => console.log(data.message));


import './App.css';
import {useEffect, useState} from 'react';
import XMLParser from 'react-xml-parser';
import axios from "axios";
import Decimal from 'decimal.js';
import qs from "qs";

function App() {
  const [drones, setDrones] = useState(null);
  const [closeDrones, setCloseDrones] = useState({});
  const [positionY, setPositionY] = useState([]);
  const [positionX, setPositionX] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState([]);
  
   useEffect(() => {

    axios.get("/api/drones")
    //.then((res) => res.text())
    .then(droneXml => {
        console.log(droneXml.data);
        setDrones(droneXml.data);
        const numArray = parseXml(droneXml.data);
        console.log(parseXml(droneXml.data));
        const eka = Number(numArray[0]);
        const tok = Number(numArray[1]);
        console.log(droneOwner("SN-jFpmj52QAj"));
        //console.log(zoneCalculator(parseXml(droneXml.data)));
    })
    
  }, []);


  const parseXml = (drones) => {
    const doc = new DOMParser().parseFromString(drones, "text/xml");
    const xml = doc.firstChild;
    const droneList = xml.getElementsByTagName("drone");
    const time = xml.getElementsByTagName("deviceStarted");
    console.log(time[0].innerHTML);
    console.log(droneList);
    let arrY = [];
    for(let x = 0; x < droneList.length; x++){
      arrY.push(droneList[x].childNodes[15].innerHTML)
    }
    setPositionY(arrY);
    let arrX = [];
    for(let x = 0; x < droneList.length; x++){
      arrX.push(droneList[x].childNodes[17].innerHTML)
    }
    setPositionX(arrX);
    let arrS = [];
    for(let x = 0; x < droneList.length; x++){
      arrS.push(droneList[x].childNodes[1].innerHTML)
    }

    for(let x = 0; x < droneList.length; x++){
      //if drone is too close and drone not already in json
      if(isClose(arrX[x], arrY[x]) && !closeDrones[arrS[x]] ){
        const ownerInfo = droneOwner();
        closeDrones[arrS[x]] = arrX[x];
        closeDrones[arrS[x]] = arrY[x];
        closeDrones[arrS[x]] = ownerInfo[0]; //name
        closeDrones[arrS[x]] = ownerInfo[1]; //phone
        closeDrones[arrS[x]] = ownerInfo[2]; //email
      }
      //too close but already in json
      if(isClose(arrX[x], arrY[x]) && closeDrones[arrS[x]]
        && howFar(arrX[x], arrY[x] < closeDrones[arrS[x]] )
      ){
        
      }

    }
    //console.log(isClose(188106.66769, 171648.743947))
    return arrX;
  }

  const howFar = (coX, coY) => {
    const minus = coY - 250000;
    const minus2 = coX - 250000;
    const power = Math.pow(minus, 2);
    const power2 = Math.pow(minus2, 2);
    const sum = power + power2;
    const distance = Math.sqrt(sum);
    return distance;
  }

  //returns true if drone is too close
  const isClose = (coX, coY) => {
    const radius = 100000.0000;
    const distance = howFar(coX, coY);
    if(distance < radius){
      return true;
    }
    return false;
  }


  const droneOwner = (serialNumber) => {

    // var config = {
    //   method: 'post',
    //   url: '/api/users',
    //   headers: {'Content-Type': 'application/json'},
    //   data: {"serialNumber": serialNumber}
    // };

    // axios(config)
    // .then(userInfo => {
    //     console.log(userInfo.data);
    //     return userInfo.data;
    // })

    
    var data = qs.stringify({
      'serialNumber': 'SN-XXQq3bSWY7' 
    });
    var config = {
      method: 'post',
      url: 'http://localhost:3001/api/users',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log("404");
    });

  }

        // <p>{!drones ? "Loading..." : drones}</p>
        // {drones ? console.log(parseXml(drones)) : ""}

  return (
    <div className="App">
      <header className="App-header">
        
      </header>
    </div>
  );
}

export default App;
