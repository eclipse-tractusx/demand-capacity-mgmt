import React from "react";
import { Button, Modal, Table } from "react-bootstrap";

interface BottleNeckModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    selectedMonth: string;
    selectedWeekDeltaData: { week: number; delta: number }[];
    categoryName: string;
}
const BottleNeckModalComponent: React.FC<BottleNeckModalProps> = ({
                                                                      showModal,
                                                                      setShowModal,
                                                                      selectedMonth,
                                                                      selectedWeekDeltaData,
                                                                      categoryName, // Receive categoryName prop
                                                                  }) => {
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{selectedMonth}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Category: {categoryName}</p> {/* Display category name */}
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Week</th>
                        <th>Delta</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedWeekDeltaData.map((weekData, index) => (
                        <tr key={index}>
                            <td>Week {weekData.week}</td>
                            <td>{weekData.delta.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BottleNeckModalComponent;