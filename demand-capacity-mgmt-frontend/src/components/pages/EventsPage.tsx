/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * *******************************************************************************
 */
import { useContext, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { FaRedo } from "react-icons/fa";
import { FcTimeline } from "react-icons/fc";
import { EventsContext } from "../../contexts/EventsContextProvider";
import DangerConfirmationModal, { ConfirmationAction } from "../common/DangerConfirmationModal";
import EventsTable from "../events/EventsTable";


function EventsPage() {
    const [activeTab, setActiveTab] = useState("Events");
    const { events, archiveEvents, fetchEvents, deleteAllEvents } = useContext(EventsContext)!;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const handleRefreshClick = () => {
        fetchEvents(); // Call your fetchEvents function to refresh the data
    };

    const handleNukeClick = () => {
        setShowConfirmationModal(true);
    };

    const handleConfirmationCancel = () => {
        setShowConfirmationModal(false);
    };

    const handleConfirmationConfirm = () => {
        deleteAllEvents();
        setShowConfirmationModal(false);
    };

    return (<>
        <div className="events-page">
            <br />
            <div className="container-xl">
                <div style={{ display: "flex" }}>
                    <FcTimeline size={35} />
                    <h3 className="icon-text-padding">Event History</h3>
                </div>
                <div className="events-tabs">
                    <Tabs
                        defaultActiveKey="Events"
                        id="events"
                        className="mb-3"
                        activeKey={activeTab}
                        onSelect={(tabKey) => {
                            if (typeof tabKey === "string") {
                                setActiveTab(tabKey);
                            }
                        }}
                    >
                        <Tab eventKey="Events" title="Events">
                            <div className="table-title">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <Button className='mx-1' variant="primary" onClick={handleRefreshClick}>
                                            <FaRedo className="spin-on-hover" />
                                        </Button>
                                        <Button variant="danger" onClick={handleNukeClick}>
                                            Clear all
                                        </Button>
                                    </div>
                                    <div className="col-sm-6">

                                    </div>
                                </div>
                            </div>
                            <div className="tab-content">
                                <EventsTable events={events} />
                            </div>
                        </Tab>
                        <Tab eventKey="Archive" title="Archive">
                            <div className="tab-content">
                                <EventsTable events={archiveEvents} />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
        <DangerConfirmationModal
            show={showConfirmationModal}
            onCancel={handleConfirmationCancel}
            onConfirm={handleConfirmationConfirm}
            action={ConfirmationAction.Delete}
        />
    </>
    );
}

export default EventsPage;
