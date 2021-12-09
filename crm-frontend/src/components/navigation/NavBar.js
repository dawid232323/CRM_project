import React, {useState} from "react";
import {Link, Outlet} from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import {AiOutlineClose} from "react-icons/all";
import {SideBarData} from "./SideBarData";
import './NavBar.css'
import {IconContext} from "react-icons";
import {Col, Container, Row} from "react-grid-system";

function NavBar() {

    const [sidebar, setSideBar] = useState(false)

    const showSideBar = () => { setSideBar(!sidebar) }

    return (
        <div className="panelBackground">
            <IconContext.Provider value={{color: '#fff'}}>
                <div className="navbar">
                <Link to="#" className="menu-bars">
                    <FaIcons.FaBars onClick={showSideBar}/>
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className='navbar-toggle'>
                        <Link to="#" className='menu-bars'>
                            <AiOutlineClose onClick={showSideBar}/>
                        </Link>
                    </li>
                    {SideBarData.map((item, index) => {
                            return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>

                            </li>
                        )
                    })}
                </ul>

            </nav>
            </IconContext.Provider>
            <Container style={sidebar ? {'margin-left':'15%', 'transition': '650ms'}:
                {'transition': '350ms', 'margin-left': '2%'}}>
                <Row>
                    <Col>
                      <Outlet/>
                    </Col>
                </Row>
            </Container>
        </div>

    )
}

export default NavBar