import React from "react";
import { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { Col, Row, Form, Table, Button, Dropdown } from 'react-bootstrap';
import { validateEmail } from 'helpers/utils';
import ErrorMessage from 'helpers/ErrorMessage';
import { PhoenixButtonsDark_TypeDashing } from 'components/webnova/Wrapper/PhoenixButtonsDark_TypeDashing/PhoenixButtonsDark_TypeDashing';
import InputDark_StateDefaultCaptionIcSS from 'components/webnova/Wrapper/InputDark_StateDefaultCaptionI/InputDark_StateDefaultCaptionI.module.css';
import accountStyle from "./Account.module.css";


const Account = ({ layout }: { layout: 'simple' | 'card' | 'split' }) => {
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passRef = useRef(null);
    const passRef2 = useRef(null);
    const initialized = useRef(false);

    const [toggleEmailErr, setToggleE] = useState(false);
    const [togglePasswordErr, setToggleP] = useState(false);
    const [toggleUsernameErr, setToggleU] = useState(false);
    const [togglePassword2Err, setToggleP2] = useState(false);

    let emailError = false;
    let usernameError = false
    let passwordError = false;
    let password2Error = false;

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            window.localStorage.getItem("session_key");
            usernameRef.current.value = window.localStorage.getItem("username");
            emailRef.current.value = window.localStorage.getItem("email");
        }
    }, []);
    const validateAndSaveAccount = () => {
        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passRef.current.value;
        const password2 = passRef2.current.value;

        usernameError = false
        passwordError = false;
        password2Error = false;

        if (username.length < 3) {
            usernameError = true;
        }
        if (password < 3) {
            passwordError = true;
        }
        if (password2 < 3) {
            password2Error = true;
        }

        setToggleE(emailError);
        setToggleP(passwordError);
        setToggleP2(password2Error);
        setToggleU(usernameError)
        if (!emailError && !passwordError && !password2Error && !usernameError) {
            // save account data
        }
    }

    return (
        <>
            <div className={`pb-5 pt-5 ${accountStyle.accounData} darkBg`}>
                <div className="container darkBg">
                    <Row className="flex-center min-vh-100 py-5 darkBg">
                        <Col sm={10} md={8} lg={6}>
                            <div className="text-center mb-7">
                                <h3 className="text-1000">Account Settings</h3>
                            </div>
                            <Form className="darkBg">
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label htmlFor="name">Name</Form.Label>
                                    <Form.Control 
                                        id="name" 
                                        type="text" 
                                        placeholder="Name" 
                                        ref={usernameRef} 
                                        className={`${InputDark_StateDefaultCaptionIcSS.root}`}
                                        disabled
                                    />
                                    {toggleUsernameErr ? <ErrorMessage type={"username"} message={"Invalid username, only letters are allowed."} /> : null}
                                </Form.Group>
                                <Form.Group className="mb-3 text-start">
                                    <Form.Label htmlFor="email">Email address</Form.Label>
                                    <Form.Control
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        ref={emailRef}
                                        className={`${InputDark_StateDefaultCaptionIcSS.root}`}
                                        disabled
                                    />
                                </Form.Group>
                                <Row className="mb-5 mt-4">
                                    <Col>
                                        <h4 className="text-1000">Change Your Password</h4>
                                    </Col>
                                </Row>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password</Form.Label>
                                    <Form.Control 
                                        id="password" 
                                        type="password" 
                                        placeholder="Password" 
                                        ref={passRef} 
                                        className={`${InputDark_StateDefaultCaptionIcSS.root}`}
                                    />
                                    {togglePasswordErr ? <ErrorMessage type={"password"} message={"Invalid password."} /> : null}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="confirmPassword">
                                        Confirm Password
                                    </Form.Label>
                                    <Form.Control
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        ref={passRef2}
                                        className={`${InputDark_StateDefaultCaptionIcSS.root}`}
                                    />
                                    {togglePassword2Err ? <ErrorMessage type={"password"} message={"Invalid password."} /> : null}
                                </Form.Group>
                                <Row>
                                    <Col className="mb-5">

                                    </Col>
                                </Row>
                                <PhoenixButtonsDark_TypeDashing className="w-100 mb-3" text={{ label: "Save" }} onClick={validateAndSaveAccount} />
                            </Form>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default Account;