import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-grid-system";
import cookie from "react-cookies";
import {useNavigate, useParams} from "react-router-dom";
import ApiService from "../../Api_services/ApiService";
import {confirmAlert} from "react-confirm-alert";


export default function ContactForm(props) {

    const [roleId, setRoleID] = useState('')
    const [contactData, setContactData] = useState([])
    const [companies, setCompanies] = useState([])
    const [token, setToken] = useState("3830179166ab484e973a682262156bb16b6490e5")
    const [contact_name, setName] = useState('')
    const [contact_surname, setSurname] = useState('')
    const [contact_phone, setPhone] = useState('')
    const [contact_mail, setMail] = useState('')
    const [contact_position, setPosition] = useState('')
    const [contact_company, setCompany] = useState('')

    const params = useParams()
    const navigator = useNavigate()

    useEffect(() => {
        setRoleID(cookie.load('user_role'))
        if (!props.new) {
            ApiService.GetContactDetails(token, params.contactID)
            .then(response => setContactData(response))
            .catch(error => alert(error))
        }
        else {
            setContactData([{
                contact_name: '',
                contact_surname: '',
                contact_phone: '',
                contact_mail: '',
                contact_position: '',
                contact_company: ''
            }])
        }
        ApiService.GetShortCompaniesList(token)
            .then(response => setCompanies(response))
            .catch(error => alert(error))
    }, [])

    useEffect(() => {
        setName(contactData.contact_name)
        setSurname(contactData.contact_surname)
        setPhone(contactData.contact_phone)
        setMail(contactData.contact_mail)
        setPosition(contactData.contact_position)
        setCompany(contactData.contact_company)
    }, [contactData])

    const SuccessAlert = (id) => {
        confirmAlert({
            title: 'Success',
            message: props.new ? "Company Created Successfully" : "Company Edited Successfully",
            buttons : [
                {
                    label: 'OK',
                    onClick: () => navigator(`/logged/contacts/`)
                }
            ]
        })
    }

    const submit = () => {
        const body = {contact_name, contact_surname, contact_phone, contact_mail,
        contact_position, contact_company}
        if (!props.new){
            ApiService.EditContactPerson(token, params.contactID, body)
            .then(response => SuccessAlert(response.id))
            .catch(error => alert(error))
        }
        else {
            console.log("printing ", body)
            ApiService.CreateContactPerson(token, body)
            .then(response => SuccessAlert(response.id))
            .catch(error => alert(error))
        }
    }

    const abort = () => {

    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        {props.new ? <h1 className="display-2">Create New Contact Person</h1> :
                        <h1 className="display-2">Edit Contact Person</h1>}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label htmlFor="name" className="form-label">Set Contact Person Name</label>
                        <input className="form-control" value={contact_name} id="name" type="text"
                        onChange={event => setName(event.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label htmlFor="surname" className="form-label">Set Contact Person Surname</label>
                        <input className="form-control" value={contact_surname} id="surname" type="text"
                        onChange={event => setSurname(event.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label htmlFor="phone" className="form-label">Set Contact Person Phone Number</label>
                        <input className="form-control" value={contact_phone} id="phone" type="text"
                        onChange={event => setPhone(event.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label htmlFor="mail" className="form-label">Set Contact Person E-mail</label>
                        <input className="form-control" value={contact_mail} id="mail" type="text"
                        onChange={event => setMail(event.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label htmlFor="poaition" className="form-label">Set Contact Person Position</label>
                        <input className="form-control" value={contact_position} id="position" type="text"
                        onChange={event => setPosition(event.target.value)}/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <select id="companies" className="form-select-lg"
                                onChange={event => setCompany(event.target.value)}>
                            <option selected>Choose Company</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.company_name}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <button className="btn btn-success" onClick={submit}>
                            Submit Data
                        </button>
                    </Col>
                    <Col md={10.8}>
                        <button className="btn btn-danger" onClick={abort}>
                            Abort
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}