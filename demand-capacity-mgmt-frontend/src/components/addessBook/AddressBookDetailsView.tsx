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
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaEdit, FaPlus, FaSketch, FaStar } from "react-icons/fa";
import 'react-phone-input-2/lib/bootstrap.css';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from 'react-router-dom';
import { AddressBookContext } from '../../contexts/AdressBookContextProvider';
import { useUser } from '../../contexts/UserContext';
import { AddressBookProps } from "../../interfaces/addressbook_interfaces";
import { CompanyData } from '../../interfaces/company_interfaces';
import CompanyModal from './CompanyModal';
import ContactModal from './ContactModal';
import ContactsList from './ContactsList';

interface CompanyDetailsProps {
    company: CompanyData;
    favoriteCompanies: string[];
}

const AddressBookDetailsView: React.FC<CompanyDetailsProps> = ({ company, favoriteCompanies }) => {
    const { user } = useUser();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isCompanyModalOpen, setisCompanyModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<AddressBookProps | null>(null);
    const [isEditModal, setisEditModal] = useState(false);
    const [contacts, setContacts] = useState<AddressBookProps[]>([]);
    const { addressBooks, fetchAddressBookWithRetry, getAddressBooksByCompanyId } = useContext(AddressBookContext)!;
    const navigate = useNavigate();

    // Set error messages
    setContactError(errors.contact);
    setNameError(errors.name);
    setFunctionError(errors.function);
    setEmailError(errors.email);

    // Check for validation failures
    const failedValidation = Object.values(errors).some(error => error !== '');
    if (failedValidation) {
        return;
    }
    let addressBook: AddressBookCreateProps = {
        query: company.id,
        directQuery: false,
        addressBook: {
            id: "",
            companyId: company.id,
            name: contactName,
            email: email,
            function: contactRole,
            picture: "", // TODO: get the picture that user has uploaded
            contact: contact
        }
    }
    try {
        await updateAddressBook(company.id, addressBook);// TODO: here add addressbook id instead
        setIsEditViewOpen(false);

        useEffect(() => {
            if (!company.id) {
                navigate('/invalid'); // Redirect to the '/invalid' page
                return; // Return null or appropriate component indicating redirection
            }
            fetchAddressBookWithRetry();

        }, [company]);

        useEffect(() => {
            const filteredAddressBooks = getAddressBooksByCompanyId(company.id);
            setContacts(filteredAddressBooks);
        }, [addressBooks, company.id]);

        const handleAddContact = () => {
            setSelectedContact(null);
            setisEditModal(false);
            setIsContactModalOpen(true);
        };

        const handleEditClick = () => {
            setisEditModal(true); // Set edit mode to true
            setisCompanyModalOpen(true); // Open the contact modal
        };


        return (
            <>
                <div className="task-detail">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h2 style={{ marginRight: 'auto' }}>{company.companyName}</h2>

                            <OverlayTrigger
                                key={`tooltip-gr-${company.id}`} // Unique key for Golden Record tooltip
                                placement='top'
                                overlay={<Tooltip id={`tooltip-gr-${company.id}`}>Golden Record</Tooltip>}
                            >
                                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                                    <FaSketch size={35} style={{ color: '#ffa600' }} />
                                    <div className="glitter" />
                                </div>
                            </OverlayTrigger>
                            <FaStar
                                className={favoriteCompanies.includes(company.id) ? "text-warning" : "text-muted"}
                                opacity={favoriteCompanies.includes(company.id) ? "1" : "0.2"}
                                size={35}
                            />

                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h4 className='fw-normal'>{company.bpn}</h4>

                            {user?.role === 'ADMIN' && (
                                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                                    <Button variant="info" onClick={handleEditClick}>
                                        <span className="button-content">
                                            <FaEdit className="icon" /> Edit
                                        </span>
                                    </Button>
                                </div>
                            )}
                        </div>
                        <br />
                        <div className="row">
                            <div className="col">
                                <h5> Address</h5>
                                <p className='fw-normal'>{company.street}, {company.number}
                                    <br />
                                    {company.zipCode}
                                    <br />
                                    {company.country}</p>
                            </div>
                            <div className="col">
                                <h5> Website</h5>
                                <a className='fw-normal' href={company.edc_url}>{company.edc_url}</a>
                            </div>
                        </div>
                        <h6><span >BPM Type: </span>{company.bpnType}</h6>
                        <h6><span>Is Edc Registered: </span>{company.isEdcRegistered}</h6>
                        <br />
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6>
                                    <span
                                        className="company-info"
                                        style={{ cursor: 'pointer', marginRight: '10px', fontSize: '20px' }}>
                                        Contacts
                                    </span>
                                </h6>
                            </div>
                            <div>
                                <Button onClick={handleAddContact}><FaPlus className="icon" /> Add Contact</Button>
                            </div>
                        </div>
                        <hr />
                        <ContactsList company={company} data={contacts || []} isModal={false} />
                    </div>
                </div>

                {isContactModalOpen && (
                    <ContactModal
                        isOpen={isContactModalOpen}
                        handleClose={() => setIsContactModalOpen(false)}
                        isEditMode={isEditModal}
                        company={company}
                        initialValues={
                            selectedContact !== null ? selectedContact : undefined
                        }
                    />
                )}

                {isCompanyModalOpen && (
                    <CompanyModal
                        isOpen={isCompanyModalOpen}
                        handleClose={() => setisCompanyModalOpen(false)}
                        isEditMode={isEditModal}
                        company={company}
                    />
                )}


            </>

        );
    };

    export default AddressBookDetailsView;
