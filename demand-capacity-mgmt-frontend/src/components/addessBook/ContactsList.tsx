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
import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaEdit, FaEye, FaRegClipboard } from "react-icons/fa";
import 'react-phone-input-2/lib/bootstrap.css';
import 'react-phone-input-2/lib/style.css';
import { AddressBookProps } from "../../interfaces/addressbook_interfaces";
import { CompanyData } from '../../interfaces/company_interfaces';
import ContactModal from './ContactModal';

interface ContactsListProps {
    data: AddressBookProps[];
    company: CompanyData;
    isModal: Boolean;
}

const ContactsList: React.FC<ContactsListProps> = ({ company, data, isModal }) => {

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<AddressBookProps | null>(null);
    const [isEditModal, setisEditModal] = useState(false);

    const [tooltipTextContact, setTooltipTextContact] = useState<{ [key: string]: string }>({});
    const [tooltipTextEmail, setTooltipTextEmail] = useState<{ [key: string]: string }>({});

    const handleCopyToClipboard = (text: string, type: 'contact' | 'email', itemId: string) => {
        navigator.clipboard.writeText(text);

        // Determine which tooltip to set and update the state accordingly
        if (type === 'contact') {
            setTooltipTextContact({ ...tooltipTextContact, [itemId]: 'Copied!' });
            setTimeout(() => setTooltipTextContact({ ...tooltipTextContact, [itemId]: '' }), 3000);
        } else {
            setTooltipTextEmail({ ...tooltipTextEmail, [itemId]: 'Copied!' });
            setTimeout(() => setTooltipTextEmail({ ...tooltipTextEmail, [itemId]: '' }), 3000);
        }
    };

    const renderTooltip = (tooltipText: string) => {
        if (tooltipText) {
            return <Tooltip>{tooltipText}</Tooltip>;
        }
        // Return an empty Tooltip when tooltipText is empty or null
        return <Tooltip hidden={true}></Tooltip>;
    };


    const handleContactClick = (contact: string) => {
        if (contact.includes('@')) {
            window.open(`mailto:${contact}`);
        } else {
            window.open(`tel:${contact}`);
        }
    };

    const handleEditContact = (item: AddressBookProps) => {
        setSelectedContact(item);
        setisEditModal(true);
        setIsContactModalOpen(true);
    };


    return (
        <div className="table-responsive contact-table">
            <table className="table table-borderless custom-table">
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-bottom">
                            <td className="fixed-width text-center align-middle">
                                <img
                                    src={item.picture || '/media/user.jpg'}
                                    className="rounded-circle"
                                    width={64}
                                    height={64}
                                    alt="User"
                                />
                            </td>
                            <td className="fixed-width text-center align-middle">{item.name}</td>
                            <td className="fixed-width align-middle" style={{ cursor: 'pointer' }}>
                                <OverlayTrigger
                                    key={`contact_${item.id}`}
                                    trigger="click"
                                    placement="top"
                                    overlay={renderTooltip(tooltipTextContact[item.id] || '') || <div style={{ display: 'none' }}></div>} // Hide if no tooltip
                                >
                                    <span className="contact-info" data-event="click focus">
                                        <FaRegClipboard
                                            size={15}
                                            className="clip_board_icon ms-2"
                                            onClick={() => handleCopyToClipboard(item.contact, 'contact', item.id)}
                                        />
                                        <span onClick={() => handleContactClick(item.contact)}>+{item.contact}</span>
                                    </span>
                                </OverlayTrigger>

                            </td>
                            <td className="fixed-width align-middle" style={{ cursor: 'pointer' }}>
                                <OverlayTrigger
                                    key={`email_${item.id}`}
                                    trigger="click"
                                    placement="top"
                                    overlay={renderTooltip(tooltipTextEmail[item.id] || '') || <div style={{ display: 'none' }}></div>} // Hide if no tooltip
                                >
                                    <span className="contact-info" data-event="click focus">
                                        <FaRegClipboard
                                            size={15}
                                            className="clip_board_icon ms-2"
                                            onClick={() => handleCopyToClipboard(item.email, 'email', item.id)}
                                        />
                                        <span onClick={() => handleContactClick(item.email)}> {item.email}</span>
                                    </span>
                                </OverlayTrigger>
                            </td>
                            {isModal && (<td className="fixed-width align-middle">
                                <Button variant="outline-primary" onClick={() => handleEditContact(item)}>
                                    <div style={{ display: "flex", justifyContent: "end" }}>
                                        <FaEye size={20} />
                                    </div>
                                </Button>
                            </td>)}
                            {!isModal && (<td className="fixed-width align-middle">
                                <Button variant="outline-primary" onClick={() => handleEditContact(item)}>
                                    <div style={{ display: "flex", justifyContent: "end" }}>
                                        <FaEdit size={20} />
                                    </div>
                                </Button>
                            </td>)}
                        </tr>
                    ))}
                </tbody>
            </table>

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
        </div>

    );
};

export default ContactsList;
