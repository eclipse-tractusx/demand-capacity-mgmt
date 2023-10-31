export interface CompanyDtoFavoriteResponse {
    id: string;
    bpn: string;
    companyName: string;
    zipCode: string;
    country: string;
    myCompany: string;
}

export interface EventFavoriteResponse {
    id: number;
    logID: string;
    eventType: string;
    timeCreated: string;
    userAccount: string;
    description: string;
}

export interface MaterialDemandFavoriteResponse {
    id: string;
    materialDescriptionCustomer: string;
    materialNumberCustomer: string;
    materialNumberSupplier: string;
    customer: string;
    supplier: string;
    unitOfMeasure: string;
    changedAt: string;
}

export interface SingleCapacityGroupFavoriteResponse {
    id: string;
    customer: string;
    supplier: string;
    capacityGroupId: string;
    capacityGroupName: string;
}

export interface FavoriteResponse {
    capacityGroups: SingleCapacityGroupFavoriteResponse[];
    materialDemands: MaterialDemandFavoriteResponse[];
    companies: CompanyDtoFavoriteResponse[];
    events: EventFavoriteResponse[];
}

export enum FavoriteType {
    CAPACITY_GROUP = 'CAPACITY_GROUP',
    COMPANY_BASE_DATA = 'COMPANY_BASE_DATA',
    MATERIAL_DEMAND = 'MATERIAL_DEMAND',
    EVENT = 'EVENT'
}

export interface FavoritePayload {
    favoriteId: string;
    fType: string;
}