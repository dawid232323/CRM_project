import React from "react";
import ApiService from "../Api_services/ApiService";
import {Link, Navigate} from "react-router-dom";
import {Col, Container, Row} from "react-grid-system";
import cookie from "react-cookies";
import {findAllByAltText} from "@testing-library/react";

class CompaniesPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state.role_id = cookie.load("user_role")
        this.state.token = cookie.load('auth_token')
        this.main_link = "http://localhost:8000/cmr/companies/?deleted=False"
        this.is_logged = cookie.load("is_logged")
        this.PaginateCompanies = this.PaginateCompanies.bind(this)
        this.filterCompanies = this.filterCompanies.bind(this)
        this.showDeleted = this.showDeleted.bind(this)
    }

    state = {
        role_id: '',
        companies: [],
        token: '',
        next_page: '',
        previous_page: '',
        filter_by: '',
        filter_condition: '',
        show_deleted: true,
    }

    componentDidMount() {
        this.is_logged = cookie.load("is_logged")
        if (!this.is_logged) {
            return <Navigate to='/login'/>
        }
        this.setState({token: cookie.load('auth_token'), role_id: this.props.role_id})
        ApiService.getCompaniesList(this.state.token, "http://localhost:8000/cmr/companies/?deleted=False").then(response => this.setState({companies: response.results,
            next_page: response.next, previous_page: response.previous})).catch(error => alert(error))
    }

    PaginateCompanies(link) {
        ApiService.getCompaniesList(this.state.token, link)
            .then(response => {
                this.setState({companies: response.results, next_page: response.next,
                previous_page: response.previous})
            })
            .catch(error => alert(error))
    }

    filterCompanies() {
        const link = `http://localhost:8000/cmr/filter/companies_${this.state.filter_condition}=${this.state.filter_by}/`
        ApiService.getCompaniesList(this.state.token, link)
            .then(response => {
                this.setState({companies: response.results, next_page: response.next,
                previous_page: response.previous})
            }).catch(error => alert(error))
    }

    showDeleted() {
        this.setState({show_deleted: !this.state.show_deleted})
        const param = String(this.state.show_deleted).charAt(0).toUpperCase() + String(this.state.show_deleted).slice(1)
        const link = `http://127.0.0.1:8000/cmr/companies/?deleted=${param}`
        this.PaginateCompanies(link)
    }

    render() {
        return (
            <div >
                <Container>
                    <Row>
                        <Col>
                            <h1 className="display-3">Companies</h1>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <table className="table">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Nip</th>
                                        <th scope="col">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.companies.map((company) => (
                                        <tr key={company.id}>
                                            <th scope="row">{company.id}</th>
                                            <td>{company.company_name}</td>
                                            <td>{company.company_nip}</td>
                                            <td>
                                                <Link to={`/company/${company.id}/`}>Details</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <button className="btn btn-primary"
                                    onClick={() => this.PaginateCompanies(this.state.previous_page)}>Previous</button>
                            <button className="btn btn-primary"
                            onClick={() => this.PaginateCompanies(this.state.next_page)}>Next</button>
                        </Col>
                        <Col>
                            <label>Show Deleted</label>
                            <input type="checkbox" onChange={this.showDeleted}/>
                        </Col>
                        <Col>
                            <select className="form-select" value={this.state.filter_condition}
                                    onChange={event => this.setState({filter_condition: event.target.value})}>
                                <option defaultValue="Choose Filter Condition">Choose Filter Condition</option>
                                <option value="businessName">Business Name</option>
                                <option value="city">City</option>
                            </select>
                        </Col>
                        <Col>
                            <input type="text" className="form-control"
                            placeholder={"Insert filtering value"} value={this.state.filter_by}
                                   onChange={event => this.setState({filter_by: event.target.value})}/>
                        </Col>
                        <Col>
                            <button className="btn btn-success" onClick={this.filterCompanies}>Filter</button>
                            <button className="btn btn-danger" onClick={() => {
                                this.setState({filter_by: '', filter_condition: ''})
                                this.PaginateCompanies(this.main_link)
                            }}>Clear Filters</button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <button className="btn btn-primary">
                                <Link className="text-white" to={"/company/new"}>Create New Company</Link>
                            </button>
                        </Col>

                    </Row>
                </Container>
            </div>
        );
    }
}

export default CompaniesPanel