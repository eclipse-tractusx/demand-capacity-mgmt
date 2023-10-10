/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *    See the NOTICE file(s) distributed with this work for additional
 *    information regarding copyright ownership.
 *
 *    This program and the accompanying materials are made available under the
 *    terms of the Apache License, Version 2.0 which is available at
 *    https://www.apache.org/licenses/LICENSE-2.0.
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *    License for the specific language governing permissions and limitations
 *    under the License.
 *
 *    SPDX-License-Identifier: Apache-2.0
 *    ********************************************************************************
 */

import React, { useState } from 'react';
import { login } from '../../util/Auth';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";
import { Form, Button, Col, Row, Toast, ToastContainer, InputGroup } from "react-bootstrap";
import { BarLoader } from "react-spinners"; // Import PacmanLoader component from react-spinners
import { User } from "../../interfaces/user_interface";
import '../../Auth.css';
import { FaKey, FaUser, FaUserAlt } from 'react-icons/fa';

const AuthenticationComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [showRegister, setShowRegister] = useState(false);
    const [loading, setLoading] = useState(false); // State to manage loading state
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async () => {
        try {
            setLoading(true);
            const user: User = await login(username, password);
            setUser(user);
            navigate('/');
        } catch (error) {
            console.error("Failed login", error);
            setErrorMessage("Login failed. Please check your credentials.");
            setShowErrorToast(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page" >

            <Toast className='login-toast'
                show={showErrorToast}
                onClose={() => setShowErrorToast(false)} delay={5000} autohide>
                <Toast.Header>
                    <strong className="mr-auto">Login Error</strong>
                </Toast.Header>
                <Toast.Body>{errorMessage}</Toast.Body>
            </Toast>
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="form">
                        <div className="d-flex flex-column align-items-center mb-4">
                            <img srcSet='/media/logos/cx-short.svg' alt="Logo" width="50" height="auto" className='' />
                            <h4 className="text-center">Demand Capacity Management</h4>
                        </div>
                        {showRegister ? (
                            <div className="register-form">
                                <Form>
                                    <Form.Control type="text" placeholder="Name" />
                                    <Form.Control type="password" placeholder="Password" />
                                    <Form.Control type="email" placeholder="Email" />
                                    <Button variant="primary">Create</Button>
                                </Form>
                                <p className="message">Already registered? <a href="/login" onClick={() => setShowRegister(false)}>Sign In</a></p>
                            </div>
                        ) : (
                            <div className="login-form">
                                <Form>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1"><FaUser /></InputGroup.Text>
                                        <Form.Control
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            aria-describedby="basic-addon1"
                                            placeholder="Username"
                                        />
                                    </InputGroup>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon2"><FaKey /></InputGroup.Text>
                                        <Form.Control
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            aria-describedby="basic-addon2"
                                            placeholder="Password"
                                            type="password"
                                        />
                                    </InputGroup>

                                    <Button onClick={handleLogin}>
                                        {loading ? <BarLoader color="#ffffff" /> : 'Login'}
                                    </Button>
                                </Form>
                                <p className="message">Not registered? <a href="/login" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>Create an Account</a></p>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
            <div className='background'>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>


    );
}

export default AuthenticationComponent;