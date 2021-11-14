import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import Login from "./components/loginPage";
import UserForm from "./components/UserForm";

let token = '';

function setToken(obtained_token) {
    token = obtained_token
    console.log(`Coming from index.js ${token}`)
}

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/home" element={<App setToken={setToken}/>}/>
            <Route path="edit_user" element={<UserForm token={token}/>}>
                <Route path=":userID" element={<UserForm token={token} is_new={false}/>}/>
            </Route>
            <Route path="new_user" element={<UserForm is_new={true}/>}/>
        </Routes>
        {/*<App/>*/}
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
