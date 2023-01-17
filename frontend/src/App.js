import "./App.css";
import { useEffect, useState } from "react";
import XMLParser from "react-xml-parser";
import axios from "axios";
import Decimal from "decimal.js";
import qs from "qs";

function App() {
  //const [drones, setDrones] = useState(null);
  const [closeDrones, setCloseDrones] = useState({});
  // const [positionY, setPositionY] = useState([]);
  // const [positionX, setPositionX] = useState([]);
  // const [serialNumbers, setSerialNumbers] = useState([]);

  useEffect(() => {
    let id = setInterval(getDrones, 5000);
    return () => clearInterval(id);
  }, []);

  const getDrones = () => {
    axios
      .get("/api/drones")
      //.then((res) => res.text())
      .then((droneXml) => {
        console.log(droneXml.data);
        parseXml(droneXml.data);
        //setDrones(droneXml.data);
        //const numArray = parseXml(droneXml.data);
        //console.log(parseXml(droneXml.data));
        // const eka = Number(numArray[0]);
        // const tok = Number(numArray[1]);

        //console.log(zoneCalculator(parseXml(droneXml.data)));
      });
  };

  const parseXml = (drones) => {
    let doc = new DOMParser().parseFromString(drones, "text/xml");
    let xml = doc.firstChild;
    let droneList = xml.getElementsByTagName("drone");
    let date = getDate();
    console.log(droneList);
    let arrY = [];
    for (let x = 0; x < droneList.length; x++) {
      arrY.push(droneList[x].childNodes[15].innerHTML);
    }
    //setPositionY(arrY);
    let arrX = [];
    for (let x = 0; x < droneList.length; x++) {
      arrX.push(droneList[x].childNodes[17].innerHTML);
    }
    //setPositionX(arrX);
    let arrS = [];
    for (let x = 0; x < droneList.length; x++) {
      arrS.push(droneList[x].childNodes[1].innerHTML);
    }

    for (let x = 0; x < droneList.length; x++) {
      //if drone is too close and not already in json
      if (isClose(arrX[x], arrY[x]) && !closeDrones[arrS[x]]) {
        //for(let y = 0; y < arrS.length; y++){
        droneOwner(arrS[x]).then((result) => {
          let update = {};
          update = {
            [arrS[x]]: {
              positionX: arrX[x],
              positionY: arrY[x],
              time: date,
              firstName: result.firstName,
              lastName: result.lastName,
              email: result.email,
              phoneNumber: result.phoneNumber,
            },
          };
          setCloseDrones((closeDrones) => ({
            ...update,
            ...closeDrones,
          }));
          console.log(result, [arrS[x]]);
          // setCloseDrones({
          //   [arrS[x]]: {
          //               positionX: arrX[x],
          //               positionY: arrY[x],
          //               time: time[0].innerHTML,
          //               firstName: result.firstName,
          //               lastName: result.lastName,
          //               email: result.email,
          //               phoneNumber: result.phoneNumber
          //               }});
          //setCloseDrones({meeps: "meep morp", ...closeDrones})
          console.log("too close");
          console.log(JSON.stringify(closeDrones));
        });
        //}
      }
      //too close but already in json
      else if (
        isClose(arrX[x], arrY[x]) &&
        closeDrones[arrS[x]] &&
        howFar(arrX[x], arrY[x]) <
          howFar(closeDrones[arrS[x]][0], closeDrones[arrS[x]][1])
      ) {
      }
    }
    //console.log(isClose(188106.66769, 171648.743947))
    return arrX;
  };

  const getDate = () => {
    var today = new Date(),
      date =
        today.getHours() +
        "." +
        today.getMinutes() +
        "-" +
        today.getDate() +
        "." +
        (today.getMonth() + 1) +
        "." +
        today.getFullYear();
    console.log(date);
    return date;
  };

  //calculates distance from nest to drone
  const howFar = (coX, coY) => {
    let minus = coY - 250000;
    let minus2 = coX - 250000;
    let power = Math.pow(minus, 2);
    let power2 = Math.pow(minus2, 2);
    let sum = power + power2;
    let distance = Math.sqrt(sum);
    return distance;
  };

  //returns true if drone is too close
  const isClose = (coX, coY) => {
    const radius = 100000.0;
    let distance = howFar(coX, coY);
    if (distance < radius) {
      return true;
    }
    return false;
  };

  // const forLoop = async () => {

  //   for (let index = 0; index < fruitsToGet.length; index++) {
  //     const fruit = fruitsToGet[index]
  //     const numFruit = await getNumFruit(fruit)
  //     console.log(numFruit)
  //   }
  // }

  const droneOwner = async (serialNumber) => {
    var data = qs.stringify({
      serialNumber: serialNumber,
    });
    var config = {
      method: "post",
      url: "http://localhost:3001/api/users",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.log("404");
      return "could not retrieve owner info";
    }
  };

  // <p>{!drones ? "Loading..." : drones}</p>
  // {drones ? console.log(parseXml(drones)) : ""}

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {Object.keys(closeDrones).map((item, i) => (
            <li className="travelcompany-input" key={i}>
              <span className="input-label">
                {closeDrones[item].lastName + "----"}
              </span>
              <span className="input-label">
                {closeDrones[item].time + "----"}
              </span>
              <span className="input-label">{closeDrones[item].positionX}</span>
            </li>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
