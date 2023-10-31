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



import { useEffect, useState } from 'react';
import { Col, Nav, Row, Tab, TabContent } from 'react-bootstrap';
import { FaBell, FaClock, FaCogs, FaFingerprint, FaHeartbeat, FaKey } from 'react-icons/fa';
import { FcEngineering } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { LoadingMessage } from '../common/LoadingMessages';

const AdminPage = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    const navigate = useNavigate()

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            navigate('/error');
        }
    }, [user]);

    if (loading) {
        return <LoadingMessage />; // Show loading spinner when data is loading
    }

    return (<>
        <div className='container mt-4'>
            <div style={{ display: "flex" }}>
                <FcEngineering size={35} />
                <h3 className="icon-text-padding"> Admin Dashboard</h3>
            </div>
            <br />
            <Row>
                <Col md={2} className="tabs-column">
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link className='admin-nav-link' eventKey="general" active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
                                <FaCogs /> General
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className='admin-nav-link' eventKey="tab2" active={activeTab === 'tab2'} onClick={() => setActiveTab('tab2')}>
                                Tab
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className='admin-nav-link' eventKey="alerts" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')}>
                                <FaBell /> Alerts
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className='admin-nav-link' eventKey="keys" active={activeTab === 'keys'} onClick={() => setActiveTab('keys')}>
                                <FaKey /> Keys
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className='admin-nav-link' eventKey="api" active={activeTab === 'api'} onClick={() => setActiveTab('api')}>
                                <FaFingerprint /> API
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className='admin-nav-link' eventKey="scheduledactions" active={activeTab === 'scheduledactions'} onClick={() => setActiveTab('scheduledactions')}>
                                <FaClock /> Scheduled Actions
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className='admin-nav-link' eventKey="system" active={activeTab === 'system'} onClick={() => setActiveTab('system')}>
                                <FaHeartbeat /> System
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
                        <Tab.Pane eventKey="general" className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`}>
                            <h3>General Settings</h3>
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab2" className={`tab-pane fade ${activeTab === 'tab2' ? 'show active' : ''}`}>
                            <h3>Tab 2 Content</h3>
                        </Tab.Pane>
                        <Tab.Pane eventKey="alerts" className={`tab-pane fade ${activeTab === 'alerts' ? 'show active' : ''}`}>
                            <h3>Alerts Content</h3>
                        </Tab.Pane>
                        <Tab.Pane eventKey="keys" className={`tab-pane fade ${activeTab === 'keys' ? 'show active' : ''}`}>
                            <h3>Keys Content</h3>
                        </Tab.Pane>
                        <Tab.Pane eventKey="api" className={`tab-pane fade ${activeTab === 'api' ? 'show active' : ''}`}>
                            <h3>Api Content</h3>

                        </Tab.Pane>
                        <Tab.Pane eventKey="scheduledactions" className={`tab-pane fade ${activeTab === 'scheduledactions' ? 'show active' : ''}`}>
                            <h3>Scheduled Actions Content</h3>
                        </Tab.Pane>
                        <Tab.Pane eventKey="system" className={`tab-pane fade ${activeTab === 'system' ? 'show active' : ''}`}>
                            <h3>System Content</h3>
                        </Tab.Pane>
                    </TabContent>
                </Col>
            </Row>

        </div >
    </>
    );
};

export default AdminPage;

