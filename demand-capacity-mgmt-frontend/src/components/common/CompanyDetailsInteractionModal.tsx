import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FcOrganization } from 'react-icons/fc';
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
                <Modal.Title>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <FcOrganization size={35} /><h4 className='icon-text-padding'>Company Info</h4>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddressBookDetailsView company={findCompanyByCompanyID(companyId)} favoriteCompanies={favoriteCompanies} isModal={true} />
            </Modal.Body>
        </Modal>
    );
};

export default CompanyDetailsInteractionModal;
