import React, {useEffect, useState} from "react";
import cookie from "react-cookies";
import {useNavigate} from "react-router-dom";


export default function HomePage() {

    let login = Boolean;
    const navigator = useNavigate()

    useEffect(() => {
        login = cookie.load("is_logged")
        if (!login) {
            navigator('/login')
        }
    })



    return (
        <div className="panelBackground">
            <h1 className="display-1">Hello</h1>
            <h2 className="display-2">Your role id is {cookie.load('user_role')}</h2>
        </div>
    )
}