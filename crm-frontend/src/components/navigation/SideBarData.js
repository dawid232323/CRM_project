import React from "react";
import * as AiIcons from "react-icons/ai";
import {IoPeopleOutline} from "react-icons/io5"
import * as ImIcons from "react-icons/im"
import * as BsIcons from "react-icons/bs"
import {BiLogOut} from "react-icons/bi"
import {MdOutlineNotes} from "react-icons/md"



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
        path: 'contacts',
        icon: <IoPeopleOutline/>,
        cName: 'nav-text'
    },
    {
        title: "Trade Notes",
        path: 'trade_notes',
        icon: <MdOutlineNotes/>,
        cName: 'nav-text'
    },
    {
        title: "Logout",
        path: '/logout',
        icon: <BiLogOut/>,
        cName: 'nav-text'
    }
]