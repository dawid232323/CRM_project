import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io"
import * as ImIcons from "react-icons/im"
import * as BsIcons from "react-icons/bs"
import MainPanel2 from "../../components/MainPanel2";



export const SideBarData = [
    {
        title: 'Home',
        path: 'home',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Users',
        path: 'users',
        icon: <ImIcons.ImUsers/>,
        cName: 'nav-text'
    },
    {
        title: 'Companies',
        path: 'companies',
        icon: <BsIcons.BsBuilding/>,
        cName: 'nav-text'
    },
    {
        title: 'Contact Persons',
        path: '/contact_persons',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Home',
        path: '/',
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