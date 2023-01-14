import './App.css';
import {useEffect, useState} from 'react';
import XMLParser from 'react-xml-parser';
import axios from "axios";

function App() {
  const [drones, setDrones] = useState(null);
  
   useEffect(() => {

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

    //hurrah
    axios.get("/api")
    //.then((res) => res.text())
    .then((data) => console.log(data.data));
    //});

    
  }, []);

      // fetch("/api")
    //   .then((res) => res.json())
    //   .then((data) => console.log(data.message));

  const parseXml = (drones) => {
    const doc = new DOMParser().parseFromString(drones, "text/xml");
    const xml = doc.firstChild;
    return xml;
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
