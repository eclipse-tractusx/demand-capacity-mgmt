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
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FaKey, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from "react-spinners"; // Import PacmanLoader component from react-spinners
import { toast } from 'react-toastify';
import '../../Auth.css';
import { useUser } from "../../contexts/UserContext";
import { User } from '../../interfaces/user_interface';
import { login } from '../../util/Auth';

const AuthenticationComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showRegister, setShowRegister] = useState(false);
    const [loading, setLoading] = useState(false); // State to manage loading state
    const { setUser, setRefreshToken, setAccessToken, setExpiresIn } = useUser();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Display the pending message
            const loginPromise = toast.promise(
                new Promise<User>((resolve, reject) => {
                    setTimeout(async () => {
                        try {
                            // Make the login request after the delay
                            const user: User = await login(username, password, setRefreshToken, setAccessToken, setExpiresIn);
                            resolve(user);
                        } catch (error) {
                            reject(error);
                        }
                    }, 1000); // 1 second delay
                }),
                {
                    pending: 'Logging in...',
                    success: 'Login successful.',
                    error: 'Login failed. Please check your credentials.',
                }
            );

            // Wait for the loginPromise to resolve or reject
            const user: User = await loginPromise;

            // If the promise resolves successfully, set user and navigate
            setUser(user);
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            // This will catch errors from the promise or the login function
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page" >

            <Row className="justify-content-center align-items-center min-vh-100 ">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="form">
                        <div className="d-flex flex-column align-items-center mb-4">
                            <img srcSet='/media/logos/cx-short.svg' alt="Logo" width="50" height="auto" />
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
                                <Form onSubmit={handleLogin}>
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

                                    <Button type='submit'>
                                        {loading ? <PulseLoader color="#ffffff" /> : 'Login'}
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