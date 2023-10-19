export interface FavoriteProp {
    id: string,
    favoriteId: string,
    favoriteTypeId: string,
    favoriteType: string
}

export enum FavoriteType{
    CAPACITY_GROUP,
    COMPANY_BASE_DATA,
    MATERIAL_DEMAND,
}