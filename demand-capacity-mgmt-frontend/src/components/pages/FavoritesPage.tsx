import React, {useContext} from "react";
import { Tab, Tabs } from "react-bootstrap";
import FavoritesTable from "../favorites/FavoritesTable";
import {
    MaterialDemandFavoriteResponse,
    SingleCapacityGroupFavoriteResponse,
    CompanyDtoFavoriteResponse,
    EventFavoriteResponse
} from "../../interfaces/Favorite_interface";
import {FavoritesContext} from "../../contexts/FavoritesContextProvider";
import {BsFillBookmarkStarFill} from "react-icons/bs";

const FavoritesPage: React.FC = () => {
    const favoritesContext = useContext(FavoritesContext);

    if (!favoritesContext) {
        return <div>Loading...</div>;
    }

    const { favorites } = favoritesContext;

    if (!favorites) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <br/>
    <div className="container-xl">
        <div style={{display: "flex"}}>
            <BsFillBookmarkStarFill size={35} color={"#a4d34d"}/>
            <h3 className="icon-text-padding">Favorites</h3>
        </div>
        <div className="favorites-tabs">
        <Tabs defaultActiveKey="MaterialDemands" id="favorites-tabs">
            <Tab eventKey="MaterialDemands" title="Material Demands">
                <FavoritesTable
                    data={favorites?.materialDemands || []}
                    headings={['Description', 'Material Number', 'Material Number Supplier', 'Customer','Supplier', 'UOM']}
                    renderRow={(item: MaterialDemandFavoriteResponse, index: number) => [
                        <span key={index}>{item.materialDescriptionCustomer}</span>,
                        <span key={index}>{item.materialNumberCustomer}</span>,
                        <span key={index}>{item.materialNumberSupplier}</span>,
                        <span key={index}>{item.customer}</span>,
                        <span key={index}>{item.supplier}</span>,
                        <span key={index}>{item.unitOfMeasure}</span>,
                    ]}
                />
            </Tab>
            <Tab eventKey="CapacityGroups" title="Capacity Groups">
                <FavoritesTable
                    data={favorites?.capacityGroups || []}
                    headings={['Customer', 'Supplier', 'ID', 'Name']}
                    renderRow={(item: SingleCapacityGroupFavoriteResponse, index: number) => [
                        <span key={index}>{item.customer}</span>,
                        <span key={index}>{item.supplier}</span>,
                        <span key={index}>{item.capacityGroupId}</span>,
                        <span key={index}>{item.capacityGroupName}</span>,
                    ]}
                />
            </Tab>
            <Tab eventKey="CompanyData" title="Company Data">
                <FavoritesTable
                    data={favorites?.companies || []}
                    headings={['BPN', 'Name', 'ZIP Code', 'Country', 'My Company']}
                    renderRow={(item: CompanyDtoFavoriteResponse, index: number) => [
                        <span key={index}>{item.bpn}</span>,
                        <span key={index}>{item.companyName}</span>,
                        <span key={index}>{item.zipCode}</span>,
                        <span key={index}>{item.country}</span>,
                        <span key={index}>{item.myCompany}</span>,
                    ]}
                />
            </Tab>
            <Tab eventKey="Events" title="Events">
                <FavoritesTable
                    data={favorites?.events || []}
                    headings={['id', 'event type', 'time created', 'User','description']}
                    renderRow={(item: EventFavoriteResponse, index: number) => [
                        <span key={index}>{item.id}</span>,
                        <span key={index}>{item.eventType}</span>,
                        <span key={index}>{item.timeCreated}</span>,
                        <span key={index}>{item.userAccount}</span>,
                        <span key={index}>{item.description}</span>
                    ]}
                />
            </Tab>
        </Tabs>
        </div>
    </div>
        </>
    );
};

export default FavoritesPage;
