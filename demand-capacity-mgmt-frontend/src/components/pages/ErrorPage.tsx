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
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '../../Auth.css';

const ErrorPage: React.FC = () => {
    const [randomNumber, setRandomNumber] = useState<number>(1);
    const navigate = useNavigate(); // Use useNavigate hook

    useEffect(() => {
        const randomNum = Math.floor(Math.random() * 9) + 1;
        setRandomNumber(randomNum);
    }, []);

    return (
        <div>
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col xs={10} sm={8} md={6} lg={4}>
                    <div className='error-text'>
                        <img src={`/media/error/error(${randomNumber}).png`} alt='erroricon' width="100" height="100" className='d-inline-block align-text-top' />
                        <h1>Oops! Something went wrong.</h1>
                        <p>Sorry, we encountered an error while processing your request.</p>
                        <a href="/back"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(-4);
                            }}
                            className="ms-2 text-muted"
                            style={{ cursor: 'pointer' }}
                        >
                            <FaArrowLeft className='me-1' />
                            Go Back
                        </a>

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
};

export default ErrorPage;
