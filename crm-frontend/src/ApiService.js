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

    static ListUsers(auth_token, link='http://127.0.0.1:8000/cmr/users/') {
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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            },
        }).then(resp => resp.json())
    }

    static EditCompany(auth_token, request_body, company_id) {
        return fetch(`http://localhost:8000/cmr/companies/${company_id}/`, {
            'method': 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            },
            body: JSON.stringify(request_body)
        }).then(resp => resp.json())
            .catch(error => console.log(error.detail))
    }

    static CreateCompany(auth_token, request_body) {
        return fetch(`http://localhost:8000/cmr/companies/`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`
            },
            body: JSON.stringify(request_body)
        }).then(resp => resp.json())
            .catch(error => console.log(error.detail))
    }
}