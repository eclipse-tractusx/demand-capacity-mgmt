import React, {FormEvent, useContext, useState} from 'react';
import {AddressBookCreateProps, AddressBookProps, CompanyDataProps} from "../../interfaces/addressbook_interfaces";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {AddressBookContext} from "../../contexts/AdressBookContextProvider";
import { Container} from 'react-bootstrap';
import {FaClipboard, FaEdit, FaEllipsisV, FaEye, FaInfoCircle, FaStar} from "react-icons/fa";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';

interface CompanyDetailsProps {
    company: CompanyDataProps;
}

const AddressBookDetailsView: React.FC<CompanyDetailsProps> = ({ company }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddContactModal, setIsAddContactModal] = useState(false);
    const [isDetailsViewModalOpen, setIsDetailsViewModalOpen] = useState(false);
    const [isEditViewOpen, setIsEditViewOpen] = useState(false);
    const [contact, setContact] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactRole, setContactRole] = useState('');
    const [email, setEmail] = useState('');
    let {updateAddressBook,createAddressBook} = useContext(AddressBookContext)!;
    const [contactError, setContactError] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [functionError, setFunctionError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [selectedContactIndex, setSelectedContactIndex] = useState<number | 0>(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleFileUpload = () => {
        // Handle the file upload logic here
        console.log('Selected File:', selectedFile);
    };

    const handleCopyToClipboard = (text:any) => {
        navigator.clipboard.writeText(text);
    };
    const GridViewList: React.FC<{ data: AddressBookProps[] }> = ({ data }) => {
        return (
             <Container>

                 {data.map((item, index) => (
                     <div key={index} className="table-responsive">
                         <table className="table table-borderless custom-table">
                             <thead>
                             </thead>
                             <tbody>
                             <tr className="border-bottom">
                                 <td className="fixed-width text-center align-middle">
                                     <img
                                         src="https://media.istockphoto.com/id/1413766112/photo/successful-mature-businessman-looking-at-camera-with-confidence.webp?b=1&s=170667a&w=0&k=20&c=lrHSjzuqKIAC76-vpOhzR7pRsP38DGPWt7x7SOFbm0Q="
                                         alt="saja"
                                         className="rounded-circle"
                                         width={64}
                                         height={64}
                                     />
                                 </td>
                                 <td className="fixed-width text-center align-middle">{item.name}</td>
                                 <td className="fixed-width text-center align-middle">{item.contact}</td>
                                 <td className="fixed-width text-center align-middle">
                                     Email{' '}
                                     <FaClipboard
                                         onClick={() => handleCopyToClipboard(item.email)}
                                         size={32}
                                         className='clip_board_icon ms-2' // Add margin to the left (ms-2) for spacing
                                     />
                                 </td>
                                 <td className="fixed-width text-center align-middle">
                                     <Button onClick={goToDetailsView(index)} variant="outline-primary">
                                         <div style={{ display: "flex", justifyContent: "center" }}>
                                             <FaEye size={20} />
                                         </div>
                                     </Button>
                                 </td>
                             </tr>
                             </tbody>
                         </table>
                     </div>
                 ))}

             </Container>


    );};

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredEmail = e.target.value;
        setEmail(enteredEmail);
        validateEmail(enteredEmail);
    };

    const validateEmail = (value: string) => {
        // Email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (value.trim() === '') {
            setEmailError('Email is required.');
        } else if (!emailRegex.test(value)) {
            setEmailError('Invalid email format.');
        } else {
            setEmailError('');
        }
    };

    const goToDetailsView = (index: number): React.MouseEventHandler<HTMLButtonElement> => {
        return () => {
            setSelectedContactIndex(index);
            openDetailsViewModal();
        };
    };

    const handleEditFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // Add validation logic for editing if needed
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
        let addressBook : AddressBookCreateProps= {
            query: company.id,
            directQuery: false,
            addressBook:{
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
            await updateAddressBook(company.id,addressBook);// TODO: here add addressbook id instead
            setIsEditViewOpen(false);

        } catch (error) {
            console.error('Error editing Address Book:', error);
        }
        // Close the edit modal
        closeEditViewModal();
    };

    const openModal = () => {
        console.log("Opening modal");
        setIsModalOpen(true);
    };

    const openEditViewModal = () => {
        console.log("Opening modal");
        setIsEditViewOpen(true);
    };
    const closeEditViewModal = () => {
        setIsEditViewOpen(false);
    };

    const openAddContactModal = () => {
        console.log("Opening modal");
        setIsAddContactModal(true);
    };

    const openDetailsViewModal = () => {
        console.log("Opening modal");
        setIsDetailsViewModalOpen(true);
    };

    const closeAddContactModal = () => {
        setIsAddContactModal(false);
    };

    const closeDetailsViewModal = () => {
        setIsDetailsViewModalOpen(false);
    };
    const handleContactChange = (value: any, country:any) => {
        // Update the state with the formatted phone number
        setContact(value);
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
        let addressBook : AddressBookCreateProps= {
            query: company.id,
            directQuery: false,
            addressBook:{
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


        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h6>
    <span
        className="company-info"
        style={{ cursor: 'pointer', marginRight: '10px',fontSize :'20px' }}
        onClick={() => openModal()}>
      Contacts:
    </span>
            </h6>
            <div>
                <Button onClick={openAddContactModal}>Add Contact</Button>
            </div>
        </div>
        <br/>

        { (company.contacts.length != 0) &&<div>
        <Modal
            show={isDetailsViewModalOpen}
            onHide={closeDetailsViewModal}
            size='lg'
            backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Details View</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ textAlign: 'center', position: 'relative' }}>
                    <img
                        src="https://media.istockphoto.com/id/1413766112/photo/successful-mature-businessman-looking-at-camera-with-confidence.webp?b=1&s=170667a&w=0&k=20&c=lrHSjzuqKIAC76-vpOhzR7pRsP38DGPWt7x7SOFbm0Q="
                        alt="saja"
                        className="rounded-circle"
                        width={64}
                        height={64}
                        style={{ marginBottom: '15px' }}
                    />
                    <FaEdit
                        onClick={openEditViewModal}
                        size={28}
                        style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}
                    />
                    <h5>Name: {company.contacts[selectedContactIndex].name}</h5>
                    <h5>
                        Email: {company.contacts[selectedContactIndex].email}
                        <FaClipboard
                            onClick={() => handleCopyToClipboard(company.contacts[selectedContactIndex].email)}
                            size={28}
                            className='clip_board_icon'
                        />
                    </h5>
                    <h5>Role: {company.contacts[selectedContactIndex].function}</h5>
                </div>
            </Modal.Body>
        </Modal>

        <Modal
            show={isEditViewOpen}
            onHide={closeEditViewModal}
            size='lg'
            backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form>
                        <Form.Group>
                            <Form.Label className="control-label required-field-label">Contact</Form.Label>
                            <PhoneInput
                                country={'us'} // Set the default country (you can change it based on your needs)
                                value={contact}
                                onChange={handleContactChange}
                                inputProps={{
                                    name: 'contact',
                                    required: true,
                                    autoFocus: true,
                                    placeholder: 'Enter Contact',
                                }}
                            /><br/>
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
                        {/*<div>*/}
                        {/*    <Button onClick={handleFileUpload}>Upload Image</Button>*/}
                        {/*</div>*/}
                        <Form.Label className="control-label required-field-label">Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Email"
                            value={email}
                            onChange={handleEmailChange}
                            isInvalid={!!emailError}
                            required
                        />
                        <br />
                        <div>
                            <label htmlFor="fileInput" className="control-label">
                                Upload Image  :
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <Button onClick={() => document.getElementById('fileInput')?.click()}>
                                Choose File
                            </Button>
                            {selectedFile && <div>Selected File: {selectedFile.name}</div>}
                        </div>

                    </Form>
                    <div className="error-message">{contactError}</div><br/>
                    <div className="error-message">{nameError}</div><br/>
                    <div className="error-message">{functionError}</div><br/>
                    <div className="error-message">{emailError}</div><br/><br/>
                </div>
                <div><Button onClick={handleEditFormSubmit}>Edit Contact</Button></div>

            </Modal.Body>
        </Modal>
        </div>}
        <GridViewList data={company.contacts || []} />
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
                                {/*<div>*/}
                                {/*    <Button onClick={handleFileUpload}>Upload Image</Button>*/}
                                {/*</div>*/}
                                <Form.Label className="control-label required-field-label">Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    isInvalid={!!emailError}
                                    required
                                />
                                <br />
                                <div>
                                    <label htmlFor="fileInput" className="control-label">
                                        Upload Image  :
                                    </label>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Button onClick={() => document.getElementById('fileInput')?.click()}>
                                        Choose File
                                    </Button>
                                    {selectedFile && <div>Selected File: {selectedFile.name}</div>}
                                </div>

                            </Form>
                            <div className="error-message">{contactError}</div><br/>
                            <div className="error-message">{nameError}</div><br/>
                            <div className="error-message">{functionError}</div><br/>
                            <div className="error-message">{emailError}</div><br/><br/>
                        </div>
                        <div><Button onClick={handleFormSubmit}>Add Contact</Button></div>

                    </Modal.Body>
        </Modal>
    </div>
        </>

    );
};

export default AddressBookDetailsView;
