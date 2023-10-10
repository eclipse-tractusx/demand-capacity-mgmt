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

import React, {useState} from 'react';
import { login } from '../../util/Auth';
import { useNavigate } from 'react-router-dom';
import {useUser} from "../../contexts/UserContext";
import { Container, Form, Button, Col, Row} from "react-bootstrap";
import {User} from "../../interfaces/user_interface";
import '../../Auth.css';

const AuthenticationComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = async () => {
        try {
            const user: User = await login(username, password);
            setUser(user)
            navigate('/'); // Redirect to home page after login
        } catch (error) {
            console.error("Failed login", error);
        }
    }

    return (
        <Container className="login-page" >
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="form">
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
                                    <Form.Control value={username} onChange={e => setUsername(e.target.value)} placeholder="Username"  />
                                    <Form.Control value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
                                    <Button onClick={handleLogin}>Login</Button>
                                </Form>
                                <p className="message">Not registered? <a href="/login" onClick={(e) => {e.preventDefault(); setShowRegister(true);}}>Create an Account</a></p>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AuthenticationComponent;