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
}