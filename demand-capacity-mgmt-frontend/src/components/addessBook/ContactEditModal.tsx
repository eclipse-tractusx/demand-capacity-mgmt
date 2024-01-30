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

import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Form, Modal, ModalFooter } from 'react-bootstrap';
import { FileUploader } from "react-drag-drop-files";
import PhoneInput from 'react-phone-input-2';
import { AddressBookContext } from '../../contexts/AdressBookContextProvider';
import { AddressBookCreateProps, AddressBookProps } from '../../interfaces/addressbook_interfaces';
import { CompanyData } from '../../interfaces/company_interfaces';


const emptyAddressBook: AddressBookProps = {
    contact: '',
    name: '',
    function: '',
    email: '',
    id: '',
    companyId: '',
    picture: ''
};

interface ContactModalProps {
    isOpen: boolean;
    handleClose: () => void;
    isEditMode: boolean;
    company: CompanyData;
    initialValues?: AddressBookProps;
}

const ContactEditModal: React.FC<ContactModalProps> = ({
    isOpen,
    handleClose,
    isEditMode,
    company,
    initialValues = emptyAddressBook,
}) => {
    const [formData, setFormData] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({
        contact: '',
        name: '',
        function: '',
        email: '',
    });
    let { updateAddressBook, createAddressBook } = useContext(AddressBookContext)!;
    const [previewImage, setPreviewImage] = useState('');

    const [phone, setPhone] = useState('');

    useEffect(() => {
        // Set initial form data if it's in edit mode
        console.log(initialValues)
        if (isEditMode) {
            setFormData(initialValues);
            setPreviewImage(initialValues.picture);
        } else {
            // Clear form data when not in edit mode (for new contact)
            setFormData(emptyAddressBook);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const clearPreviewImage = () => {
        setPreviewImage('');
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'email' && value.trim() !== '') {
            // Email validation regex pattern
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(value)) {
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Invalid email format.',
                }));
            } else {
                setFormErrors((prevErrors) => ({ ...prevErrors, email: '' }));
            }
        } else if (name === 'email' && value.trim() === '') {
            setFormErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }

        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const fileTypes = ["JPG", "PNG", "GIF"];

    const handleFileDrop = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    const base64String = e.target.result as string;
                    setPreviewImage(base64String);
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const errors = {
            contact: phone.length === 0 ? 'Contact is required.' : '',
            name: formData.name.length === 0 ? 'Contact Name is required.' : '',
            function: formData.function.length === 0 ? 'Contact Role is required.' : '',
            email: formData.email.length === 0 ? 'Email is required.' : '',
        };

        setFormErrors(errors);

        const failedValidation = Object.values(errors).some((error) => error !== '');
        if (failedValidation) {
            return;
        }

        const newContact: AddressBookCreateProps = {
            query: company.id,
            directQuery: false,
            addressBook: {
                id: formData.id || '', // Use formData.id or an empty string if undefined
                companyId: company.id,
                name: formData.name,
                email: formData.email,
                function: formData.function,
                picture: previewImage,
                contact: phone, // Use phone state for contact number
            },
        };
        console.log(newContact)
        try {
            if (isEditMode) {
                // Perform update if in edit mode
                await updateAddressBook(formData.id, newContact);
            } else {
                // Perform creation if not in edit mode
                await createAddressBook(newContact);
            }
        } catch (error) {
            console.error('Error creating/updating address book entry:', error);
        }

        handleClose();
    };

    return (
        <Modal show={isOpen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Edit Contact' : 'Add Contact'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Group>
                        <Form.Label className="control-label">User Photo</Form.Label>
                        {!previewImage && (
                            <FileUploader handleChange={handleFileDrop} types={fileTypes} />
                        )}
                        {previewImage && (
                            <div onClick={clearPreviewImage}>
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="rounded-circle"
                                    width={96}
                                    height={96}
                                />
                                <p>Click to Clear</p>
                            </div>
                        )}
                        <br />
                        <Form.Label className="control-label required-field-label">Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="error-message">{formErrors.name}</div>
                        <br />

                        <Form.Label className="control-label required-field-label">Function</Form.Label>
                        <Form.Control
                            type="text"
                            name="function"
                            value={formData.function}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <div className="error-message">{formErrors.function}</div>
                    <br />

                    <Form.Label className="control-label required-field-label">Phone Number</Form.Label>
                    <PhoneInput
                        country={'de'}
                        value={formData.contact}
                        onChange={(value) => setPhone(value)}
                        inputClass="form-control"
                        containerClass="bootstrap-phone-input"
                        buttonClass="btn btn-primary"
                        inputProps={{
                            name: 'contact',
                            required: true,
                            autoFocus: true,
                        }}
                        inputStyle={{
                            width: '100%',
                        }}
                    />

                    <div className="error-message">{formErrors.contact}</div>
                    <br />

                    <Form.Label className="control-label required-field-label">Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.email}
                        required
                    />
                    <div className="error-message">{formErrors.email}</div>


                </Form>
            </Modal.Body>
            <ModalFooter>
                {/* Submit button */}
                <Button variant="primary" onClick={handleFormSubmit}>
                    {isEditMode ? 'Save Changes' : 'Add Contact'}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ContactEditModal;
