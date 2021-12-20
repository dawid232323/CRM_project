import React, {useEffect, useState} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import ApiService from "../Api_services/ApiService";
import {Col, Container, Row} from "react-grid-system";
import cookie from "react-cookies"
import {useNavigate} from "react-router";
import CompanyService from "../Api_services/CompanyService";
import {confirmAlert} from "react-confirm-alert";

function CompanyDetail(props) {
    const params = useParams()
    const [details, setDetails] = useState([])
    const [role, setRole] = useState("0")
    const [token, setToken] = useState(cookie.load('auth_token'))
    const [isLogged, setLogged] = useState(cookie.load('is_logged'))
    const navigator = useNavigate()

    useEffect(() => {
        setRole(cookie.load("user_role"))
        setLogged(cookie.load('is_logged'))
        setToken(cookie.load('auth_token'))
        if (isLogged) {
            ApiService.GetCompanyDetails(token, params.companyID)
                .then(response => setDetails(response))
                .catch(error => alert(error))
        }
        else {
            navigator('/login')
        }
    }, [])

    const deleteCompany = (id) => {
        confirmAlert({
            title: "Are you sure?",
            message: "Are you sure you want to delete this company?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        CompanyService.deleteCompany(token, id)
                            .then(response => console.log(response))
                            .catch(error => alert(error))
                        navigator('/logged/companies/')
                    }
                },
                {
                    label: "No",
                    onClick: null
                }
            ]
        })


    }

    return (
            <div className="detailsBackground">
                <div className="panelTextFields">
                    <Container>
                        <Row>
                            <Col>
                                <h1 className="display-3">Details of {details.company_name}</h1>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <table className="table">
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col">Company ID</th>
                                            <th scope="col">Company Name</th>
                                            <th scope="col">NIP</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">City</th>
                                            <th scope="col">Business ID</th>
                                            <th scope="col">Added By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="col">{details.id}</th>
                                            <td>{details.company_name}</td>
                                            <td>{details.company_nip}</td>
                                            <td>{details.company_address}</td>
                                            <td>{details.company_city}</td>
                                            <td>{details.company_business}</td>
                                            <td>{details.company_added_by}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <button className="btn btn-primary">
                                <Link className="text-white" to={"/logged/companies"}>Back</Link>
                            </button>
                            </Col>

                            {role === "1" || "2" ?
                                <Col>
                                <button className="btn btn-primary">
                                    <Link to={`edit`} className="text-white">Edit Company</Link>
                                </button>
                            </Col> : null
                            }
                            {role === "1" ?
                            <Col>
                                <button className="btn btn-danger"
                                        onClick={() => deleteCompany(params.companyID)}>Delete Company</button>
                            </Col> : null
                            }
                        </Row>
                        <br/>
                        <br/>
                        <Row>
                            <Col>
                                <Outlet/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>


    )

}
export default CompanyDetail