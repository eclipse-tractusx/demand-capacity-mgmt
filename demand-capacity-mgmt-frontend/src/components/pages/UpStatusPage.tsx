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
import { FcBullish } from "react-icons/fc";
import { EventsContext } from "../../contexts/EventsContextProvider";
import { EventProp, EventType } from "../../interfaces/event_interfaces";
import EventsTable from "../events/EventsTable";




function UpStatusPage() {
    const { fetchFilteredEvents } = useContext(EventsContext)!;
    const [filteredEvents, setFilteredEvents] = useState<EventProp[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch events based on the selected event type
                const filteredEvents = await fetchFilteredEvents({
                    event: EventType.STATUS_IMPROVEMENT,
                });
                setFilteredEvents(filteredEvents);
            } catch (error) {
                console.error('Error fetching filtered events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Call the fetchData function when the component mounts
    }, []);

    return (
        <>
            <br />
            <div className="container-xl">
                <div style={{ display: "flex", }}>
                    <FcBullish size={35} /><h3 className="icon-text-padding">Positive</h3>
                </div>
                <div className="table">
                    <div className="table-wrapper">
                        <EventsTable events={filteredEvents} isArchive={false} />
                    </div>
                </div>
            </div>
        </>

    );
}

export default UpStatusPage;