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
                <p>Category: {categoryName}</p>
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