export interface CompanyDtoFavoriteResponse {
    bpn: string;
    companyName: string;
    zipCode: string;
    country: string;
    myCompany: string;
}

export interface MaterialDemandFavoriteResponse {
    materialDescriptionCustomer: string;
    materialNumberCustomer: string;
    materialNumberSupplier: string;
    customer: string;
    supplier: string;
    unitOfMeasure: string;
    changedAt: string;
}

export interface SingleCapacityGroupFavoriteResponse {
    customer: string;
    supplier: string;
    capacityGroupId: string;
    capacityGroupName: string;
}

export interface FavoriteResponse {
    capacityGroups: SingleCapacityGroupFavoriteResponse[];
    materialDemands: MaterialDemandFavoriteResponse[];
    companies: CompanyDtoFavoriteResponse[];
}