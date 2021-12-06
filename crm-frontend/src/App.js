import './App.css';
import React, {useEffect, useState} from "react";
import NavBar from "./components/navigation/NavBar";
import ApiService from "./Api_services/ApiService";
import cookie from "react-cookies";
import {useNavigate} from "react-router-dom";

function App(props) {

    const [role, setRole] = useState()
    const [token, setToken] = useState("3830179166ab484e973a682262156bb16b6490e5")
    let isLoggedIn = Boolean;
    const navigator = useNavigate()

    useEffect(() => {
        isLoggedIn = cookie.load("is_logged")
        if (isLoggedIn){
            setToken(cookie.load("auth_token"))
            ApiService.GetUserShortData(token)
            .then(response => {
                setRole(response.role)
                cookie.save("user_role", role, {path: '/'})
            })
        } else {
            navigator("/login")
        }

    })

    return (
    <div className="App">
        <NavBar/>
    </div>
  );
}

export default App;
