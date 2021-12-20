import React, {useEffect, useState} from "react";
import TradeNotesService from "../../Api_services/TradeNotesService";
import cookie from "react-cookies";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import {Col, Container, Row} from "react-grid-system";
import ApiService from "../../Api_services/ApiService";
import {confirmAlert} from "react-confirm-alert";

export default function TradeNoteForm(props) {

    const [details, setDetails] = useState([])
    const [companies, setCompanies] = useState([])
    const [contents, setContents] = useState()
    const [company, setCompany] = useState()

    const [token, setToken] = useState(cookie.load('auth_token'))
    const [role, setRole] = useState(cookie.load('user_role'))
    const [isLoggged, setLogged] = useState(cookie.load('is_logged'))
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        setToken(cookie.load('auth_token'))
        setRole(cookie.load('user_role'))
        setLogged(cookie.load('is_logged'))
        if (isLoggged){
            if (props.is_new) {
                setDetails([{
                    note_contents: '',
                    note_company_id: ''
                }])
            } else {
                TradeNotesService.getNoteDetails(token, params.noteID)
                    .then(response => setDetails(response))
                    .catch(error => alert(error))
            }
            ApiService.GetShortCompaniesList(token)
                .then(response => setCompanies(response))
                .catch(error => alert(error))
        } else {
            navigate('/login')
        }

    }, [])

    useEffect(() => {
        setContents(details.note_contents)
        setCompany(details.note_company_id)
    }, [details])

    const submitData = () => {
        let body = {note_contents: contents, note_company_id: company}
        if (props.is_new) {
            TradeNotesService.createTradeNote(token, body)
                .then(response => {
                    if (response.hasOwnProperty("id")) {
                        confirmAlert({
                            title: 'Success!',
                            message: 'Trade note created successfully',
                            buttons: [
                                {
                                    label: 'OK',
                                    onClick: () => navigate('/logged/trade_notes')
                                }
                            ]
                        })
                    } else {
                        alert("An error occured")
                        navigate('/logged/trade_notes')
                    }
                })
        } else {
            TradeNotesService.editTradeNotes(token, params.noteID, body)
                .then(response => {
                    if (response.hasOwnProperty("id")) {
                        confirmAlert({
                            title: 'Success!',
                            message: 'Trade note edited successfully',
                            buttons: [
                                {
                                    label: 'OK',
                                    onClick: () => navigate(`/logged/trade_notes/contents/${params.noteID}`)
                                }
                            ]
                        })
                    } else {
                        alert("An error occured")
                        navigate('/logged/trade_notes')
                    }
                })
        }
    }

    const confirmAborting = () => {
        confirmAlert({
            title: "Are you sure?",
            message: "Are you sure you want to go back? New data will be lost",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => navigate(-1)
                },
                {
                    label: "No",
                    onClick: null
                }
            ]
        })

    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        {props.is_new ? <h1 className="display-2">Create new trade note</h1>:
                        <h1 className="display-2">Edit {details.id} trade note</h1> }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label htmlFor="contents" className="form-label">Set trade note contents</label>
                        <input className="input-group" value={contents}
                               onChange={value => setContents(value.target.value)} id="contents"/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="companies" className="form-label">Set trade note company</label>
                        <br/>
                        <select id="companies" className="form-select-lg"
                                onChange={event => setCompany(event.target.value)}>
                            <option selected={props.is_new}>Choose Company</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}
                                selected={company.id === details.note_company_id}>
                                    {company.company_name}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col md={1.5}>
                        <button className="btn btn-primary" onClick={submitData}>
                            Submit Data
                        </button>
                    </Col>
                    <Col>
                        <button className="btn  btn-danger" onClick={confirmAborting}>
                            Go Back
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}