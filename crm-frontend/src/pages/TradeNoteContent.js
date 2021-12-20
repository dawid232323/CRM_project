import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-grid-system";
import {useNavigate, useParams} from "react-router";
import cookie from "react-cookies";
import TradeNotesService from "../Api_services/TradeNotesService";


export default function TradeNoteContent() {

    const [token, setToken] = useState(cookie.load('auth_token'))
    const params = useParams()
    const history = useNavigate()

    const [noteContents, setContents] = useState()

    useEffect(() => {

        setToken(cookie.load('auth_token'))
        TradeNotesService.getNoteDetails(token, params.noteID)
            .then(response => setContents(response.note_contents))

    }, [])

    return (
        <div>
            <h3 className="display-3">
                Note {params.noteID} Contents
            </h3>
            <h4 className="display-6">{noteContents}</h4>
            <button className="btn btn-primary" onClick={() => history('/logged/trade_notes')}>
                Hide
            </button>
        </div>
    )

}