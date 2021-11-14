export default class ApiService {
    static obtainToken (username, password) {
        return fetch("http://localhost:8000/cmr/request_token/", {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({username, password})
        }).then(resp => resp.json())
    }

    static getCompaniesList (token, request_body = null) {
        return fetch("http://localhost:8000/cmr/companies/", {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            // body: JSON.stringify(request_body)
        }).then(resp => resp.json())
    }

    static RetrieveUserData (user_id, auth_token) {
        return fetch(`http://localhost:8000/cmr/users/${user_id}/`, {
            'method': 'GET',
            headers: {
               'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            }
        })
    }

    static UpdateUser(user_id, auth_token, request_body) {
        return fetch(`http://localhost:8000/cmr/users/${user_id}/`, {
            'method': 'PUT',
            headers: {
               'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            }
        ,
        body: JSON.stringify(request_body)}
        ).then(response => response.json())
    }

    static CreateUser(auth_token, request_body) {
        return fetch(`http://localhost:8000/cmr/users/`, {
            'method': 'POST',
            headers: {
               'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            }
        ,
        body: JSON.stringify(request_body)}
        ).then(response => response.json())
    }
}