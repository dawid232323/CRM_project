import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-grid-system";
import cookie from "react-cookies";
import {Outlet, useNavigate} from "react-router";
import TradeNotesService from "../Api_services/TradeNotesService";
import {FiArrowRightCircle, FiArrowLeftCircle} from "react-icons/fi"
import {Link} from "react-router-dom";


export default function TradeNotesPanel() {

    const [token, setToken] = useState(cookie.load('auth_token'))
    const [role_id, setRole] = useState(cookie.load('user_role'))
    const [isLogged, setLogged] = useState(cookie.load('is_logged'))

    const [notes, setNotes] = useState([])
    const [nextPage, setNextPage] = useState('')
    const [previousPage, setPreviousPage] = useState('')
    const [showDeleted, setDeleted] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {

        setToken(cookie.load('auth_token'))
        setRole(cookie.load('user_role'))
        setLogged(cookie.load('is_logged'))

        if (!isLogged) {
            navigate('/login')
        }
        else {
            TradeNotesService.listTradeNotes(token)
                .then(response => {
                    setNotes(response.results)
                    setNextPage(response.next)
                    setPreviousPage(response.previous)
                    console.log(notes)
                })
        }
        }, [])

    const fetchOtherPage = (page) => {
        if (page) {
            TradeNotesService.listTradeNotes(token, page)
            .then(response => {
                setNotes(response.results)
                setNextPage(response.next)
                setPreviousPage(response.previous)
            })
        }
    }

    const deleteTradeNote = (noteID) => {
        TradeNotesService.deleteTradeNote(token, noteID)
            .then(response => console.log(response))
            .catch(error => alert(error))
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <h3 className="display-3">Trade Notes</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <table className="table">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Company ID</th>
                                    <th scope="col">Contents</th>
                                    <th scope="col">Added By</th>
                                    {role_id == "1" || "2"?
                                    <th scope="col">Additional Options</th>: null}
                                </tr>
                            </thead>
                            <tbody>
                                {(showDeleted ? notes.filter(note => note.note_is_deleted === true || note.note_is_deleted===false) :
                                    notes.filter(note => note.note_is_deleted === false)).map(note => (
                                    <tr key={note.id}>
                                        <th scope="row">{note.id}</th>
                                        <td>{note.note_company_id}</td>
                                        <td>
                                            <Link to={`contents/${note.id}`} className="text-decoration-none">
                                                Display
                                            </Link>
                                        </td>
                                        <td>{note.note_added_by}</td>
                                        <td>
                                           {role_id === "1" ?
                                            <button className="btn btn-danger text-decoration-none" onClick={() => deleteTradeNote(note.id)}>
                                                Delete
                                            </button> : null
                                        }
                                        {role_id != "3" ?
                                        <button className="btn btn-primary">
                                            <Link to={`/logged/trade_notes/edit/${note.id}`} className="text text-white text-decoration-none">
                                                Edit
                                            </Link>
                                        </button>: null }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <button className='btn btn-primary' onClick={() => fetchOtherPage(previousPage)}>
                            <FiArrowLeftCircle/>
                        </button>
                        <button className="btn btn-primary" onClick={() => fetchOtherPage(nextPage)}>
                            <FiArrowRightCircle/>
                        </button>
                    </Col>
                    <Col>
                        <button className="btn btn-primary checkbox checkbox-inline" onClick={
                            () => setDeleted(!showDeleted)
                        }>
                            Show Deleted
                        </button>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <button className="btn btn-primary">
                            <Link to='/logged/trade_notes/new' className="text-decoration-none text-white">
                                Create new Trade Note
                            </Link>
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Outlet/>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}