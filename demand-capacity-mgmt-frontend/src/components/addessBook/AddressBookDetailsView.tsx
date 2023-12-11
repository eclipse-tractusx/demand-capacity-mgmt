// components/TaskDetail.tsx
import React, {FormEvent, useContext, useState} from 'react';
import {AddressBookCreateProps, AddressBookProps, CompanyDataProps} from "../../interfaces/addressbook_interfaces";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import StepBreadcrumbs from "../common/StepsBreadCrumbs";
import {AddressBookContext} from "../../contexts/AdressBookContextProvider";
interface CompanyDetailsProps {
    company: CompanyDataProps;
}

const AddressBookDetailsView: React.FC<CompanyDetailsProps> = ({ company }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddContactModal, setIsAddContactModal] = useState(false);
    const [contact, setContact] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactRole, setContactRole] = useState('');
    const [email, setEmail] = useState('');
    let {updateAddressBook,createAddressBook} = useContext(AddressBookContext)!;
    const [contactError, setContactError] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [functionError, setFunctionError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [selectedContactIndex, setSelectedContactIndex] = useState<number | null>(null);

    const openEditContactModal = (index: number) => {
        setSelectedContactIndex(index);
        openAddContactModal(); // Open the modal for editing
    };

    const handleEditFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // Add validation logic for editing if needed

        const updatedContacts = company.contacts?.map((contact, index) => {
            if (index === selectedContactIndex) {
                return {
                    ...contact,
                    contact: contact,
                    name: contactName,
                    function: contactRole,
                    email: email,
                };
                // updateAddressBook(contact.id,contact);
            }
            return contact;
        });

        // Update the company object with the edited contacts
        const updatedCompany = {
            ...company,
            contacts: updatedContacts,
        };



        // Perform any necessary API call or state update with the updated company object
        console.log('Updated Company:', updatedCompany);


        // Close the edit modal
        closeAddContactModal();
    };

    const openModal = () => {
        console.log("Opening modal");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openAddContactModal = () => {
        console.log("Opening modal");
        setIsAddContactModal(true);
    };

    const closeAddContactModal = () => {
        setIsAddContactModal(false);
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const errors = {
            contact: contact.length == 0 ? 'Contact is required.' : '',
            name: contactName.length == 0 ?  'Contact Name is required.' : '',
            function: contactRole.length == 0 ?  'Contact Role is required.' : '',
            email: email.length == 0 ? 'Email is required. ' : '',
        };

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
        // let addressBook : AddressBookProps= {
        //     id: "",
        //     companyId:"" ,
        //     name: contactName,
        //     email: email,
        //     function: contactRole,
        //     companyId: company.id,
        //     contact: contact
        // }
        let addressBook : AddressBookCreateProps= {
            query: company.id,
            directQuery: false
        }
        try {
            await createAddressBook(addressBook);
            setIsAddContactModal(false);

        } catch (error) {
            console.error('Error creating demand:', error);
        }
    };

    return (    <>

    <div className="task-detail">
            <br/>
            <h6><span className="company_info_details">Company Name: </span></h6>
            <h6>{company.companyName}</h6><br/>
            <h6><span className="company_info_details">Address: </span></h6>
            <h6>{company.street}, {company.zipCode}</h6>
            <h6>{company.country}</h6>
            <br/>
            <h6><span className="company_info_details">BPN: </span>{company.bpn}</h6><br/>
            {/*<h6><span className="company_info_details">BPM Type: </span>{company.bpnType}</h6><br/>*/}
            <h6><span className="company_info_details">URL: </span>{company.edc_url}</h6>
            <h6><span className="company_info_details">Number: </span>{company.number}</h6><br/>
            {/*<h6><span>Is Edc Registered: </span>{company.isEdcRegistered}</h6>*/}
            <h6><span className="company-info" style={{ cursor: 'pointer', color: 'blue' }} onClick={() => openModal()}>Contacts: </span></h6>

        <Modal
            show={isModalOpen}
            onHide={closeModal}
            size='lg'
            backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Contacts</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <ul>
                        {company.contacts?.map((contact, index) => (
                            <div key={index}>
                                <img
                                    src="https://media.istockphoto.com/id/1413766112/photo/successful-mature-businessman-looking-at-camera-with-confidence.webp?b=1&s=170667a&w=0&k=20&c=lrHSjzuqKIAC76-vpOhzR7pRsP38DGPWt7x7SOFbm0Q="// Replace with the actual path or URL of your image
                                    alt="Description of the image"
                                    style={{ width: '20%', height: 'auto', display: 'block', margin: 'left' }}
                                />
                                <li key={index}>Contact: {contact.contact}</li>
                                <li key={index}>Name: {contact.name}</li>
                                <li key={index}>Function: {contact.function}</li>
                                <li key={index}>Email: {contact.email}</li>
                                <button onClick={() => openEditContactModal(index)}>Edit</button> <br/>

                                <br/>
                            </div>
                        ))}
                    </ul>

                </div>
                <div><Button onClick={openAddContactModal}>Add Contact</Button></div>


                <Modal
                    show={isAddContactModal}
                    onHide={closeAddContactModal}
                    size='lg'
                    backdrop="static"
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Contacts</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>

                            <Form>
                                <Form.Group>
                                    <center><h5>Add Contact</h5></center>
                                    <Form.Label className="control-label required-field-label">Contact</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Contact"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        required
                                    /> <br />

                                    <Form.Label className="control-label required-field-label">Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Contact Name"
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        required
                                    /> <br />

                                    <Form.Label className="control-label required-field-label">Function</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Function"
                                        value={contactRole}
                                        onChange={(e) => setContactRole(e.target.value)}
                                        required
                                    />
                                </Form.Group> <br />

                                <Form.Label className="control-label required-field-label">Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <br /></Form><br/><br/>
                            <div className="error-message">{contactError}</div><br/>
                            <div className="error-message">{nameError}</div><br/>
                            <div className="error-message">{functionError}</div><br/>
                            <div className="error-message">{emailError}</div><br/><br/>
                            <div><Button onClick={handleFormSubmit}>Add Contact</Button></div>

                        </div>
                    </Modal.Body>
                </Modal>
            </Modal.Body>
        </Modal>
        </div>
        </>

    );
};

export default AddressBookDetailsView;
