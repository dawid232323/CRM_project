import React from "react";

const main_headers = (auth_token) =>{
  return (
      {'Content-Type': 'application/json',
                'Authorization': `Token ${auth_token}`}
  )
}

export default class FilteringService {



    static FilterContacts(auth_token, filter_condition, filter_by){
        return fetch(`http://127.0.0.1:8000/cmr/filter/contacts_${filter_condition}=${filter_by}/`, {
            method: 'GET',
            headers: main_headers(auth_token)
        })
            .then(response => response.json())
    }

}