import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaAddressCard } from 'react-icons/fa';
import { AddressBookProps } from '../../interfaces/addressbook_interfaces';

interface ContactCardModalProps {
    show: boolean;
    onClose: () => void;
    contact: AddressBookProps | null;
}

const ContactCardModal: React.FC<ContactCardModalProps> = ({ show, onClose, contact }) => {
    const generateVCF = (contact: AddressBookProps) => {
        const vcard = `BEGIN:VCARD
    VERSION:3.0
    FN:${contact.name}
    EMAIL:${contact.email}
    TEL:${contact.contact}
    END:VCARD`;

        return new Blob([vcard], { type: 'text/vcard' });
    };

    // Usage:
    const handleSaveToOutlook = () => {
        if (contact) {
            const vcfData = generateVCF(contact);
            const vcfURL = window.URL.createObjectURL(vcfData);
            // Create a link for the user to download the VCF file
            const downloadLink = document.createElement('a');
            downloadLink.href = vcfURL;
            downloadLink.download = `${contact.name}.vcf`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };


    return (
        <Modal show={show}
            onHide={onClose}
            backdrop="static"
            keyboard={false}
            autoFocus={true}>
            <Modal.Header closeButton>
                <Modal.Title>Contact Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {contact && (
                    <div className="d-flex flex-column align-items-center">
                        <img
                            src={contact.picture || '/media/user.jpg'}
                            className="rounded-circle mb-3"
                            width={100}
                            height={100}
                            alt="User"
                        />
                        <hr style={{ width: '100%', borderTop: '1px solid #ccc' }} />
                        <h5 className="text-center mt-3 mb-2">{contact.name}</h5>
                        <p className="text-secondary">{contact.function}</p>
                        <p><strong>Email:</strong> {contact.email}</p>
                        <p><strong>Phone:</strong> {contact.contact}</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-success d-flex justify-content-center align-items-center" variant="secondary" onClick={handleSaveToOutlook}>
                    <span className="me-2"><FaAddressCard /></span>
                    <span>Generate Card</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ContactCardModal;
