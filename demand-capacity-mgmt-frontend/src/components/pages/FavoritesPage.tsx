import React, {useContext, useEffect, useState} from "react";
import {FavoritesContext} from "../../contexts/FavoritesContextProvider";
import MaterialDemandFavoritesTable from "../favorites/MaterialDemandFavoritesTable";
import {FcBookmark, FcTimeline} from "react-icons/fc";
import {BsFillBookmarkStarFill} from "react-icons/bs";
import {Tab, Tabs} from "react-bootstrap";

function FavoritesPage() {
    const [loading, setLoading] = useState(false);
    const {favorites, fetchFavorites} = useContext(FavoritesContext)!;
    const [activeTab, setActiveTab] = useState("Favorites");
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await fetchFavorites();
                console.log(favorites)
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [favorites]);


    return (
        <div className="events-page">
            <br/>
            <div className="container-xl">
                <div style={{display: "flex"}}>
                    <BsFillBookmarkStarFill size={35} color={"#a4d34d"}/>
                    <h3 className="icon-text-padding">Favorites</h3>
                </div>
                <div className="favorites-tabs">
                    <Tabs
                        defaultActiveKey="MaterialDemands"
                        id="FavoritesTabs"
                        className="mb-3"
                        activeKey={activeTab}
                        onSelect={(tabKey) => {
                            if (typeof tabKey === "string") {
                                setActiveTab(tabKey);
                            }
                        }}
                    >
                        <Tab eventKey="MaterialDemands" title="Material Demands">
                            <div className="tab-content">
                                <MaterialDemandFavoritesTable favorites={favorites}></MaterialDemandFavoritesTable>
                            </div>
                        </Tab>
                        <Tab eventKey="CapacityGroups" title="Capacity Groups">
                            <div className="tab-content">
                                <MaterialDemandFavoritesTable favorites={favorites}></MaterialDemandFavoritesTable>
                            </div>
                        </Tab>
                        <Tab eventKey="CompanyData" title="Material Demands">
                            <div className="tab-content">
                                <MaterialDemandFavoritesTable favorites={favorites}></MaterialDemandFavoritesTable>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default FavoritesPage;