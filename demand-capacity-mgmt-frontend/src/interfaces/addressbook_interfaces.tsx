export interface AddressBookCreateProps {
    query: string,
    directQuery: boolean
    addressBook: AddressBookProps
}

export interface AddressBookProps {
    id: string
    companyId: string
    name: string,
    email: string,
    function: string,
    picture: string,
    contact: string
}
