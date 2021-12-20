import React from "react";

const main_headers = (auth_token) =>{
  return (
      {'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`}
  )
}

export default class CompanyService {

    static deleteCompany(auth_token, company_id) {
        return fetch(`http://127.0.0.1:8000/cmr/companies/${company_id}/`, {
            method: 'DELETE',
            headers: main_headers(auth_token)
        })
            .then(response => response.json())
            .catch(error => alert(error))
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

}