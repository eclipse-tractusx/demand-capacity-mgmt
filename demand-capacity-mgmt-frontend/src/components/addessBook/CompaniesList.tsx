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

import React from 'react';
import { LuStar } from 'react-icons/lu';
import { CompanyDataProps } from '../../interfaces/company_interfaces';

interface CompanyListProps {
    companies: CompanyDataProps[];
    favoriteCompanies: string[];
    onCompanyClick: (taskId: string) => void;
}

const CompaniesList: React.FC<CompanyListProps> = ({ companies, favoriteCompanies, onCompanyClick }) => {
    return (
        <div className="task-list">
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {companies.map((company) => (
                    <li key={company.id} onClick={() => onCompanyClick(company.id)} style={{ display: 'flex', alignItems: 'center' }}>
                        <span className='inlinefav' style={{ marginRight: '5px' }}>
                            <LuStar
                                className={favoriteCompanies.includes(company.id) ? "text-warning" : "text-muted"}
                                opacity={favoriteCompanies.includes(company.id) ? "1" : "0.2"}
                                size={25}
                            />
                        </span>
                        <span>{company.companyName}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompaniesList;
