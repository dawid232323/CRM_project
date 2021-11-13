// import React from "react";
import "../App.css"
import {useState, useEffect} from "react";


function MainPanel() {

    const token = "3830179166ab484e973a682262156bb16b6490e5"
    const [users, setUsers] = useState([])
    const self_headers = {'Content-Type':'application/json', 'Authorization':`Token ${token}`}

    useEffect(() => {
        fetch('http://127.0.0.1:8000/cmr/users/', {
            'method': 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Token ${token}`
            }
        }).then(response => response.json())
            .then(response => setUsers(response.results))
            .catch(error => console.log(error))
    }, [])

    const update_articles = (link) => {
        fetch(link, {
            'method': 'GET',
            headers: self_headers
        }).then(respone => respone.json())
            .then(response => setUsers(response.results))
            .catch(error => console.log(error))
        console.log('updated users')
    }

    return(
        <div className="backgroundOne">
            {users.map(user => {
                return (
                    <div key={user.id}>
                        <h3>{user.username}</h3>
                    </div>
                )
            })}
            <button onClick={update_articles('http://127.0.0.1:8000/cmr/users/?page=2')}>Next</button>
        </div>
    )
}

export default MainPanel