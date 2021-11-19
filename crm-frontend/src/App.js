import './App.css';
import React, {useEffect, useState} from "react";
import NavBar from "./components/navigation/NavBar";
import ApiService from "./ApiService";
import cookie from "react-cookies";

function App(props) {

    const [role, setRole] = useState()
    const [token, setToken] = useState("3830179166ab484e973a682262156bb16b6490e5")

    useEffect(() => {
        ApiService.GetUserShortData(token)
            .then(response => {
                setRole(response.role)
                cookie.save("user_role", role, {path: '/'})
            })
    })

    return (
    <div className="App">
        <NavBar/>
    </div>
  );
}

export default App;
