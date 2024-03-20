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

import { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FaPlus, FaSearch } from "react-icons/fa";
import Select from "react-select";
import { AlertsContext } from "../../contexts/AlertsContextProvider";
import { CapacityGroupContext } from "../../contexts/CapacityGroupsContextProvider";
import { DemandContext } from "../../contexts/DemandContextProvider";
import { ConfiguredAlertProps, DedicatedAlert } from "../../interfaces/alert_interface";
import CustomOption from "../../interfaces/customoption_interface";
import AlertMonitoredObjectsOptions from "../common/AlertMonitoredObjectsOptions";
import AlertThresholdTypeOptions from "../common/AlertThresholdTypeOptions";
import StepBreadcrumbs from "../common/StepsBreadCrumbs";


const ConfigureAlertModal = () => {
    const [showConfigureAlertModal, setShowConfigureAlertModal] = useState(false)
    const [step, setStep] = useState(1)
    const initialFormState: ConfiguredAlertProps = {
        id: "",
        alertName: "",
        threshold: "",
        monitoredObjects: "",
        created: "",
        type: "",
        dedicatedAlerts: [],
        triggerTimes: "",
        triggerTimesInThreeMonths: "",

    }
    let { configureAlert } = useContext(AlertsContext)!;
    const [formState, setFormState] = useState<ConfiguredAlertProps>(initialFormState);
    const [selectedDemands, setSelectedDemands] = useState<any[]>([]);
    const [selectedCapacityGroups, setSelectedCapacityGroups] = useState<any[]>([]);
    const [demandOptions, setDemandOptions] = useState<any[]>([]); // State to store options for Creatable component
    const [capacityGroupsOptions, setCapacityGroupsOptions] = useState<any[]>([]); // State to store options for Creatable component
    const { demandprops } = useContext(DemandContext)!;  // Make sure to get the fetchDemands function from the context.
    const { capacitygroups } = useContext(CapacityGroupContext)!;  // Make sure to get the fetchDemands function from the context.
    const [alertType, setAlertType] = useState('');
    const [alertName, setAlertName] = useState('');
    const [alertMonitoredObject, setAlertMonitoredObject] = useState('');
    const [alertDedicatedAlerts, setAlertDedicatedAlerts] = useState<DedicatedAlert[]>([]);
    const [alertThreshold, setAlertThreshold] = useState('');
    const [monitoredObjectsError, setMonitoredObjectsError] = useState<string>('');
    const [thresholdError, setThresholdError] = useState<string>('');
    const [thresholdTypeError, setThresholdTypeError] = useState<string>('');
    const [dedicatedAlertsError, setDedicatedAlertsError] = useState<string>('');

    const handleFormSubmit = async (e: FormEvent) => {
        let configuredAlertProps = {
            id: "",
            alertName: alertName,
            threshold: alertThreshold,
            monitoredObjects: alertMonitoredObject,
            created: "",
            type: alertType,
            triggerTimes: "",
            triggerTimesInThreeMonths: "",
            dedicatedAlerts: alertDedicatedAlerts
        }
        try {
            await configureAlert(configuredAlertProps);
            setShowConfigureAlertModal(false);

        } catch (error) {
            console.error('Error creating demand:', error);
        }
        // refreshConfiguredAlerts();
        //TODO : Saja refresh configured Alerts again
    };

    useEffect(() => {
        try {
            const favoriteIdsSet = new Set<string>(); // Set to store unique favorite material demand IDs
            let materialDemandOptions: any[] = [];
            let capacityGroupsOpt: any[] = [];

            // Fetch material demands from demands prop
            const demandMaterialDemands = demandprops || [];
            const demandCapacityGroups = capacitygroups || [];

            // Filter demand material demands to exclude those with IDs present in favorites
            const filteredDemandOptions = demandMaterialDemands.filter((md: any) => {
                // Exclude demand if its ID is present in favorites
                if (favoriteIdsSet.has(md.id)) {
                    return false;
                }
                return true;
            });
            // Filter demand material capacity groups to exclude those with IDs present in favorites
            const filteredCapacityGroupsOptions = demandCapacityGroups.filter((md: any) => {
                // Exclude demand if its ID is present in favorites
                if (favoriteIdsSet.has(md.id)) {
                    return false;
                }
                return true;
            });

            // Map demand material demands to options
            const demandOptions = filteredDemandOptions.map((md: any) => {
                const label = (
                    <div>
                        {md.materialNumberCustomer || 'N/A'} - {md.materialNumberSupplier || 'N/A'} - {md.materialDescriptionCustomer || 'N/A'}
                    </div>
                );
                return {
                    value: md,
                    label: label,
                };
            });

            const capacityGroupsOptions = filteredCapacityGroupsOptions.map((cg: any) => {
                const label = (
                    <div>
                        {cg.name || 'N/A'} - {cg.numberOfMaterials || 'N/A'} - {cg.supplierBNPL || 'N/A'}
                    </div>
                );
                return {
                    value: cg,
                    label: label,
                };
            });
            // Combine favorite options and demand options
            materialDemandOptions = [...demandOptions];
            capacityGroupsOpt = [...capacityGroupsOptions];
            setDemandOptions(materialDemandOptions); // Update options state with combined material demands
            setCapacityGroupsOptions(capacityGroupsOpt); // Update options state with combined material demands
        } catch (error) {
            console.error('Error fetching filtered capacity groups:', error);
        }
    }, [demandprops, capacitygroups]);

    const handleRemoveDemand = (index: number) => {
        const updatedDemands = [...selectedDemands];
        updatedDemands.splice(index, 1);
        setSelectedDemands(updatedDemands);
    };

    const handleRemoveCapacityGroup = (index: number) => {
        const updatedCapacityGroups = [...selectedCapacityGroups];
        updatedCapacityGroups.splice(index, 1);
        setSelectedCapacityGroups(updatedCapacityGroups);
    };

    const openConfigureModal = () => {
        setShowConfigureAlertModal(true);
    }

    const nextButtonClicked = () => {
        validateNavigation();
    }
    const previousButtonClicked
        = () => {
            if (step > 0) {
                setStep(step - 1);
            }
        };

    const handleMonitoredObjectsChange = (value: string) => {
        setFormState((prevFormState) => ({
            ...prevFormState,
            id: value,
        }));
        setAlertMonitoredObject(value);

    };

    const validateNavigation = () => {
        let dedicatedAlerts1: DedicatedAlert[] = [];
        selectedDemands.map(md => {
            return dedicatedAlerts1.push({
                type: "MATERIAL_DEMAND",
                objectId: md.id
            });
        });
        selectedCapacityGroups.map(cg => {
            return dedicatedAlerts1.push({
                type: "CAPACITY_GROUP",
                objectId: cg.internalId
            });
        });
        const x = dedicatedAlerts1;

        setAlertDedicatedAlerts(x);

        const errors = {
            monitoredObject: alertMonitoredObject.length === 0 ? 'Monitored Objects is required.' : '',
            threshold: step === 3 && !alertThreshold ? 'Threshold is required.' : '',
            thresholdType: step === 3 && !alertType ? 'Threshold Type is required.' : '',
            dedicatedAlerts: step === 2 && (alertMonitoredObject === "DEDICATED" && x.length === 0) ? 'Dedicated Alerts is required. ' : '',
        };

        // Set error messages
        setMonitoredObjectsError(errors.monitoredObject);
        setThresholdError(errors.threshold);
        setThresholdTypeError(errors.thresholdType);
        setDedicatedAlertsError(errors.dedicatedAlerts);


        const numericValue = parseFloat(alertThreshold);

        let updatedThresholdError = errors.threshold;
        if (formState.type === 'RELATIVE') {
            // Validate for RELATIVE type
            if (!isNaN(numericValue) && ((numericValue >= -100 && numericValue < 0) || (numericValue > 0 && numericValue <= 100))) {
                updatedThresholdError = "";
            } else {
                // Display an error message or handle invalid input
                updatedThresholdError = "For RELATIVE type, enter a number between 0 and 100 (excluding 0)";
            }
        } else if (formState.type === 'ABSOLUTE') {
            // Validate for ABSOLUTE type
            if (!isNaN(numericValue) && numericValue !== 0) {
                updatedThresholdError = "";//setThresholdError('');
            } else {
                // Display an error message or handle invalid input
                updatedThresholdError = "For ABSOLUTE type, enter a numeric value (excluding 0)";
            }
        }
        setThresholdError(updatedThresholdError);

        if ((step === 1 && errors.monitoredObject.length === 0) ||
            (step === 2 && errors.dedicatedAlerts.length === 0) ||
            (step === 3 && errors.thresholdType.length === 0 && updatedThresholdError.length === 0)) {

            if (alertMonitoredObject !== "DEDICATED" && step === 1) {
                // skip the select Demands step
                setStep(step + 2);
            } else {
                setStep(step + 1);
            }
        }
    }


    const handleThresholdTypeChange = (value: string) => {
        setFormState((prevFormState) => ({
            ...prevFormState,
            type: value,
        }));
        setAlertType(value);
    };

    const handleAlertNameChange = (newValue: string) => {
        setAlertName(newValue);
    };
    const handleThresholdChange = (newValue: any) => {
        setAlertThreshold(newValue);
    };

    const handleCloseButton = () => {
        setShowConfigureAlertModal(false);
        setStep(1);
        setSelectedDemands([]);
        setSelectedCapacityGroups([]);
    };

    return <div className="d-flex justify-content-end align-items-center">

        <Button className="btn btn-success d-flex justify-content-center align-items-center" variant="secondary" onClick={openConfigureModal}>
            <span className="me-2"><FaPlus /></span>
            <span> New Rule </span>
        </Button>
        <Modal
            show={showConfigureAlertModal}
            onHide={handleCloseButton}
            backdrop="static"
            keyboard={false}
            size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Alert Rule Wizard</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {step === 1 &&
                        <div className="step1">
                            <StepBreadcrumbs welcome={false} maxSteps={4} currentStep={1} />
                            <center><h5>Initial Setup</h5></center>
                            <Form.Group className="mb-3 required">
                                <Form.Label>Alert Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Alert Name"
                                    id="alertName"
                                    name="materialNumberSupplier"
                                    onChange={(e) => handleAlertNameChange(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="form-group required" as={Col}>
                                <Form.Label className="control-label required-field-label">Monitored Objects</Form.Label>
                                <AlertMonitoredObjectsOptions selectedMonitoredObjectId={formState.monitoredObjects}
                                    onChange={handleMonitoredObjectsChange} />
                            </Form.Group><br />
                            <div className="error-message">{monitoredObjectsError}</div><br />

                        </div>}


                    {(step === 2 && alertMonitoredObject === "DEDICATED") &&
                        <div className="step2">
                            <StepBreadcrumbs welcome={false} maxSteps={4} currentStep={2} />
                            <center><h5>Select Dedicated</h5></center>
                            <Form.Text>Select Demands</Form.Text>
                            <Container className="mt-4">
                                <Select
                                    options={demandOptions}
                                    value={null} //Just so that we don't get stuck on the data that was selected
                                    onChange={selectedOption => {
                                        if (selectedOption) {
                                            setSelectedDemands([...selectedDemands, selectedOption.value]);
                                        }
                                    }}
                                    isSearchable
                                    placeholder={<><FaSearch /> Search for demands...</>}
                                    components={{
                                        Option: CustomOption, // Use the CustomOption component for rendering options
                                    }}
                                />
                                {selectedDemands.length > 0 && (
                                    <Row>
                                        <Col>
                                            <h3 className="mt-4">Selected Demands:</h3>
                                            {selectedDemands.map((demand, index) => (
                                                <div key={index}
                                                    className="d-flex mt-1 border rounded border-opacity-10 align-items-center">
                                                    {demand && (
                                                        <Button variant="danger" className="ms-3" size="sm"
                                                            onClick={() => handleRemoveDemand(index)}>
                                                            Remove
                                                        </Button>
                                                    )}
                                                    <div className='ms-3 mt-2'>
                                                        <p key={index}>
                                                            <strong>Description:</strong> {demand ? demand.materialDescriptionCustomer : 'Not selected'}
                                                            <br />
                                                            <strong>Customer:</strong> {demand?.customer?.companyName || 'Not selected'}
                                                            <br />
                                                            <strong>Material Number
                                                                Customer:</strong> {demand ? demand.materialNumberCustomer : 'Not selected'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </Col>
                                    </Row>
                                )}

                            </Container>

                            <br />
                            <Form.Text>Select Capacity Groups</Form.Text>

                            <Container className="mt-4">
                                <Select
                                    options={capacityGroupsOptions}
                                    value={null} //Just so that we don't get stuck on the data that was selected
                                    onChange={selectedOption => {
                                        if (selectedOption) {
                                            setSelectedCapacityGroups([...selectedCapacityGroups, selectedOption.value]);
                                        }
                                    }}
                                    isSearchable
                                    placeholder={<><FaSearch /> Search for Capacity Groups...</>}
                                    components={{
                                        Option: CustomOption, // Use the CustomOption component for rendering options
                                    }}
                                />
                                {selectedCapacityGroups.length > 0 && (
                                    <Row>
                                        <Col>
                                            <h3 className="mt-4">Selected Capacity Groups:</h3>
                                            {selectedCapacityGroups.map((capaciyGroup, index) => (
                                                <div key={index}
                                                    className="d-flex mt-1 border rounded border-opacity-10 align-items-center">
                                                    {capaciyGroup && (
                                                        <Button variant="danger" className="ms-3" size="sm"
                                                            onClick={() => handleRemoveCapacityGroup(index)}>
                                                            Remove
                                                        </Button>
                                                    )}
                                                    <div className='ms-3 mt-2'>
                                                        <p key={index}>
                                                            <strong>Name:</strong> {capaciyGroup ? capaciyGroup?.name : 'Not selected'}
                                                            <br />
                                                            <strong>Supplier:</strong> {capaciyGroup?.supplierBNPL || 'Not selected'}
                                                            <br />
                                                            <strong>Number Of Materials:</strong> {capaciyGroup ? capaciyGroup.numberOfMaterials : 'Not selected'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </Col>
                                    </Row>
                                )}
                            </Container>
                            <br />
                            <div className="error-message">{dedicatedAlertsError}</div><br />
                        </div>

                    }

                    {step === 3 && <div className="step3">
                        <StepBreadcrumbs welcome={false} maxSteps={4} currentStep={3} />
                        <center><h5>Threshold</h5></center>
                        <Form.Group className="mb-3 required">
                            <Form.Label>Threshold</Form.Label>
                            <Form.Control
                                type="number"//{formState.type="RELATIVE"? "number" : "text"}
                                placeholder={formState.type === 'RELATIVE' ? '100%' : formState.type === 'ABSOLUTE' ? 'Unit' : 'Threshold'}
                                id="threshold"
                                name="Threshold"
                                onChange={(e) => handleThresholdChange(e.target.value)}
                                onKeyDown={(evt) => evt.key === 'e' && evt.preventDefault()}
                                maxLength={2}
                                max={formState.type === 'RELATIVE' ? 100 : undefined}
                                min={formState.type === 'RELATIVE' ? 0 : undefined}
                            />
                        </Form.Group>

                        <Form.Group className="form-group required" as={Col}>
                            <Form.Label className="control-label required-field-label">Threshold Type</Form.Label>
                            <AlertThresholdTypeOptions selectedThresholdTypeId={formState.type}
                                onChange={(e) => handleThresholdTypeChange(e.toString())} />
                        </Form.Group>

                        <br />
                        <div className="error-message">{thresholdError}</div><br />
                        <div className="error-message">{thresholdTypeError}</div><br />
                    </div>}

                    {step === 4 &&
                        <div>
                            <StepBreadcrumbs welcome={false} maxSteps={4} currentStep={4} />
                            <center><h5>Review and Submit</h5></center>
                            <br />
                            <div className="row mb-2">
                                <div className="col-sm-3">
                                    <h6 className="text-end">Alert Name:</h6>
                                </div>
                                <div className="col-sm-9">
                                    <span>{alertName}</span>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-3">
                                    <h6 className="text-end">Alert Monitored Object:</h6>
                                </div>
                                <div className="col-sm-9">
                                    <span>{alertMonitoredObject}</span>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-3">
                                    <h6 className="text-end">AlertType:</h6>
                                </div>
                                <div className="col-sm-9">
                                    <span>{alertType}</span>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-3">
                                    <h6 className="text-end">Alert Threshold:</h6>
                                </div>
                                <div className="col-sm-9">
                                    <span>{alertThreshold}</span>
                                </div>
                            </div>
                            <br />
                            {selectedDemands.length > 0 && (
                                <>
                                    <h5>Selected Demands:</h5>
                                    <Container className="mt-4">
                                        {selectedDemands.map((demand, index) => (
                                            <Row key={index}>
                                                <Col md={6}>
                                                    {demand && (
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <p>
                                                                    <strong>Description:</strong> {demand ? demand.materialDescriptionCustomer : 'Not selected'}
                                                                    <br />
                                                                    <strong>Customer:</strong> {demand?.customer?.companyName || 'Not selected'}
                                                                    <br />
                                                                    <strong>Material Number
                                                                        Customer:</strong> {demand ? demand.materialNumberCustomer : 'Not selected'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Col>
                                            </Row>
                                        ))}
                                    </Container>
                                </>
                            )}
                            <br />
                            {selectedCapacityGroups.length > 0 && (
                                <>
                                    <h5>Selected Capacity Groups:</h5>
                                    <Container className="mt-4">
                                        {selectedCapacityGroups.map((capacityGroup, index) => (
                                            <Row key={index}>
                                                <Col md={6}>
                                                    {capacityGroup && (
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <p>
                                                                    <strong>Name:</strong> {capacityGroup ? capacityGroup.name : 'Not selected'}
                                                                    <br />
                                                                    <strong>Supplier:</strong> {capacityGroup?.supplierBNPL || 'Not selected'}
                                                                    <br />
                                                                    <strong>Number Of Materials:</strong> {capacityGroup ? capacityGroup.numberOfMaterials : 'Not selected'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Col>
                                            </Row>
                                        ))}
                                    </Container>
                                </>
                            )}
                        </div>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>


                {step !== 1 && (
                    <Button variant="secondary" onClick={previousButtonClicked}>
                        Previous
                    </Button>
                )}

                {step !== 4 && (
                    <Button variant="primary" onClick={nextButtonClicked}>
                        Next
                    </Button>
                )}

                {step === 4 && (
                    <div>
                        <Button variant="primary" onClick={handleFormSubmit}>
                            Submit
                        </Button>
                    </div>
                )}

            </Modal.Footer>
        </Modal>
    </div>

}


export default ConfigureAlertModal;