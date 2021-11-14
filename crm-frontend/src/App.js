import './App.css';
import React from "react";
import MainPanel from "./components/mainPanel"
import MainPanel2 from "./components/MainPanel2";

function App(props) {
  return (
    <div className="App">
        <MainPanel2 setToken={props.setToken}/>
    </div>
  );
}

export default App;
