import React from "react";
import ApiService from "../ApiService";

class CompaniesPanel extends React.Component {
    constructor(props) {
        super(props);
        console.log("teraz się wyświetlam")
        this.state.role_id = props.role_id
        this.state.token = props.token
    }

    state = {
        role_id: '',
        companies: [],
        token: '',
        next_page: '',
        previous_page: ''
    }

    componentDidMount() {
        this.setState({token: this.props.token, role_id: this.props.role_id})
        ApiService.getCompaniesList(this.state.token).then(response => this.setState({companies: response.results,
            next_page: response.next, previous_page: response.previous})).catch(error => alert(error))
    }


    render() {
        return (
            <div >
                <table className="table">
                    <thead className="table-bordered">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Nip</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.companies.map((company) => (
                            <tr key={company.id}>
                                <th scope="row">{company.id}</th>
                                <td>{company.company_name}</td>
                                <td>{company.company_nip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default CompaniesPanel