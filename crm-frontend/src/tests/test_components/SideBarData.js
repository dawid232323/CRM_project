import React from "react";
import * as AiIcons from "react-icons/ai";
import MainPanel2 from "../../components/MainPanel2";


export const SideBarData = [
    {
        title: 'Home',
        path: 'home',
        icon: <AiIcons.AiFillHome onClick={() => {return <MainPanel2/>}}/>,
        cName: 'nav-text'
    },
    {
        title: 'Users',
        path: '/users',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Companies',
        path: '/companies',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Contact Persons',
        path: '/contact_persons',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Test',
        path: 'test',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
]