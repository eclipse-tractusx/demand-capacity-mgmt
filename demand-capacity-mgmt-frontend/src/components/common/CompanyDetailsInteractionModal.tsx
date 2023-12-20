import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { CompanyContext } from '../../contexts/CompanyContextProvider';
import AddressBookDetailsView from '../addessBook/AddressBookDetailsView';


interface CompanyDetailsModalProps {
    isOpen: boolean;
    handleClose: () => void;
    companyId: string;
}

const CompanyDetailsInteractionModal: React.FC<CompanyDetailsModalProps> = ({
    isOpen,
    handleClose,
    companyId
}) => {

    const { findCompanyByCompanyID } = useContext(CompanyContext)!;
    const [favoriteCompanies, setfavoriteCompanies] = useState<string[]>([]);

    return (
        <Modal show={isOpen}
            onHide={handleClose}
            size='lg'
            backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Company Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddressBookDetailsView company={findCompanyByCompanyID(companyId)} favoriteCompanies={favoriteCompanies} />
            </Modal.Body>
        </Modal>
    );
};

export default CompanyDetailsInteractionModal;
