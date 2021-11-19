import React from "react";
import cookie from "react-cookies";


export default function HomePage() {
    return (
        <div className="panelBackground">
            <h1 className="display-1">Hello</h1>
            <h2 className="display-2">Your role id is {cookie.load('user_role')}</h2>
        </div>
    )
}