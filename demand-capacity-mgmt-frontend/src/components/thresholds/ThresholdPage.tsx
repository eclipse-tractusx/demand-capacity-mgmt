import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Form, Button, Row, Col, Table, Toast, Accordion, Card } from 'react-bootstrap';
import { ThresholdsContext } from "../../contexts/ThresholdsContextProvider";
import { ThresholdProp } from "../../interfaces/Threshold_interfaces";
import { CapacityGroupContext } from "../../contexts/CapacityGroupsContextProvider";
import { CompanyContext } from "../../contexts/CompanyContextProvider";

function ThresholdPage() {
    const { thresholds, enabledThresholds, updateThresholds, updateCGThresholds, updateCompanyThresholds } = useContext(ThresholdsContext)!;
    const { companies } = useContext(CompanyContext)!;
    const { capacitygroups } = useContext(CapacityGroupContext)!;
    // State to track the currently active accordion item
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [editableThresholds, setEditableThresholds] = useState<ThresholdProp[]>([]);
    const [editableEnabledThresholds, setEditableCGThresholds] = useState<ThresholdProp[]>(
        enabledThresholds.map(threshold => ({ ...threshold, enabled: false }))
    );
    const [editableCompanyThresholds, setEditableCompanyThresholds] = useState<ThresholdProp[][]>([]);
    const [showToast, setShowToast] = useState(false);
    const [selectedCapacityGroup, setSelectedCapacityGroup] = useState<string>("");
    const [isCapacityGroupSelected, setIsCapacityGroupSelected] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<string>("");
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const chunkThresholds = (thresholds: ThresholdProp[], size: number): ThresholdProp[][] => {
        return thresholds.reduce((acc: ThresholdProp[][], val: ThresholdProp, i: number) => {
            let idx = Math.floor(i / size);
            let page = acc[idx] || (acc[idx] = []);
            page.push(val);
            return acc;
        }, []);
    };

    const handleAccordionToggle = (eventKey: string) => {
        setOpenItems(prevOpenItems => {
            const newOpenItems = new Set(prevOpenItems);
            if (newOpenItems.has(eventKey)) {
                newOpenItems.delete(eventKey);
            } else {
                newOpenItems.add(eventKey);
            }
            return newOpenItems;
        });
    };
    const isItemOpen = (eventKey: string) => openItems.has(eventKey);

    let chunkedThresholds = chunkThresholds(editableThresholds, 4);
    let chunkedEnabledThresholds = chunkThresholds(editableEnabledThresholds, 4);

    useEffect(() => {
        setEditableThresholds(thresholds);
        setEditableCGThresholds(
            enabledThresholds.map(threshold => ({ ...threshold, enabled: false }))
        );

        const chunkedCompanyThresholds = chunkThresholds(
            enabledThresholds.map(threshold => ({ ...threshold, enabled: false })),
            4
        );
        setEditableCompanyThresholds(chunkedCompanyThresholds);
    }, [thresholds, enabledThresholds]);

    const handleThresholdCheckboxChange = (id: number) => {
        const updatedThresholds = editableThresholds.map(threshold => {
            if (threshold.id === id) {
                return { ...threshold, enabled: !threshold.enabled };
            }
            return threshold;
        });
        setEditableThresholds(updatedThresholds);
    };


    const handleCGThresholdCheckboxChange = (id: number) => {
        const updatedEnabledThresholds = editableEnabledThresholds.map(threshold => {
            if (threshold.id === id) {
                return { ...threshold, enabled: !threshold.enabled };
            }
            return threshold;
        });
        setEditableCGThresholds(updatedEnabledThresholds);
    };
    const handleCompanyThresholdCheckboxChange = (id: number) => {
        const updatedCompanyThresholds = editableCompanyThresholds.map(chunk =>
            chunk.map(threshold => {
                if (threshold.id === id) {
                    return { ...threshold, enabled: !threshold.enabled };
                }
                return threshold;
            })
        );
        setEditableCompanyThresholds(updatedCompanyThresholds);
    };

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedCapacityGroup(selectedValue);
        setIsCapacityGroupSelected(selectedValue !== "");
    };

    const handleCompanySelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedCompany(selectedValue);
        setIsCapacityGroupSelected(selectedValue !== "");
    };
    const handleSaveThresholds = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const ruleRequests = editableThresholds.map(threshold => ({
            id: threshold.id,
            enabled: threshold.enabled
        }));

        try {
            await updateThresholds(ruleRequests);
            setShowToast(true); // Show the toast on successful save
        } catch (error) {
            console.error('Error saving thresholds:', error);
        }
    };

    const handleSaveCGThresholds = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const selectedPercentages = editableEnabledThresholds
            .filter(threshold => threshold.enabled)
            .map(threshold => threshold.percentage)
            .join(',');

        const requestBody = {
            cgID: selectedCapacityGroup,
            percentages: `{${selectedPercentages}}`
        };

        try {
            await updateCGThresholds(requestBody);
            setShowToast(true);
        } catch (error) {
            console.error('Error saving CG thresholds:', error);
        }
    };

    const handleSaveCompanyThresholds = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const selectedPercentages = editableCompanyThresholds.flat()
            .filter(threshold => threshold.enabled)
            .map(threshold => threshold.percentage)
            .join(',');

        const requestBody = {
            companyID: selectedCompany,
            percentages: `{${selectedPercentages}}`
        };

        try {
            await updateCompanyThresholds(requestBody);
            setShowToast(true);
        } catch (error) {
            console.error('Error saving company thresholds:', error);
        }
    };



    // Function to render a table for threshold checkboxes
    const renderTable = (chunkedData: ThresholdProp[][], checkboxHandler: (id: number) => void) => (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table striped bordered hover size="sm">
                <tbody>
                {chunkedData.map((chunk: ThresholdProp[], chunkIndex: number) => (
                    <tr key={chunkIndex}>
                        {chunk.map((threshold: ThresholdProp) => (
                            <td key={threshold.id}>
                                <Form.Check
                                    type="checkbox"
                                    id={`threshold-${threshold.id}`}
                                    label={`${threshold.percentage} %`}
                                    checked={threshold.enabled}
                                    onChange={() => checkboxHandler(threshold.id)}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );

    return (
        <div>
            <Accordion activeKey={activeKey}>
                <Card>
                    <Card.Header>
                        <Accordion.Header as={Button} variant="link" eventKey="0" onClick={() => handleAccordionToggle('0')}>
                            Thresholds Management
                        </Accordion.Header>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" in={isItemOpen('0')}>
                        <Card.Body>
                            <Form onSubmit={handleSaveThresholds}>
                                {renderTable(chunkedThresholds, handleThresholdCheckboxChange)}
                                <Button variant="primary" type="submit" className="mt-3">
                                    Save Thresholds
                                </Button>
                            </Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                        <Accordion.Header as={Button} variant="link" eventKey="1" onClick={() => handleAccordionToggle('1')}>
                            Capacity Group Thresholds Management
                        </Accordion.Header>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1" in={isItemOpen('1')}>
                        <Card.Body>
                            <Form onSubmit={handleSaveCGThresholds}>
                                <Row>
                                    <Col sm={4}>
                                        <Form.Label>Select Capacity Group</Form.Label>
                                        <select onChange={handleSelectChange} value={selectedCapacityGroup} className="form-control">
                                            <option value=""></option>
                                            {capacitygroups.map((group) => (
                                                <option key={group.internalId} value={group.internalId}>
                                                    {group.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Col>
                                </Row>
                                {renderTable(chunkedEnabledThresholds, handleCGThresholdCheckboxChange)}
                                <Button variant="primary" type="submit" className="mt-3" disabled={!isCapacityGroupSelected}>
                                    Save Capacity Group Thresholds
                                </Button>
                            </Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                        <Accordion.Header as={Button} variant="link" eventKey="2" onClick={() => handleAccordionToggle('2')}>
                            Company Thresholds Management
                        </Accordion.Header>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2" in={isItemOpen('2')}>
                        <Card.Body>
                            <Form onSubmit={handleSaveCompanyThresholds}>
                                <Row>
                                    <Col sm={4}>
                                        <Form.Label>Select Company</Form.Label>
                                        <select onChange={handleCompanySelectChange} value={selectedCompany} className="form-control">
                                            <option value=""></option>
                                            {companies.map((company) => (
                                                <option key={company.id} value={company.id}>
                                                    {company.companyName}
                                                </option>
                                            ))}
                                        </select>
                                    </Col>
                                </Row>
                                {renderTable(editableCompanyThresholds, handleCompanyThresholdCheckboxChange)}
                                <Button variant="primary" type="submit" className="mt-3" disabled={!selectedCompany}>
                                    Save Company Thresholds
                                </Button>
                            </Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide style={{ position: 'fixed', bottom: 20, right: 20 }}>
                <Toast.Header className="bg-success text-white">
                    <strong className="mr-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>Thresholds updated successfully!</Toast.Body>
            </Toast>
        </div>
    );
}

export default ThresholdPage;
