import { useContext, useEffect, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { FaFilter, FaRedo } from "react-icons/fa";
import { FcTimeline } from "react-icons/fc";
import Creatable from 'react-select/creatable';
import { EventsContext } from "../../contexts/EventsContextProvider";
import { EventProp } from "../../interfaces/event_interfaces";
import DangerConfirmationModal, { ConfirmationAction } from "../common/DangerConfirmationModal";
import { LoadingMessage } from "../common/LoadingMessages";
import EventsTable from "../events/EventsTable";

function EventsPage() {
    const [activeTab, setActiveTab] = useState("Events");
    const [userInput, setUserInput] = useState('');
    const { events, archiveEvents, fetchEvents, fetchFilteredEvents, deleteAllEvents } = useContext(EventsContext)!;
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filteredEvents, setFilteredEvents] = useState<EventProp[]>(events);

    const handleUserInputChange = (newValue: string | undefined) => {
        console.log('New Value:', newValue);
        console.log('Events:', events);
        setUserInput(newValue || '');
        setFilteredEvents(newValue === undefined ? events : []);
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
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userInput, events]);


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
