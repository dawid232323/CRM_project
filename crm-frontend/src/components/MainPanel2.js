import React from "react";
import Select from "react-select/base";
import CompaniesPanel from "./companiesPanel";
import {Container, Row, Col} from "react-grid-system";

class MainPanel2 extends React.Component {

    constructor() {
        super();
        this.token = "3830179166ab484e973a682262156bb16b6490e5";
        this.main_link = 'http://127.0.0.1:8000/cmr/users/'
        this.headers = {'Content-Type':'application/json', 'Authorization':`Token ${this.token}`}
        this._next_page = null;
        this._previous_page = null;
        fetch('http://127.0.0.1:8000/cmr/user_token_details/', {
            'method': 'GET',
            headers: this.headers
        }).then(response => response.json())
            .then(response => this.setState({role: response.role,
        id: response.user_id, username: response.username}))
        console.log( `ROLE IS ${this.state.role}`)
    }


    state = {
        users: [],
        role: '',
        id: '',
        username: ''
    }

    setUser = (response) => {
        this._user_role = response.role
        this._username = response.username;
        this._user_id = response.user_id;

    }

    userSetter = () => {
        fetch('http://127.0.0.1:8000/cmr/user_token_details/', {
            'method': 'GET',
            headers: this.headers
        }).then(response => response.json())
            .then(response => this.setState({role: response.role,
        id: response.user_id, username: response.username}))
            .catch(error => console.log(error))
        // console.log(`role is ${this._user_role}, username is ${this._username}`)
    }

    componentDidMount() {
        this.userSetter()
        fetch(this.main_link, {
            'method': 'GET',
            headers : this.headers
        }).then(response => response.json())
            .then(response => this.setAfterFetch(response))
            .catch(error => console.log(error))
    };

    setAfterFetch = (response) => {
        this.setState({ users: response.results})
        console.log(`next will be ${response.next}`)
        this._next_page = response.next
        this._previous_page = response.previous
    }

    fetchUsers = (link) => {
        fetch(link, {
            'method': 'GET',
            headers: this.headers
        }).then(response => response.json())
            .then(response => this.setAfterFetch(response))
            .catch(error => console.log(error))
    }

    fetchNext = () => {
        if (this._next_page) {
            this.fetchUsers(this._next_page)
        }
    }

    fetchPrevious = () => {
        if (this._previous_page) {
            this.fetchUsers(this._previous_page)
        }
    }

    render() {
        return (
            <div className="panelBackground">
                <div className="panelTextFields">
                    <Container fluid className="myContainer">
                        <Row>
                            <Col>
                                <h2 className="display-3 ">Hello {this.state.username}</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h3 className="display-6">Users</h3>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                    <table className="table">
                                        <thead className="table-dark">
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Username</th>
                                                <th scope="col">First Name</th>
                                                <th scope="col">Last Name</th>
                                                <th scope="col">Date of Birth</th>
                                                <th scope="col">Role ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.users.map((user) => (
                                                <tr key={user.id}>
                                                    <th scope="row">{user.id}</th>
                                                    <td>{user.username}</td>
                                                    <td>{user.first_name}</td>
                                                    <td>{user.last_name}</td>
                                                    <td>{user.date_of_birth}</td>
                                                    <td>{user.role_id}</td>
                                                </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </Col>
                        </Row>
                        <Row >
                            <Col md={2} >
                                <button className="btn btn-primary" onClick={this.fetchPrevious}>Previous</button>
                                <button className="btn btn-primary" onClick={this.fetchNext}>Next</button>
                            </Col>
                            <Col md={2}>
                                {this.state.role === "1" ? <button className="btn btn-success">Add new User</button> : null}
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <h3>Companies</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <CompaniesPanel role_id={this.state.role} token={this.token}/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

export default MainPanel2

