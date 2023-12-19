import { AddressBookProps } from "./addressbook_interfaces";

export interface CompanyData {
    id: string,
    companyName: string,
    bpn: string,
    street: string,
    zipCode: string,
    country: string,
    number: string,

    contacts: AddressBookProps[],
    bpnType: string,
    edc_url: string,
    isEdcRegistered: boolean,
}
