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
import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Form, Modal, ModalFooter } from 'react-bootstrap';
import { CompanyData } from '../../interfaces/company_interfaces';

interface CompanyModalProps {
    isOpen: boolean;
    handleClose: () => void;
    isEditMode: boolean;
    company: CompanyData;
    initialValues?: CompanyData;
}

const CompanyEditModal: React.FC<CompanyModalProps> = ({
    isOpen,
    handleClose,
    isEditMode,
    company,
    initialValues = {} as CompanyData,
}) => {
    const [formData, setFormData] = useState<CompanyData>(initialValues);
    const [formErrors, setFormErrors] = useState({
        companyname: '',
        bpn: '',
        street: '',
        zipCode: '',
        country: '',
        number: '',
    });


    useEffect(() => {
        if (isEditMode && Object.keys(initialValues).length > 0) {
            // Set form data with initial values when in edit mode and initialValues are available
            setFormData(initialValues);
        } else {
            // Initialize form data with company details when not in edit mode
            setFormData({ ...company });
        }
    }, [initialValues, isEditMode, company]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const errors = {
            companyname: formData.companyName.length === 0 ? 'Company Name is required.' : '',
            bpn: formData.bpn.length === 0 ? 'BP Number is required.' : '',
            street: formData.street.length === 0 ? 'Street is required.' : '',
            zipCode: formData.zipCode.length === 0 ? 'Zip Code is required.' : '',
            country: formData.country.length === 0 ? 'Country is required.' : '',
            number: formData.number.length === 0 ? 'Number is required.' : '',
        };

        setFormErrors(errors);

        const failedValidation = Object.values(errors).some((error) => error !== '');
        if (failedValidation) {
            return;
        }

        /* const newCompany: CompanyData = {
             id: formData.id || '',
             companyName: formData.companyName,
             bpn: formData.bpn,
             street: formData.street,
             zipCode: formData.zipCode,
             country: formData.country,
             number: formData.number,
             contacts: formData.contacts,
             bpnType: formData.bpnType,
             edc_url: formData.edc_url,
             isEdcRegistered: formData.isEdcRegistered,
         };*/

        try {
            if (isEditMode) {
                // Perform update if in edit mode
                // await updateCompany(formData.id, newCompany);
            } else {
                // Perform creation if not in edit mode
                // await createCompany(newCompany);
            }
        } catch (error) {
            console.error('Error creating/updating company:', error);
        }

        handleClose();
    };

    return (
        <Modal
            show={isOpen}
            onHide={handleClose}
            size='lg'
            backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Edit Company' : 'Add Company'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Group>
                        <div className="row">
                            <div className="col-md-7">
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {/* Error handling for company name */}
                                <div className="error-message">{formErrors.companyname}</div>
                            </div>
                            <div className="col-md-5">
                                <Form.Label>BPN</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bpn"
                                    value={formData.bpn}
                                    onChange={handleInputChange}
                                    required
                                />
                                {/* Error handling for address */}
                                <div className="error-message">{formErrors.bpn}</div>
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-5">
                                <Form.Label>Adress</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="adress"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    required
                                />
                                {/* Error handling for company name */}
                                <div className="error-message">{formErrors.companyname}</div>
                            </div>
                            <div className="col-md-2">
                                <Form.Label>Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="companyName"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    required
                                />
                                {/* Error handling for company name */}
                                <div className="error-message">{formErrors.companyname}</div>
                            </div>
                            <div className="col-md-2">
                                <Form.Label>Zip Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bpn"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    required
                                />
                                {/* Error handling for address */}
                                <div className="error-message">{formErrors.bpn}</div>
                            </div>
                            <div className="col-md-3">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bpn"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                                {/* Error handling for address */}
                                <div className="error-message">{formErrors.bpn}</div>
                            </div>
                        </div>
                        <br />
                        <hr />
                        <div className="row">
                            <div className="col-md-12">
                                <Form.Label>Edc Url</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bpn"
                                    value={formData.edc_url}
                                    onChange={handleInputChange}
                                    required
                                />
                                {/* Error handling for address */}
                                <div className="error-message">{formErrors.bpn}</div>
                            </div>
                        </div>
                    </Form.Group>

                </Form>
            </Modal.Body>
            <ModalFooter>
                {/* Submit button */}
                <Button variant="primary" onClick={handleFormSubmit}>
                    {isEditMode ? 'Save Changes' : 'Add Company'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CompanyEditModal;
