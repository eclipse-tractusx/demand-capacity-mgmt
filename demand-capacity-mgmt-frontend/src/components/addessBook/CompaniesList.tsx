// components/TaskList.tsx
import React from 'react';
import {CompanyDataProps} from "../../interfaces/addressbook_interfaces";

interface CompanyListProps {
    companies: CompanyDataProps[];
    onCompanyClick: (taskId: string) => void;
}

const CompaniesList: React.FC<CompanyListProps> = ({ companies, onCompanyClick }) => {
    return (
        <div className="task-list">
            <ul>
                {companies.map((company) => (
                    <li key={company.id} onClick={() => onCompanyClick(company.id)}>
                        {company.companyName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompaniesList;
