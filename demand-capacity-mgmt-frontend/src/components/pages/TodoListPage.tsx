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
import { FaMagic, FaRedo } from "react-icons/fa";
import { FcTodoList } from "react-icons/fc";
import { DemandContext } from "../../contexts/DemandContextProvider";
import { EventsContext } from "../../contexts/EventsContextProvider";
import { useUser } from "../../contexts/UserContext";
import { EventProp, EventType } from "../../interfaces/event_interfaces";
import { LoadingMessage } from "../common/LoadingMessages";
import DemandsSearch from "../common/Search";
import DemandList from "../demands/DemandList";
import EventsTable from "../events/EventsTable";

function TodoListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchDemandProps } = useContext(DemandContext)!;
  const [showWizard, setShowWizard] = useState(false);
  const [showAddToExisting, setShowAddToExisting] = useState(false);
  const [activeTab, setActiveTab] = useState("Demands");
  const { fetchFilteredEvents } = useContext(EventsContext)!;
  const [filteredEvents, setFilteredEvents] = useState<EventProp[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch events based on the selected event type
        const filteredEvents = await fetchFilteredEvents({
          event: EventType.TODO,
        });
        setFilteredEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching filtered events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFilteredEvents]);

  const toggleWizardModal = () => {
    setShowWizard(!showWizard); // Toggle the state (true to false or false to true)
  };
  const toggleAddToExisting = () => {
    setShowAddToExisting(!showAddToExisting); // Toggle the state (true to false or false to true)
  };

  const handleRefreshClick = () => {
    fetchDemandProps(); // Call your fetchEvents function to refresh the data
  };

  if (loading) {
    return <LoadingMessage />; // Show loading spinner when data is loading
  }

  return (
    <>
      <br />
      <div className="container-xl">
        <div style={{ display: 'flex' }}>
          <FcTodoList size={35} />
          <h3 className="icon-text-padding">Todo Items</h3>
        </div>
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
          <Tab eventKey="Demands" title="Demands">
            <div className="table">
              <div className="table-wrapper">
                <div className="table-title">
                  <div className="row">
                    <div className="col-sm-6">
                      <DemandsSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                      />
                    </div>
                    <div className="col-sm-6">
                      <Button className='btn btn-primary float-end ms-2' onClick={handleRefreshClick}>
                        <FaRedo className="spin-on-hover" />
                      </Button>
                      {user?.role === 'SUPPLIER' && (
                        <>
                          <Button
                            className="btn btn-success float-end ms-2"
                            onClick={() => setShowAddToExisting(true)}
                          >
                            <span>Add to existing</span>
                          </Button>
                          <Button
                            className="btn btn-success float-end"
                            onClick={() => setShowWizard(true)}
                          >
                            <span><FaMagic /> Capacity Group Wizard</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <DemandList
                  searchQuery={searchQuery}
                  showWizard={showWizard}
                  toggleWizardModal={toggleWizardModal}
                  showAddToExisting={showAddToExisting}
                  toggleAddToExisting={toggleAddToExisting}
                  eventTypes={[EventType.TODO, EventType.UN_LINKED]}
                />

              </div>
            </div>
          </Tab>
          <Tab eventKey="Events" title="Events">
            <EventsTable events={filteredEvents} isArchive={false} />
          </Tab>
        </Tabs>

      </div>


    </>
  );
}

export default TodoListPage;