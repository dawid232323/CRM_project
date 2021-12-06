import React, {useEffect, useState} from "react";
import "../App.css"
import ApiService from "../Api_services/ApiService";
import {useNavigate} from "react-router-dom";
import cookie from "react-cookies";


export default function Login() {

    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')
    const[token, setToken] = useState('')
    let navigate = useNavigate()

    useEffect( () => {
        if (token) {
            console.log(token)
            navigate('/logged/home')
            fetch("http://localhost:8000/cmr/users/", {
                'method': 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':`Token ${token}`
                }
            })
                .then(resp => resp.json())
                .then(resp=> console.log(resp.value))
                .catch(error => console.error())
            console.log(token)
        }
    }, [token])

    const obtain_auth_token = () => {
        ApiService.obtainToken(username, password)
            .then(resp => cookie.save("auth_token", resp.token, {path:"/"}))
            .catch(error => alert(error))

        cookie.save("is_logged", true, {path:"/"})
        navigate('/logged/home')
    }

    return(
        <div className="backgroundOne" >
            <h1 className="display-1 text-center">Hello, please log in</h1>
            <div className="container">
                <br/>
                <div className="row">
                    <input type="text" className="inputOne form-control" id="username"
                    placeholder="Enter your username" value={username}
                    onChange={event => setUsername(event.target.value)}/>
                </div>
                <br/>
                <div className="row">
                    <input type="password" className="inputOne form-control" id="password"
                           placeholder="Enter your password" value={password}
                    onChange={event => setPassword(event.target.value)}/>
                </div>
                <br/>
                <button className="buttonOne btn-success" onClick={obtain_auth_token}>Submit</button>
            </div>

        </div>
    )
}