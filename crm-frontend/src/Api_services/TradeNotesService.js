import React from "react";

const main_headers = (auth_token) =>{
  return (
      {'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`}
  )
}

export default class TradeNotesService {

    static listTradeNotes(auth_token, link='http://127.0.0.1:8000/cmr/notes/') {
        return fetch(link, {
            method: 'GET',
            headers: main_headers(auth_token)
        })
            .then(response => response.json())
    }

    static editTradeNotes(auth_token, note_id, body) {
        return fetch(`http://127.0.0.1:8000/cmr/notes/${note_id}/`, {
            method: 'PUT',
            headers: main_headers(auth_token),
            body: JSON.stringify(body)
        })
            .then(response => response.json())
    }

    static createTradeNote(auth_token, body) {
        return fetch('http://127.0.0.1:8000/cmr/notes/', {
            method: 'POST',
            headers: main_headers(auth_token),
            body: JSON.stringify(body)
        })
            .then(response => response.json())
    }

    static deleteTradeNote(auth_token, note_id) {
        return fetch(`http://127.0.0.1:8000/cmr/notes/${note_id}/`, {
            method: 'DELETE',
            headers: main_headers(auth_token)
        })
            .then(response => response.json())
    }

    static getNoteDetails(auth_token, note_id) {
        return fetch(`http://127.0.0.1:8000/cmr/notes/${note_id}/`, {
            method: 'GET',
            headers: main_headers(auth_token)
        })
            .then(response => response.json())
    }
}