import React, {useEffect, useState} from "react";
import cookie from "react-cookies";
import {Col, Container, Row} from "react-grid-system";
import ApiService from "../Api_services/ApiService";
import {Link, Outlet} from "react-router-dom";
import {FiArrowRightCircle, FiArrowLeftCircle} from "react-icons/fi"
import {confirmAlert} from "react-confirm-alert";
import {bool} from "prop-types";
import {useNavigate} from "react-router";
import FilteringService from "../Api_services/FilteringSerivce";


export default function ContactPersonPanel() {

    const [token, setToken] = useState("3830179166ab484e973a682262156bb16b6490e5")
    const [role, setRole] = useState('')
    const [contacts, setContacts] = useState([])
    const [next_page, setNextPage] = useState('')
    const [previous_page, setPreviousPage] = useState('')
    const [showDeleted, setShowDeleted] = useState(false)
    const [isLogged, setLogged] = useState(Boolean(cookie.load("is_logged")))

    const [filterCondition, setCondition] = useState()
    const [filterBy, setFilterBy] = useState()

    const navigator = useNavigate()

    const deleteContact = (id) => {
        confirmAlert({
            title: "Delete",
            message: `Are you sure you wan to delete contact person ${id}?`,
            buttons: [
                {
                    label: "Yes",
                    onClick: () => ApiService.DeleteContactPerson(token, id)
                                .then(response => console.log(response))
                },
                {
                    label: "No",
                    onClick: null
                }
            ]
        })
    }

    const changePage = (link) => {
        if (link){
            ApiService.ListContacts(token, link)
            .then(response => {
                setContacts(response.results)
                setNextPage(response.next)
                setPreviousPage(response.previous)
            })
            .catch(error => alert(error))
        }
    }

    const applyFilter = () => {
        FilteringService.FilterContacts(token, filterCondition, filterBy)
            .then(response => {
                setContacts(response.results)
                setNextPage(response.next)
                setPreviousPage(response.previous)
            })
    }

    useEffect(() => {
        if (!isLogged) {
            navigator('/login')
        }
    }, [isLogged])

    useEffect(() => {
        // setToken(cookie.load('user_token'))
        setRole(cookie.load('user_role'))
        ApiService.ListContacts(token).then(response => {
            setContacts(response.results)
            setNextPage(response.next)
            setPreviousPage(response.previous)
        }).catch(error => alert(error))
    },[])

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <h3 className="display-3">Contact Persons</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <table className="table">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Surname</th>
                                    <th scope="col">Contact Phone</th>
                                    <th scope="col">Contact Email</th>
                                    <th scope="col">Position</th>
                                    <th scope="col">Company ID</th>
                                    {role != "3" ?
                                    <th scope="col">Additionals</th>
                                    : null}
                                </tr>
                            </thead>
                            <tbody>

                                {((showDeleted && role === "1") ? contacts.filter(contact =>
                                contact.contact_is_deleted===true || contact.contact_is_deleted===false) :
                                contacts.filter(contact => contact.contact_is_deleted===false)).map((contact) => (
                                    <tr key={contact.id}>
                                        <th scope="row">{contact.id}</th>
                                        <td>{contact.contact_name}</td>
                                        <td>{contact.contact_surname}</td>
                                        <td>{contact.contact_phone}</td>
                                        <td>{contact.contact_mail}</td>
                                        <td>{contact.contact_position}</td>
                                        <td>{contact.contact_company}</td>
                                        <td>
                                            {role === "1" ?

                                                <button className="btn btn-danger text-decoration-none"
                                                        onClick={() => deleteContact(contact.id)}>
                                                    Delete Contact
                                                </button>
                                                : null
                                            }
                                            {role === "1" || "2" ?
                                                <button className="btn btn-primary">
                                                    <Link className="text-white text-decoration-none"
                                                          to={`edit/${contact.id}`}>
                                                        Edit Contact
                                                    </Link>
                                                </button> : null
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <button className="btn btn-primary" onClick={() => changePage(previous_page)}>
                            <FiArrowLeftCircle />
                        </button>
                        <button className="btn btn-primary" onClick={() => changePage(next_page)}>
                            <FiArrowRightCircle/>
                        </button>
                    </Col>
                    {role === "1" ?
                        <Col md={1.5}>
                        <label htmlFor="shDeleted" className="label-info form-check-label">Show Deleted</label>
                        <input type="checkbox" checked={showDeleted}
                               onChange={() => setShowDeleted(!showDeleted)} id="shDeleted"
                                className="checkbox checkbox-inline"/>
                    </Col> : null
                    }
                    <Col md={1.5}>
                        <select value={filterCondition} onChange={event => setCondition(event.target.value)}
                        placeholder="Filter Condition" className="form form-select-sm">
                            <option value={null} selected>Filter Condition</option>
                            <option value="surname">Surname</option>
                        </select>
                    </Col>
                    <Col md={2}>
                        <input value={filterBy} placeholder={`What ${filterCondition} do you want?`}
                        onChange={event => setFilterBy(event.target.value)}/>
                    </Col>
                    <Col md={3}>
                        <button className="btn btn-primary" onClick={applyFilter}>
                            Apply Filters
                        </button>
                        <button className={"btn btn-danger"} onClick={() => {
                            changePage("http://127.0.0.1:8000/cmr/contacts/")
                            setCondition('')
                            setFilterBy('')
                        }}>
                            Clear Filters
                        </button>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <button className="btn btn-primary">
                            <Link className="text-white text-decoration-none" to={"new"}>
                                Create New Contact Person
                            </Link>
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    )

}