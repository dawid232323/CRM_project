import React from "react";
import CompaniesPanel from "./companiesPanel";
import {Container, Row, Col} from "react-grid-system";
import {Link, Navigate, Outlet} from "react-router-dom";
import ApiService from "../ApiService";
import {Cookies, withCookies} from "react-cookie"
import {instanceOf} from "prop-types"

class MainPanel2 extends React.Component {

    constructor() {
        super();
        this.token = "3830179166ab484e973a682262156bb16b6490e5";
        this.main_link = 'http://127.0.0.1:8000/cmr/users/'
        this.headers = {'Content-Type':'application/json', 'Authorization':`Token ${this.token}`}
        this._next_page = null;
        this._previous_page = null;
        this.setAfterFetch = this.setAfterFetch.bind(this)
        this.userSetter = this.userSetter.bind(this)
        this.filter_users = this.filter_users.bind(this)
        this.handleCookie = this.handleCookie.bind(this)

        fetch('http://127.0.0.1:8000/cmr/user_token_details/', {
            'method': 'GET',
            headers: this.headers
        }).then(response => response.json())
            .then(response => {
                this.setState({id: response.user_id, username: response.username})
                this.handleCookie(response.role)
            })
    }

    handleCookie = (role_id) => {
        console.log(`setting cookie role is ${role_id}`)
        const {cookies} = this.props;
        cookies.set("user_role", role_id, {path: "/"});
        this.setState({role: cookies.get("user_role")})
    }

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    state = {
        users: [],
        role: '',
        id: '',
        username: '',
        redirect: null,
        filter_by: '',
        filter_condition: '',
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
            .then(response => {
                this.setState({
                    id: response.user_id, username: response.username})
                this.handleCookie(response.role)
            })
            .catch(error => console.log(error))
        // console.log(`role is ${this._user_role}, username is ${this._username}`)
    }

    componentDidMount() {
        console.log('mounting')
        this.userSetter()
        fetch(this.main_link, {
            'method': 'GET',
            headers : this.headers
        }).then(response => response.json())
            .then((response) => {
                this.setState({users: response.results})
                this._next_page = response.next
                this._previous_page = response.previous
            })
            .catch(error => alert(error))
        this.props.setToken(this.token)
        this.props.setRole(this._user_role)
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

    filter_users = () => {
        ApiService.FilterUsers(this.token, this.state.filter_by, this.state.filter_condition)
            .then(response => {
                this.setState({users: response.results})
                this._next_page = response.next
                this._previous_page = response.previous
            }).catch(error => alert(error))
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
                                                {this.state.role === "1" ?
                                                <th scope="col">Additional Options</th>: null}
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
                                                    {this.state.role === "1" ?
                                                        <td>
                                                            <Container>
                                                                <Row>
                                                                    <Col md={3}>
                                                                        <button className="btn btn-primary">
                                                                            <Link className="text-white" to={`/edit_user/${user.id}`}>Edit User</Link>
                                                                        </button>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <button className="btn btn-danger">Delete User</button>
                                                                    </Col>
                                                                </Row>
                                                            </Container>
                                                        </td> :null}

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
                                {this.state.role === "1" ? <button className="btn btn-success">
                                    <Link className="text-white" to={"/new_user"} >Create New user</Link>
                                </button> : null}
                            </Col>
                                <select value={this.state.filter_by}
                                        onChange={event => this.setState({filter_by: event.target.value})}
                                placeholder="Filter By" className="form-select-sm">
                                    <option selected>Filter By</option>
                                    <option value="username">Username</option>
                                    <option value="last_name">Last Name</option>
                                </select>
                            <Col md={2}>
                                <input value={this.state.filter_condition} placeholder="Type filter condition"
                                onChange={event => this.setState({filter_condition: event.target.value})}
                                className="form-control"/>
                            </Col>
                            <Col md={2}>
                                <button className="btn btn-success" onClick={this.filter_users}>Filter</button>
                                <button className="btn btn-danger" onClick={() => {
                                    this.fetchUsers(this.main_link)
                                    this.setState({filter_by: '', filter_condition: ''})
                                }}>
                                    Clear Filters
                                </button>
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
                                <CompaniesPanel role_id={this.state.role} token={this.token} filter_by={this.state.filter_by}/>
                            </Col>
                        </Row>
                    </Container>

                </div>
                {/*<Outlet/>*/}
            </div>
        );
        }
}

export default withCookies(MainPanel2)

