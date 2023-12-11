// components/Board.tsx
import React, {useCallback, useContext, useEffect, useState} from 'react';
import CompaniesList from "./CompaniesList";
import AddressBookDetailsView from "./AddressBookDetailsView";
import {AddressBookProps, CompanyDataProps} from "../../interfaces/addressbook_interfaces";
import {AddressBookContext} from "../../contexts/AdressBookContextProvider";
import {LoadingMessage} from "../common/LoadingMessages";

const Board = () => {

    const {fetchCompaniesWithRetry, fetchAddressBookWithRetry} = useContext(AddressBookContext)!;
    const [loading, setLoading] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyDataProps | null>(null);
    const [filledCompanies , setFilledCompanies] = useState<CompanyDataProps[]>([]);

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const comps = await fetchCompaniesWithRetry();
            const books = await fetchAddressBookWithRetry();
            fillCompanyAddressBookData(comps,books);
            console.log("Companies11:", comps);
        } catch (error) {
            console.error('Error fetching filtered events:', error);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchCompanies();
    }, [ fetchCompanies]);

    const fillCompanyAddressBookData = (comps: CompanyDataProps[], books:AddressBookProps[]) => {
        console.log("Companies:", comps);
        console.log("Address Books:", comps);
        for (const company of comps) {
            console.log("Processing company:", company);
            let contacts: AddressBookProps[] = []; // Initialize contacts array here

            for (const book of books) {
                console.log("Processing address book entry:", book);
                let addressBook: AddressBookProps;

                if (company.id === book.companyId) {
                    addressBook = {
                        id: book.id,
                        companyId: book.companyId,
                        email: book.email,
                        picture: book.picture,
                        function: book.function,
                        contact: book.contact,
                        name: book.name,
                    };
                    contacts.push(addressBook);
                }
            }

            company.contacts = contacts;
        }
        setFilledCompanies(comps);
    };
    if (loading) {
        return <LoadingMessage />; // Show loading spinner when data is loading
    }

    const handleTaskClick = (companyId: string) => {
        const selected = filledCompanies.find((company) => company.id === companyId);
        setSelectedCompany(selected || null);
    };

    return (
        <div className="board">
            <CompaniesList companies={filledCompanies} onCompanyClick={handleTaskClick} />
            {selectedCompany && <AddressBookDetailsView company={selectedCompany} />}
        </div>
    );
};

export default Board;
