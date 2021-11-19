import React, {useEffect, useState} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import ApiService from "../ApiService";
import {Col, Container, Row} from "react-grid-system";
import {useCookies} from "react-cookie";
import cookie from "react-cookies"

function CompanyDetail(props) {
    const params = useParams()
    const [details, setDetails] = useState([])
    const [role, setRole] = useState("0")

    useEffect(() => {
        ApiService.GetCompanyDetails(props.token, params.companyID).then(response => setDetails(response))
            .catch(error => alert(error))
    }, [])

    useEffect(() => {
        setRole(cookie.load("user_role"))
    })

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
                                <Link className="text-white" to={"/home"}>Back</Link>
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
                                <button className="btn btn-danger">Delete Company</button>
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