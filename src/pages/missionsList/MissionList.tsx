import React from "react";
import { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { Col, Row, Form, Table, Button, Dropdown } from 'react-bootstrap';
import { validateEmail } from 'helpers/utils';
import { updatePassword } from "helpers/api";
import ErrorMessage from 'helpers/ErrorMessage';
import { PhoenixButtonsDark_TypeDashing } from 'components/webnova/Wrapper/PhoenixButtonsDark_TypeDashing/PhoenixButtonsDark_TypeDashing';
import InputDark_StateDefaultCaptionIcSS from 'components/webnova/Wrapper/InputDark_StateDefaultCaptionI/InputDark_StateDefaultCaptionI.module.css';
import accountStyle from "./MissionList.module.css";


const MissionList = ({ layout }: { layout: 'simple' | 'card' | 'split' }) => {
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            // usernameRef.current.value = window.localStorage.getItem("username");
            // emailRef.current.value = window.localStorage.getItem("email");
        }
    }, []);

    return (
        <>
            <div className={`pb-5 pt-5 ${accountStyle.accounData} darkBg`}>
                <div className="container darkBg">
                    <Row className="flex-center min-vh-100 py-5 darkBg">
                        <Col sm={10} md={8} lg={6}>
                            <div className="text-center mb-7">
                                <h3 className="text-1000">My Missions Queue</h3>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default MissionList;