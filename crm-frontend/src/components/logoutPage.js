import React from "react";
import cookie from "react-cookies";
import { useNavigate} from "react-router";
import {confirmAlert} from "react-confirm-alert";


export default function LogoutPage(props) {

    const history = useNavigate()

    const alert = () => {
        confirmAlert({
            title: 'Confirmation',
            message: 'Are you sure you want to quit?',
            buttons : [
                {
                    label: 'Yes',
                    onClick: () => {}
                },
                {
                    label: 'No',
                    onClick: () => {history(-1)}
                }
            ]
        })
    }


    return confirmAlert({
            title: 'Confirmation',
            message: 'Are you sure you want to quit?',
            buttons : [
                {
                    label: 'Yes',
                    onClick: () => {}
                },
                {
                    label: 'No',
                    onClick: () => {history(-1)}
                }
            ]
        })


}