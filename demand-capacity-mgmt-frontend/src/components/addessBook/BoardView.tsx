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

import { useContext, useState } from 'react';
import { CompanyContext } from '../../contexts/CompanyContextProvider';
import { CompanyData } from '../../interfaces/company_interfaces';
import AddressBookDetailsView from "./AddressBookDetailsView";
import CompaniesList from "./CompaniesList";

const Board = () => {

    const { companies } = useContext(CompanyContext)!;
    const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

    const [favoriteCompanies, setfavoriteCompanies] = useState<string[]>([]);

    const handleTaskClick = (companyId: string) => {
        const selected = companies.find((company) => company.id === companyId);
        setSelectedCompany(selected || null);
    };

    return (
        <div className="board">
            <CompaniesList favoriteCompanies={favoriteCompanies} companies={companies} onCompanyClick={handleTaskClick} />
            {selectedCompany && <AddressBookDetailsView favoriteCompanies={favoriteCompanies} company={selectedCompany} />}
        </div>
    );
};

export default Board;
