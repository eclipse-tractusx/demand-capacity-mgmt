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
import React, { useContext, useEffect, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CapacityGroupContext } from "../../contexts/CapacityGroupsContextProvider";
import { CompanyContext } from "../../contexts/CompanyContextProvider";
import { RuleRequest, ThresholdsContext } from "../../contexts/ThresholdsContextProvider";
import { ThresholdProp } from "../../interfaces/threshold_interfaces";

function ThresholdPage() {
    const { thresholds, deleteThresholds, fetchThresholds, addNewThreshold, enabledThresholds, updateThresholds, updateCGThresholds, updateCompanyThresholds } = useContext(ThresholdsContext)!;
    const { companies } = useContext(CompanyContext)!;
    const { capacitygroups } = useContext(CapacityGroupContext)!;
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [editableThresholds, setEditableThresholds] = useState<ThresholdProp[]>([]);
    const [editableEnabledThresholds, setEditableCGThresholds] = useState<ThresholdProp[]>([]);
    const [editableCompanyThresholds, setEditableCompanyThresholds] = useState<ThresholdProp[]>([]);
    const [customThreshold, setCustomThreshold] = useState<string>('');
    const [selectedCapacityGroup, setSelectedCapacityGroup] = useState<string>("");
    const [selectedCompany, setSelectedCompany] = useState<string>("");
    const initializeCheckboxes = (thresholds: ThresholdProp[]): ThresholdProp[] => {
        return thresholds.map(threshold => ({ ...threshold, enabled: false }));
    };

    useEffect(() => {
        setEditableThresholds(thresholds.sort((a, b) => Number(a.percentage) - Number(b.percentage)));
        setEditableCGThresholds(enabledThresholds.filter(t => t.enabled).sort((a, b) => Number(a.percentage) - Number(b.percentage)));
        setEditableCompanyThresholds(enabledThresholds.filter(t => t.enabled).sort((a, b) => Number(a.percentage) - Number(b.percentage)));
    }, [thresholds, enabledThresholds]);

    const handleAccordionToggle = (eventKey: string) => {
        setActiveKey((prevActiveKey) => (prevActiveKey === eventKey ? null : eventKey));
    };

    const handleDeleteThresholds = async () => {
        // Get the IDs of selected thresholds to delete
        const selectedThresholds = editableThresholds.filter((threshold) => threshold.enabled);
        const ruleRequests = selectedThresholds.map(({ id, enabled }) => ({ id, enabled }));

        // Call the deleteThresholds method from the context provider
        await deleteThresholds(ruleRequests);
        toast.success('Changes Saved Successfully !');
        setEditableThresholds(initializeCheckboxes(thresholds));
    };

    const handleAddCustomThreshold = async () => {
        // Convert customThreshold to a number and check if it's a valid number
        const numericCustomThreshold = parseFloat(customThreshold);
        if (customThreshold && !isNaN(numericCustomThreshold)) {
            // Create a request body
            const requestBody = { percentage: numericCustomThreshold };
            // Call the addNewThreshold method with the request body
            await addNewThreshold(requestBody);
            // Fetch thresholds again
            await fetchThresholds();

            // Clear the input field
            setCustomThreshold('');
        }
    };


    const handleCheckboxChange = (id: number, setter: React.Dispatch<React.SetStateAction<ThresholdProp[]>>): void => {
        setter(prev => prev.map(threshold => threshold.id === id ? { ...threshold, enabled: !threshold.enabled } : threshold));
    };

    const handleSelectChange = (
        setter: React.Dispatch<React.SetStateAction<string>>,
        clearCheckboxes: () => void
    ) => (event: React.ChangeEvent<any>) => { // Use "any" type temporarily
        setter(event.target.value);
        clearCheckboxes();
    };
    const updateCGThresholdsWrapper = async () => {
        const enabledPercentages = editableEnabledThresholds
            .filter(threshold => threshold.enabled)
            .map(threshold => threshold.percentage)
            .join(',');

        const requestBody = {
            cgID: selectedCapacityGroup,
            percentages: enabledPercentages ? `{${enabledPercentages}}` : '{}'
        };

        await updateCGThresholds(requestBody);
    };
    const updateCompanyThresholdsWrapper = async () => {
        const enabledPercentages = editableCompanyThresholds
            .filter(threshold => threshold.enabled)
            .map(threshold => threshold.percentage)
            .join(',');

        const requestBody = {
            companyID: selectedCompany,
            percentages: enabledPercentages ? `{${enabledPercentages}}` : '{}'
        };

        await updateCompanyThresholds(requestBody);
    };
    const handleSave = async (
        event: React.FormEvent<HTMLFormElement>,
        getter: () => ThresholdProp[],
        setter: React.Dispatch<React.SetStateAction<ThresholdProp[]>>,
        updater: (ruleRequests: RuleRequest[]) => Promise<void>
    ) => {
        event.preventDefault();

        // Convert customThreshold to a number and check if it's a valid number
        const numericCustomThreshold = parseFloat(customThreshold);
        if (customThreshold && !isNaN(numericCustomThreshold)) {
            const newThreshold = { id: Date.now(), percentage: numericCustomThreshold.toString(), enabled: true };
            setter(prev => [...prev, newThreshold]);
        }

        // Clear the input field using the ref
        const inputElement = document.getElementById('customThresholdInput') as HTMLInputElement;
        if (inputElement) {
            inputElement.value = '';
        }

        const ruleRequests = getter().map(({ id, enabled }) => ({ id, enabled }));
        await updater(ruleRequests);

        toast.success('Changes Saved Successfully !');
        setter(initializeCheckboxes(getter()));
    };


    const renderTable = (thresholds: ThresholdProp[], handler: (id: number) => void) => {
        const chunkSize = 5;
        const chunks = [];

        for (let i = 0; i < thresholds.length; i += chunkSize) {
            chunks.push(thresholds.slice(i, i + chunkSize));
        }

        return (
            <Table striped bordered hover size="sm">
                <tbody>
                    {chunks.map((chunk, chunkIndex) => (
                        <tr key={chunkIndex}>
                            {chunk.map((threshold, index) => (
                                <td key={index}>
                                    <Form.Check
                                        type="checkbox"
                                        id={`threshold-${threshold.id}`}
                                        label={`${threshold.percentage} %`}
                                        checked={threshold.enabled}
                                        onChange={() => handler(threshold.id)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };
    return (
        <div>
            <Accordion activeKey={activeKey}>
                {/* Thresholds Management */}
                <Card>
                    <Card.Header>
                        <Accordion.Header as={Button} variant="link" eventKey="0"
                            onClick={() => handleAccordionToggle('0')}>
                            Thresholds Management
                        </Accordion.Header>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Form
                                onSubmit={(e) => handleSave(e, () => editableThresholds, setEditableThresholds, updateThresholds)}>
                                <Row>
                                    <Col sm={8}>
                                        <Form.Label>Add a Custom Threshold Value</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={customThreshold}
                                            onChange={(e) => setCustomThreshold(e.target.value)}
                                            placeholder="Enter threshold percentage"
                                            key={`customThresholdInput-${activeKey}`} // Use a unique key based on activeKey
                                        />
                                    </Col>
                                    <Col sm={2} className="d-flex align-items-end">
                                        <Button variant="primary" onClick={handleAddCustomThreshold}>
                                            Add Threshold
                                        </Button>
                                    </Col>
                                    <Col sm={2} className="d-flex align-items-end">
                                        <Button variant="danger" onClick={handleDeleteThresholds}>
                                            Delete
                                        </Button>
                                    </Col>
                                </Row>
                                <br />
                                {renderTable(editableThresholds, (id) => handleCheckboxChange(id, setEditableThresholds))}
                                <Row className="mt-3">
                                    <Col sm={12}>
                                        <Button variant="primary" type="submit">
                                            Save Thresholds
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                {/* Capacity Group Thresholds Management */}
                <Card>
                    <Card.Header>
                        <Accordion.Header as={Button} variant="link" eventKey="1"
                            onClick={() => handleAccordionToggle('1')}>
                            Capacity Group Thresholds Management
                        </Accordion.Header>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <Form
                                onSubmit={(e) => handleSave(e, () => editableEnabledThresholds, setEditableCGThresholds, updateCGThresholdsWrapper)}>
                                <Row>
                                    <Col sm={8}>
                                        <Form.Label>Select Capacity Group</Form.Label>
                                        <Form.Control
                                            as="select"
                                            onChange={(handleSelectChange(setSelectedCapacityGroup, () => setEditableCGThresholds(editableEnabledThresholds.map(t => ({ ...t, enabled: false }))))) as any}>
                                            <option value="">Select a capacity group</option>
                                            {capacitygroups.map(group => <option key={group.internalId}
                                                value={group.internalId}>{group.name}</option>)}
                                        </Form.Control>
                                    </Col>
                                </Row>
                                {renderTable(editableEnabledThresholds, (id) => handleCheckboxChange(id, setEditableCGThresholds))}
                                <Row className="mt-3">
                                    <Col sm={12}>
                                        <Button variant="primary" type="submit" disabled={!selectedCapacityGroup}>
                                            Save Capacity Group Thresholds
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                {/* Company Thresholds Management */}
                <Card>
                    <Card.Header>
                        <Accordion.Header as={Button} variant="link" eventKey="2"
                            onClick={() => handleAccordionToggle('2')}>
                            Company Thresholds Management
                        </Accordion.Header>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <Form
                                onSubmit={(e) => handleSave(e, () => editableCompanyThresholds, setEditableCompanyThresholds, updateCompanyThresholdsWrapper)}>
                                <Row>
                                    <Col sm={8}>
                                        <Form.Label>Select Company</Form.Label>
                                        <Form.Control as="select"
                                            onChange={handleSelectChange(setSelectedCompany, () => setEditableCompanyThresholds(editableCompanyThresholds.map(t => ({ ...t, enabled: false }))))}>
                                            <option value="">Select a company</option>
                                            {companies.map(company => <option key={company.id}
                                                value={company.id}>{company.companyName}</option>)}
                                        </Form.Control>
                                    </Col>
                                </Row>
                                {renderTable(editableCompanyThresholds, (id) => handleCheckboxChange(id, setEditableCompanyThresholds))}
                                <Row className="mt-3">
                                    <Col sm={12}>
                                        <Button variant="primary" type="submit" disabled={!selectedCompany}>
                                            Save Company Thresholds
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    );
}

export default ThresholdPage;