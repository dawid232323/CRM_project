import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-grid-system";
import ApiService from "../../ApiService";
import {useParams} from "react-router-dom";


export default function CompanyForm(props) {

    const params = useParams()
    const [details, setDetails] = useState([])
    const [businesses, setBusinesses] = useState([])
    const [name, setName] = useState('')
    const [nip, setNip] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [business, setBusiness] = useState('')
    const [added_by, setAdded_By] = useState('')

    useEffect(() => {
        if (!props.is_new){
            ApiService.GetCompanyDetails("3830179166ab484e973a682262156bb16b6490e5", params.companyID)
                .then(response => setDetails(response))
                .catch(error => alert(error))
            ApiService.ListBuisinesses("3830179166ab484e973a682262156bb16b6490e5")
                .then(response => {
                    setBusinesses(response)
                })
                .catch(error => alert(error))
        }

    }, [])

    useEffect(() => {
        if (!props.is_new){
            setName(details.company_name)
            setNip(details.company_nip)
            setAddress(details.company_address)
            setCity(details.company_city)
            setBusiness(details.company_business)
            setAdded_By(details.company_added_by)
        }

    }, [details])

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <label htmlFor="name" className="form-label">Set Company Name</label>
                        <input className="form-control" value={name} onChange={event => setName(event.target.value)}
                        id="name" type="text"/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="nip" className="form-label">Set Company NIP</label>
                        <input className="form-control" value={nip} onChange={event => setNip(event.target.value)}
                        id="nip" type="text"/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="address" className="form-label">Set Company Address</label>
                        <input className="form-control" value={address} onChange={event => setAddress(event.target.value)}
                        id="address" type="text"/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="city" className="form-label">Set Company City</label>
                        <input className="form-control" value={city} onChange={event => setCity(event.target.value)}
                        id="city" type="text"/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <label htmlFor="buisness" className="form-label">Set Company Buisiness</label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <select id="business" className="form-select-lg"
                                onChange={event => {
                                    setBusiness(event.target.value)
                                }}>
                            <option selected>Choose Business</option>
                            {businesses.map(business => (
                                <option key={business.id} value={business.id}>{business.business_name}</option>
                            ))}

                        </select>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}