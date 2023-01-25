import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";

function App() {
  const [closeDrones, setCloseDrones] = useState({});

  useEffect(() => {
    let id = setInterval(getDrones, 2000);
    return () => clearInterval(id);
  });

  const getDrones = () => {
    axios.get("/api/drones").then((droneXml) => {
      parseXml(droneXml.data);
    });
  };

  const parseXml = (drones) => {
    let doc = new DOMParser().parseFromString(drones, "text/xml");
    let xml = doc.firstChild;
    let droneList = xml.getElementsByTagName("drone");
    let date = getDate();
    let arrY = [];
    for (let x = 0; x < droneList.length; x++) {
      arrY.push(droneList[x].childNodes[15].innerHTML);
    }
    let arrX = [];
    for (let x = 0; x < droneList.length; x++) {
      arrX.push(droneList[x].childNodes[17].innerHTML);
    }
    let arrS = [];
    for (let x = 0; x < droneList.length; x++) {
      arrS.push(droneList[x].childNodes[1].innerHTML);
    }
    //Looping through drones from snapshot
    for (let x = 0; x < droneList.length; x++) {
      let serialNum = arrS[x];

      //Add drone to UseState objec
      if (isClose(arrX[x], arrY[x])) {
        droneOwner(arrS[x]).then((result) => {
          let update = {};
          let distance = howFar(arrX[x], arrY[x]);
          update = {
            positionX: arrX[x],
            positionY: arrY[x],
            distance: distance,
            time: date,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            phoneNumber: result.phoneNumber,
          };
          setCloseDrones({
            ...closeDrones,
            [serialNum]: { ...update },
          });
        });
      }
    }
  };

  //Returns current date and time
  const getDate = () => {
    var today = new Date(),
      date =
        today.getHours() +
        "." +
        today.getMinutes() +
        ", " +
        today.getDate() +
        "." +
        (today.getMonth() + 1) +
        "." +
        today.getFullYear();
    return date;
  };

  //Calculates distance from nest to drone
  const howFar = (coX, coY) => {
    let minus = coY - 250000;
    let minus2 = coX - 250000;
    let power = Math.pow(minus, 2);
    let power2 = Math.pow(minus2, 2);
    let sum = power + power2;
    let distance = Math.sqrt(sum);
    return distance;
  };

  //Returns true if drone is too close
  const isClose = (coX, coY) => {
    const radius = 100000.0;
    let distance = howFar(coX, coY);
    if (distance < radius) {
      return true;
    }
    return false;
  };

  //Gets info of drone owner
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
      console.log("404", error);
      return {
        email: "could not retrieve",
        firstName: "unknown",
        lastName: "owner",
        phoneNumber: "could not retrieve",
      };
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {Object.keys(closeDrones).map((item, i) => (
            <li className="drone" key={i}>
              <p>
                <span className="input-label">
                  {closeDrones[item].firstName +
                    " " +
                    closeDrones[item].lastName +
                    "'s drone "}
                </span>
                <span className="input-label">
                  {"spotted at (" +
                    closeDrones[item].positionX +
                    ", " +
                    closeDrones[item].positionY +
                    ")  "}
                </span>
                <span className="input-label">
                  {closeDrones[item].time + ", "}
                </span>
                <span className="input-label">
                  {"email: " + closeDrones[item].email + ", "}
                </span>
                <span className="input-label">
                  {"phone: " + closeDrones[item].phoneNumber}
                </span>
              </p>
            </li>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
