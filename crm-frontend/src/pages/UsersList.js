import React from "react";
import cookie from "react-cookies"
import ApiService from "../ApiService";
import {Col, Container, Row} from "react-grid-system";
import {Link} from "react-router-dom";
import {GrFormNextLink, GrFormPreviousLink} from "react-icons/gr"
import {IconContext} from "react-icons";

class UsersList extends React.Component{

    constructor(props) {
        super(props);
        this.token = "3830179166ab484e973a682262156bb16b6490e5"
        this.filter_users = this.filter_users.bind(this)
        this.setBasicData = this.setBasicData.bind(this)
        this.fetchUsers = this.fetchUsers.bind(this)
    }

    state = {
        users: [],
        role: '',
        username: '',
        filter_by: '',
        filter_condition: '',
        next_page: '',
        previous_page: ''
    }

    setBasicData(response) {
        this.setState({users: response.results, next_page: response.next,
                previous_page: response.previous})
    }

    componentDidMount() {
        this.setState({role: cookie.load('user_role')})
        ApiService.ListUsers("3830179166ab484e973a682262156bb16b6490e5")
            .then((response) => this.setBasicData(response))
    }

    filter_users() {
        ApiService.FilterUsers(this.token, this.state.filter_by, this.state.filter_condition)
            .then((response) => this.setBasicData(response))
            .catch(error => alert(error))
    }

    fetchUsers(link) {
        ApiService.ListUsers(this.token, link)
            .then((response) => this.setBasicData(response))
    }

    render() {
        return (
            <div >
                    <Container>
                        <Row>
                            <Col>
                                <h3 className="display-3">Users</h3>
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
                                <IconContext.Provider value={{color: "#fff"}}>
                                    <button className="btn btn-primary text-center">
                                        <GrFormPreviousLink onClick={() => this.fetchUsers(this.state.previous_page)}>Previous</GrFormPreviousLink>
                                    </button>
                                    <button className="btn btn-primary text-white" >
                                        <GrFormNextLink onClick={() => this.fetchUsers(this.state.next_page)} style={{'color': 'white'}}/>
                                    </button>
                                </IconContext.Provider>
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
                    </Container>
        </div>
        )
    }

}

export default UsersList