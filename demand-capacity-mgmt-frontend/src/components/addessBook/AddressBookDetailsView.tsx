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
import { FaEye, FaRegClipboard, FaSketch, FaStar } from "react-icons/fa";
import 'react-phone-input-2/lib/bootstrap.css';
import 'react-phone-input-2/lib/style.css';
import { AddressBookContext } from '../../contexts/AdressBookContextProvider';
import { AddressBookProps } from "../../interfaces/addressbook_interfaces";
import { CompanyDataProps } from '../../interfaces/company_interfaces';
import ContactModal from './ContactModal';

interface CompanyDetailsProps {
    company: CompanyDataProps;
    favoriteCompanies: string[];
}

const AddressBookDetailsView: React.FC<CompanyDetailsProps> = ({ company, favoriteCompanies }) => {

    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<AddressBookProps | null>(null);
    const [isEditModal, setisEditModal] = useState(false);
    const [contacts, setContacts] = useState<AddressBookProps[]>([]);
    const { addressBooks, fetchAddressBookWithRetry, getAddressBooksByCompanyId } = useContext(AddressBookContext)!;

    useEffect(() => {
        fetchAddressBookWithRetry();
    }, [company]);

    useEffect(() => {
        const filteredAddressBooks = getAddressBooksByCompanyId(company.id);
        setContacts(filteredAddressBooks);
        console.log('Correu!')
    }, [addressBooks, company.id]);

    const handleAddContact = () => {
        setSelectedContact(null);
        setisEditModal(false);
        setIsAddContactModalOpen(true);
    };
    const handleEditContact = (item: AddressBookProps) => {
        setSelectedContact(item);
        setisEditModal(true);
        setIsAddContactModalOpen(true);
    };

    const handleCopyToClipboard = (text: any) => {
        navigator.clipboard.writeText(text);
    };

    const GridViewList: React.FC<{ data: AddressBookProps[] }> = ({ data }) => {
        return (
            <>
                <div className="table-responsive contact-table">
                    <table className="table table-borderless custom-table">
                        <tbody> {data.map((item, index) => (
                            <tr key={index} className="border-bottom">
                                <td className="fixed-width text-center align-middle">
                                    <img
                                        src={item.picture || '/media/user.jpg'}
                                        className="rounded-circle"
                                        width={64}
                                        height={64}
                                    />
                                </td>
                                <td className="fixed-width text-center align-middle">{item.name}</td>
                                <td className="fixed-width align-middle" style={{ cursor: 'pointer' }} onClick={() => handleCopyToClipboard(item.contact)}>
                                    <span className="contact-info">
                                        <FaRegClipboard
                                            size={15}
                                            className='clip_board_icon ms-2' // Add margin to the left (ms-2) for spacing
                                        /> +{item.contact}</span></td>
                                <td className="fixed-width align-middle" style={{ cursor: 'pointer' }} onClick={() => handleCopyToClipboard(item.email)}>
                                    <span className="contact-info">
                                        <FaRegClipboard
                                            size={15}
                                            className='clip_board_icon ms-2' // Add margin to the left (ms-2) for spacing
                                        /> {item.email}
                                    </span>
                                </td>
                                <td className="fixed-width text-center align-middle">
                                    <Button variant="outline-primary" onClick={() => handleEditContact(item)}>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <FaEye size={20} />
                                        </div>
                                    </Button>
                                </td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </>
        );
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
                    <h4 className='fw-normal'>{company.bpn}</h4>
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
                            <Button onClick={handleAddContact}>Add Contact</Button>
                        </div>
                    </div>
                    <hr />
                    <GridViewList data={contacts || []} />
                </div>
            </div>

            {isAddContactModalOpen && (
                <ContactModal
                    isOpen={isAddContactModalOpen}
                    handleClose={() => setIsAddContactModalOpen(false)}
                    isEditMode={isEditModal}
                    company={company}
                    initialValues={
                        selectedContact !== null ? selectedContact : undefined
                    }
                />
            )}


        </>

    );
};

export default AddressBookDetailsView;
