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
import { useContext, useEffect, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { FaFilter, FaRedo } from "react-icons/fa";
import { FcTimeline } from "react-icons/fc";
import { LuStar } from "react-icons/lu";
import Creatable from 'react-select/creatable';
import { EventsContext } from "../../contexts/EventsContextProvider";
import { FavoritesContext } from "../../contexts/FavoritesContextProvider";
import { EventProp } from "../../interfaces/event_interfaces";
import DangerConfirmationModal, { ConfirmationAction } from "../common/DangerConfirmationModal";
import { LoadingMessage } from "../common/LoadingMessages";
import EventsTable from "../events/EventsTable";

function EventsPage() {
    const [activeTab, setActiveTab] = useState("Events");
    const [userInput, setUserInput] = useState('');
    const { events, archiveEvents, fetchEvents, fetchFilteredEvents, deleteAllEvents } = useContext(EventsContext)!;
    const { fetchFavoritesByType } = useContext(FavoritesContext)!;
    const [options, setOptions] = useState<any[]>([]); // State to store options for Creatable component
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filteredEvents, setFilteredEvents] = useState<EventProp[]>(events);


    const handleUserInputChange = (newValue: string | undefined) => {
        setUserInput(newValue || '');

        // Filter events based on userInput (id, capacityGroupId, or objectId)
        const filteredEvents: EventProp[] = events.filter((event) => {
            if (newValue) {
                const lowerCaseValue = newValue.toLowerCase();

                // Check if the input is a number
                const isNumber = !isNaN(Number(lowerCaseValue));

                return (
                    (isNumber && event.id.toString().includes(lowerCaseValue)) ||
                    (!isNumber &&
                        ((event.capacityGroupId && event.capacityGroupId.toString().includes(lowerCaseValue)) ||
                            (event.id && event.id.toString().includes(lowerCaseValue))))
                );
            }
            return true; // Show all events if userInput is empty
        });

        setFilteredEvents(filteredEvents);
    };

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


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let filteredEvents: EventProp[] = [];
                if (userInput !== '') {
                    filteredEvents = await fetchFilteredEvents({
                        material_demand_id: userInput,
                        capacity_group_id: userInput,
                        event: userInput,
                    });
                } else {
                    filteredEvents = events; // Show all events if userInput is empty
                }
                setFilteredEvents(filteredEvents);

                console.log(filteredEvents)

            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }

            try {
                setLoading(true);
                let eventOptions: any[] = [];
                const response = await fetchFavoritesByType('EVENT');
                eventOptions = response?.events?.map((event: any) => {
                    // Create a short timestamp (you can adjust the format as per your requirement)
                    const options: Intl.DateTimeFormatOptions = {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    };
                    const shortTimestamp = new Date(event.timeCreated).toLocaleString(undefined, options);

                    // Combine short timestamp, eventType, and customer in the label
                    const label = (
                        <div>
                            <LuStar size={12} className="text-warning" />  {shortTimestamp} | {event.eventType} | {event.description}
                        </div>
                    );

                    return {
                        value: event.id,
                        label: label,
                    };
                }) || [];
                setOptions(eventOptions); // Update options state with event descriptions
            } catch (error) {
                console.error('Error fetching filtered events:', error);
            } finally {
                setLoading(false);
            }

        };

        fetchData();
    }, [fetchFilteredEvents]);



    return (
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
                                        <Creatable
                                            isClearable
                                            formatCreateLabel={(userInput) => `Search for ${userInput}`}
                                            placeholder={
                                                <div>
                                                    <FaFilter size={12} className="" /> Filter
                                                </div>
                                            }
                                            options={options}
                                            // Handle user input changes and call the filtering function
                                            onChange={(selectedOption) => handleUserInputChange(selectedOption?.value)}
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="float-end ms-3">
                                            <Button className='mx-1' variant="primary" onClick={handleRefreshClick}>
                                                <FaRedo className="spin-on-hover" />
                                            </Button>
                                            <Button variant="danger" onClick={handleNukeClick}>
                                                Clear all
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-content">
                                {loading ? <LoadingMessage /> : <EventsTable events={filteredEvents} isArchive={false} />}
                            </div>
                        </Tab>
                        <Tab eventKey="Archive" title="Archive">
                            <div className="tab-content">
                                <EventsTable events={archiveEvents} isArchive={true} />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <DangerConfirmationModal
                show={showConfirmationModal}
                onCancel={handleConfirmationCancel}
                onConfirm={handleConfirmationConfirm}
                action={ConfirmationAction.Delete}
            />
        </div>
    );
}

export default EventsPage;
