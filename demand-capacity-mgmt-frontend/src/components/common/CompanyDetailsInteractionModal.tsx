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
    //For future implementation
    //const [favoriteCompanies, setfavoriteCompanies] = useState<string[]>([]);

    const [favoriteCompanies] = useState<string[]>([]);

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
