// const auth_token = null

const main_headers = (auth_token) =>{
  return (
      {'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`}
  )
}


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

    static getCompaniesList (token, link) {
        return fetch(link, {
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

    static GetUserShortData(auth_token) {
        return fetch('http://127.0.0.1:8000/cmr/user_token_details/', {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            }
        }).then(response => response.json())
    }

    static ListUsers(auth_token, link='http://127.0.0.1:8000/cmr/users/?deleted=False') {
        return fetch(link, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            }
        }).then(response => response.json())
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

    static FilterUsers(auth_token, filter_by, filter_condition) {
        return fetch(`http://127.0.0.1:8000/cmr/filter/users_${filter_by}=${filter_condition}/`, {
            'method': 'GET',
            headers: {
               'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            }
        }).then(response => response.json())
    }

    static GetCompanyDetails(auth_token, company_id) {
        return fetch(`http://localhost:8000/cmr/companies/${company_id}/`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            },
            // body: JSON.stringify(request_body)
        }).then(resp => resp.json())
    }

    static ListBuisinesses(auth_token) {
        return fetch(`http://127.0.0.1:8000/cmr/business/`, {
            'method': 'GET',
            headers: main_headers(auth_token),
        }).then(resp => resp.json())
    }

    static EditCompany(auth_token, request_body, company_id) {
        return fetch(`http://localhost:8000/cmr/companies/${company_id}/`, {
            'method': 'PUT',
            headers: main_headers(auth_token),
            body: JSON.stringify(request_body)
        }).then(resp => resp.json())
            .catch(error => console.log(error.detail))
    }

    static CreateCompany(auth_token, request_body) {
        return fetch(`http://localhost:8000/cmr/companies/`, {
            'method': 'POST',
            headers: main_headers(auth_token),
            body: JSON.stringify(request_body)
        }).then(resp => resp.json())
            .catch(error => console.log(error.detail))
    }

    static ListContacts(auth_token, link="http://127.0.0.1:8000/cmr/contacts/?deleted=False") {
        return fetch(link, {
            method: 'GET',
            headers: main_headers(auth_token)
        })
            .then(response => response.json())
    }

    static GetContactDetails(auth_token, contactId) {
        return fetch(`http://127.0.0.1:8000/cmr/contacts/${contactId}/`, {
            method: 'GET',
            headers: main_headers(auth_token)
        })
            .then(response => response.json())
    }

    static GetShortCompaniesList(auth_token) {
        return fetch(`http://127.0.0.1:8000/cmr/short_companies/`, {
            method: 'GET',
            headers: main_headers(auth_token)
        })
            .then(response => response.json())
    }

    static EditContactPerson(auth_token, contactID, body) {
        return fetch(`http://127.0.0.1:8000/cmr/contacts/${contactID}/`, {
            method: 'PUT',
            headers: main_headers(auth_token),
            body: JSON.stringify(body)
        })
            .then(response => response.json())
    }

    static CreateContactPerson(auth_token, body) {
        return fetch(`http://127.0.0.1:8000/cmr/contacts/`, {
            method: 'POST',
            headers: main_headers(auth_token),
            body: JSON.stringify(body)
        })
            .then(response => response.json())
    }

    static DeleteContactPerson(auth_token, contactID) {
        return fetch(`http://127.0.0.1:8000/cmr/contacts/${contactID}/`, {
            method: 'DELETE',
            headers: main_headers(auth_token)
        })
            .then(response => response.json())
    }
}