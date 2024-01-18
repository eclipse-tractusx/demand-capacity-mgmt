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


import {useEffect, useState} from 'react';
import {Button, Col, Modal, Nav, Row, Tab, TabContent} from 'react-bootstrap';
import {FaBell, FaChartLine, FaClock, FaCogs, FaFingerprint, FaHeartbeat, FaKey, FaQuestion} from 'react-icons/fa';
import {FcEngineering, FcQuestions} from 'react-icons/fc';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../../contexts/UserContext';
import {LoadingMessage} from '../common/LoadingMessages';
import ThresholdPage from "../thresholds/ThresholdPage";

const AdminPage = () => {
    const {user} = useUser();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [showHelpModal, setShowHelpModal] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            navigate('/error');
        }
    }, [user]);

    if (loading) {
        return <LoadingMessage/>; // Show loading spinner when data is loading
    }

    const handleHelpModalClose = () => setShowHelpModal(false);
    const handleQuestionButtonClick = () => setShowHelpModal(true);

    return (<>
            <div className='container mt-4'>

                <div className="row">
                    <div className="col-sm-6">
                        <div style={{display: "flex"}}>
                            <FcEngineering size={35}/>
                            <h3 className="icon-text-padding"> Admin Dashboard</h3>
                        </div>
                    </div>
                    <div className="col-sm-6 d-flex justify-content-end align-items-center">
                        <Button className='btn btn-primary' onClick={handleQuestionButtonClick}>
                            <FaQuestion/>
                        </Button>
                    </div>
                </div>
                <br/>
                <Row>
                    <Col md={2} className="tabs-column">
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link className='admin-nav-link' eventKey="general" active={activeTab === 'general'}
                                          onClick={() => setActiveTab('general')}>
                                    <FaCogs/> General
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className='admin-nav-link' eventKey="alerts" active={activeTab === 'alerts'}
                                          onClick={() => setActiveTab('alerts')}>
                                    <FaBell/> Alerts
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className='admin-nav-link' eventKey="keys" active={activeTab === 'keys'}
                                          onClick={() => setActiveTab('keys')}>
                                    <FaKey/> Keys
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className='admin-nav-link' eventKey="api" active={activeTab === 'api'}
                                          onClick={() => setActiveTab('api')}>
                                    <FaFingerprint/> API
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className='admin-nav-link' eventKey="scheduledactions"
                                          active={activeTab === 'scheduledactions'}
                                          onClick={() => setActiveTab('scheduledactions')}>
                                    <FaClock/> Scheduled Actions
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className='admin-nav-link' eventKey="system" active={activeTab === 'system'}
                                          onClick={() => setActiveTab('system')}>
                                    <FaHeartbeat/> System
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className='admin-nav-link' eventKey="thresholdConfig"
                                          active={activeTab === 'thresholdConfig'}
                                          onClick={() => setActiveTab('thresholdConfig')}>
                                    <FaChartLine/> Threshold Config
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <div className="footer">
                            <p>Version 1.0.0</p>
                        </div>
                    </Col>

                    {/* Right Content Panes */}
                    <Col md={10}>
                        <TabContent>
                            <Tab.Pane eventKey="general"
                                      className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`}>
                                <h3>General Settings</h3>
                            </Tab.Pane>
                            <Tab.Pane eventKey="alerts"
                                      className={`tab-pane fade ${activeTab === 'alerts' ? 'show active' : ''}`}>
                                <h3>Alerts Content</h3>
                            </Tab.Pane>
                            <Tab.Pane eventKey="keys"
                                      className={`tab-pane fade ${activeTab === 'keys' ? 'show active' : ''}`}>
                                <h3>Keys Content</h3>
                            </Tab.Pane>
                            <Tab.Pane eventKey="api"
                                      className={`tab-pane fade ${activeTab === 'api' ? 'show active' : ''}`}>
                                <h3>Api Content</h3>

                            </Tab.Pane>
                            <Tab.Pane eventKey="scheduledactions"
                                      className={`tab-pane fade ${activeTab === 'scheduledactions' ? 'show active' : ''}`}>
                                <h3>Scheduled Actions Content</h3>
                            </Tab.Pane>
                            <Tab.Pane eventKey="system"
                                      className={`tab-pane fade ${activeTab === 'system' ? 'show active' : ''}`}>
                                <h3>System Content</h3>
                            </Tab.Pane>
                            <Tab.Pane eventKey="thresholdConfig"
                                      className={`tab-pane fade ${activeTab === 'thresholdConfig' ? 'show active' : ''}`}>
                                <ThresholdPage/>
                            </Tab.Pane>
                        </TabContent>
                    </Col>
                </Row>

            </div>

            <Modal show={showHelpModal} onHide={handleHelpModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title><FcQuestions size={35}/> Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><a href="https://portal.cofinity-x.com/">Cat-X Portal Core</a></p>
                    <p><a
                        href="https://catena-x.net/fileadmin/user_upload/Standard-Bibliothek/Update_September23/CX-0010-BusinessPartnerNumber_v2.0.0.pdf">Cat-X
                        CX-0010 Business Partner Number Standards</a></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHelpModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default AdminPage;

