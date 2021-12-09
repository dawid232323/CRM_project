import React from "react";
import cookie from "react-cookies";
import { useNavigate} from "react-router";
import {Container, Row, Col} from "react-grid-system";


export default function LogoutPage(props) {

    const history = useNavigate()

    const removeCookies = () => {
        cookie.remove('user_role', {path:'/'})
        cookie.remove('auth_token', {path:'/'})
        cookie.remove('is_logged', {path:'/'})
    }

    const confirmButton = () => {
        removeCookies()
        history('/login')
    }

    const abortButton = () => {
        history(-1)
    }


    return (
        <div className="alertBackground">
            <Container>
                <Row >
                    <Col>
                        <label className="alertLabel">
                            Are you sure you want to quit?
                        </label>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col md={7}>
                        <button className="btn btn-danger" onClick={confirmButton}>
                            Yes
                        </button>
                    </Col>
                    <Col md={3}>
                        <button className="btn btn-success" onClick={abortButton}>
                            No
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    )


}