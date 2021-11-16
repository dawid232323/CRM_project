import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import Login from "./components/loginPage";
import UserForm from "./components/forms/UserForm";
import CompanyDetail from "./components/CompanyDetail";
import CompanyForm from "./components/forms/CompanyForm";
import {CookiesProvider} from "react-cookie";

let token = '';
let role = '';

function setToken(obtained_token) {
    token = obtained_token
    console.log(`Coming from index.js ${token}`)
}

function setRole(obtained_role) {
    role = obtained_role
}

ReactDOM.render(
    <CookiesProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/home" element={<App setToken={setToken} setRole={setRole}/>}/>
                <Route path="edit_user" element={<UserForm token={token}/>}>
                    <Route path=":userID" element={<UserForm token={token} is_new={false}/>}/>
                </Route>
                <Route path="new_user" element={<UserForm is_new={true}/>}/>
                <Route path="company">
                    <Route path=":companyID" element={<CompanyDetail token={"3830179166ab484e973a682262156bb16b6490e5"} user_role={role}/>}>
                        <Route path="edit" element={<CompanyForm is_new={false}/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </CookiesProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
