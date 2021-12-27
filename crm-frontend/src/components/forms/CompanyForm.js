import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-grid-system";
import ApiService from "../../Api_services/ApiService";
import {Link, useNavigate, useParams} from "react-router-dom";
import {confirmAlert} from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import cookie from "react-cookies";
import {string} from "prop-types";


export default function CompanyForm(props) {

    const navigator = useNavigate()
    const params = useParams()
    const [details, setDetails] = useState([])
    const [businesses, setBusinesses] = useState([])
    const [company_name, setName] = useState('')
    const [company_nip, setCompany_nip] = useState('')
    const [company_address, setCompany_address] = useState('')
    const [company_city, setCompany_city] = useState('')
    const [company_business, setCompany_business] = useState('')
    const [added_by, setAdded_By] = useState('')

    const goBack = () => {
        confirmAlert({
            title: 'Confirm to go back',
            message: 'Are you sure you want to go back?',
            buttons: [
                {
                    label: 'YES',
                    onClick: () => navigator(`/logged/companies`)
                },
                {
                    label: 'NO',
                    onClick: null
                }
            ]
        })
    }

    const check_response = (response) => {
        if ('id' in response){
            const type = params.is_new? 'created' : 'edited'
                    confirmAlert({
                    title: 'Success!',
                    message: `Company ${type} successfully!`,
                    buttons: [
                        {
                            label: 'OK',
                            onClick: null
                        }
                    ]
                })
                navigator(`/company/${response.id}`)
                } else {
                    let bad_requests = []
                    for (let item in response) {
                        bad_requests.push(`${item}: ${response[item]} \n`)
                    }
                    confirmAlert({title: 'Bad Request',
                        message: 'Check following data:\n' + bad_requests,
                        buttons: [
                            {
                                label: 'OK',
                                onClick: null
                            }
                        ]
                    }
                    )
                }
    }

    const confirmData = () => {
        const body = {company_name, company_nip, company_address, company_city, company_business, added_by}
        ApiService.EditCompany(cookie.load('auth_token'), body, params.companyID)
            .then(response => check_response(response)
            )
            .catch(error => alert(error))

    }

    const createCompany = () => {
        const body = {company_name, company_nip, company_address, company_city, company_business}
        ApiService.CreateCompany(cookie.load('auth_token'), body)
            .then(response => check_response(response))
            .catch(error => alert(error))
    }

    useEffect(() => {
        if (!props.is_new){
            ApiService.GetCompanyDetails(cookie.load('auth_token'), params.companyID)
                .then(response => setDetails(response))
                .catch(error => alert(error))
        }
        ApiService.ListBuisinesses(cookie.load('auth_token'))
            .then(response => {
                setBusinesses(response)
            })
            .catch(error => alert(error))


    }, [])

    useEffect(() => {
        if (!props.is_new){
            setName(details.company_name)
            setCompany_nip(details.company_nip)
            setCompany_address(details.company_address)
            setCompany_city(details.company_city)
            setCompany_business(details.company_business)
            setAdded_By(details.company_added_by)
        }

    }, [details])

    return (
        <div className={props.is_new === true ? "detailsBackground" : null}>
            <Container>
                {props.is_new === true?
                <Row>
                    <Col>
                        <h1 className="display-3">Create New Company</h1>
                    </Col>
                </Row> : null}
                <Row>
                    <Col>
                        <label htmlFor="name" className="form-label">Set Company Name</label>
                        <input className="form-control" value={company_name} onChange={event => setName(event.target.value)}
                               id="name" type="text"/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="nip" className="form-label">Set Company NIP</label>
                        <input className="form-control" value={company_nip} onChange={event => setCompany_nip(event.target.value)}
                               id="nip" type="text"/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="address" className="form-label">Set Company Address</label>
                        <input className="form-control" value={company_address} onChange={event => setCompany_address(event.target.value)}
                               id="address" type="text"/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="city" className="form-label">Set Company City</label>
                        <input className="form-control" value={company_city} onChange={event => setCompany_city(event.target.value)}
                               id="city" type="text"/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="buisness" className="form-label">Set Company Buisiness</label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <select id="business" className="form-select-lg"
                                onChange={event => {
                                    setCompany_business(event.target.value)
                                }}>
                            <option selected>Choose Business</option>
                            {businesses.map(business => (
                                <option key={business.id} value={business.id}>{business.business_name}</option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <button className="btn btn-danger" onClick={goBack}>
                            Abort
                        </button>
                        <button className="btn btn-success" onClick={props.is_new ? createCompany : confirmData}>
                            Confirm
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}