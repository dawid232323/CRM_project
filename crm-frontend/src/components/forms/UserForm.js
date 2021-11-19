import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ApiService from "../../ApiService";
import {Col, Container, Row} from "react-grid-system";
import {useCookies} from "react-cookie";


export default function UserForm(props) {

    const [user_data, setUser] = useState([])
    const [username, setUsername] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [date_of_birth, setDateOfBirth] = useState('')
    const [role_id, setRoleId] = useState('')
    const [password, setPassword] = useState('')
    const [rpassword, setRPassword] = useState('')

    let params = useParams()
    let navigator = useNavigate()

    useEffect(() => {
        if (!props.is_new){
            ApiService.RetrieveUserData(params.userID, "3830179166ab484e973a682262156bb16b6490e5")
            .then(response => response.json())
            .then(response => setUser(response))
            .catch(error => alert(error))
        } else {
            setUser([{
                username: '',
                first_name: '',
                last_name: '',
                date_of_birth: '',
                role_id: '',
                password: ''
            }])
        }


    }, [])

    useEffect(() => {
        setUsername(user_data.username)
        setFirstName(user_data.first_name)
        setLastName(user_data.last_name)
        setDateOfBirth(user_data.date_of_birth)
        setRoleId(user_data.role_id)
        if (props.is_new) {
            setPassword(user_data.password)
        }
    }, [user_data])

    const navigateBack = () => {
        navigator('/home/ussers')
    }

    const submitData = () => {
        if (props.is_new){
            if (password === rpassword){
                const body = {username, first_name, last_name, date_of_birth, role_id, password}
                ApiService.CreateUser("3830179166ab484e973a682262156bb16b6490e5", body)
                    .then(response => console.log(response))
                alert("User Successfully Created!")
                navigateBack()
            }else {
                alert("Password must match repeated password")
            }

        }else {
            const body = {username, first_name, last_name, date_of_birth, role_id}
            ApiService.UpdateUser(params.userID, "3830179166ab484e973a682262156bb16b6490e5", body)
            .then(resp => console.log(resp))
            .catch(error => alert(error))
            navigateBack()
        }

    }


    return (
        <div className="backgroundOne">
            <div className="panelTextFields">
                <Container fluid className="myContainer">
                    <Row>
                        <Col>
                            {props.is_new ? <h1 className="display-2">Create New User</h1>:
                            <h1 className="display-2">Editing {user_data.username}</h1>}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor="username" className="form-label">Set username</label>
                            <input type="text" className="form-control" value={username}
                                   onChange={val => setUsername(val.target.value)} id="username" placeholder="username"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor="first_name" className="form-label">Set First Name</label>
                            <input type="text" className="form-control" value={first_name}
                                   onChange={val => setFirstName(val.target.value)} id="frist_name" placeholder="first name"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor="last_name" className="form-label">Set Last Name</label>
                            <input type="text" className="form-control" value={last_name}
                                   onChange={val => setLastName(val.target.value)} placeholder="last name"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor="birth" className="form-label">Set Date of Birth</label>
                            <input type="text" className="form-control" value={date_of_birth} id="birth"
                                   onChange={val => setDateOfBirth(val.target.value)} placeholder="date of birth"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor="role" className="form-label">Set User Role</label>
                            <input type="text" className="form-control" value={role_id} id="role"
                                   onChange={val => setRoleId(val.target.value)} placeholder="role id"/>
                        </Col>
                    </Row>
                    {props.is_new ?
                        <div>
                            <Row>
                        <Col>
                            <label htmlFor="passwd" className="form-label">Set user password</label>
                            <input type="password" className="form-control" value={password}
                                   onChange={val => setPassword(val.target.value)} placeholder="password" id="passwd"/>
                        </Col>
                        </Row>
                        <Row>
                            <Col>
                                <label htmlFor="rpasswd" className="form-label">Repeat Password</label>
                                <input type="password" className="form-control" value={rpassword}
                                       onChange={val => setRPassword(val.target.value)} placeholder="repeat password" id="rpasswd"/>
                            </Col>
                        </Row>
                        </div>
                        : null}
                    <br/>
                    <Row>
                        <Col md={6}>
                            <button className="btn btn-primary" onClick={navigateBack}>Back</button>
                            <button className="btn btn-success" onClick={submitData}>Submit</button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>


    )
}