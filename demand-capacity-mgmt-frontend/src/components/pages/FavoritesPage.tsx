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
import React, { useContext } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { FavoritesContext } from "../../contexts/FavoritesContextProvider";
import { LoadingMessage } from "../common/LoadingMessages";
import FavoritesTableCapacityGroup from "../favorites/FavoritesTableCapacityGroup";
import FavoritesTableEvents from "../favorites/FavoritesTableEvents";
import FavoriteTableMaterialDemands from "../favorites/FavoritesTableMaterialDemands";

const FavoritesPage: React.FC = () => {
    const { favorites } = useContext(FavoritesContext)!;

    if (!favorites) {
        return <LoadingMessage />;
    }

    return (
        <>
            <br />
            <div className="container-xl">
                <div style={{ display: "flex" }}>
                    <BsFillBookmarkStarFill size={35} color={"#a4d34d"} />
                    <h3 className="icon-text-padding">My Favorites</h3>
                </div>
                <div className="favorites-tabs">
                    <Tabs defaultActiveKey="MaterialDemands" id="favorites-tabs">
                        <Tab eventKey="MaterialDemands" title="Material Demands">
                            <FavoriteTableMaterialDemands
                                materialdemands={favorites?.materialDemands || []}
                            />
                        </Tab>
                        <Tab eventKey="CapacityGroups" title="Capacity Groups">
                            <FavoritesTableCapacityGroup
                                favcapacitygroups={favorites?.capacityGroups || []}
                            />
                        </Tab>
                        <Tab eventKey="CompanyData" title="Companies">
                            {/* <FavoritesTable
                                data={favorites?.companies || []}
                                headings={['BPN', 'Name', 'ZIP Code', 'Country', 'My Company']}
                                renderRow={(item: CompanyDtoFavoriteResponse, index: number) => [
                                    <span key={index}>{item.bpn}</span>,
                                    <span key={index}>{item.companyName}</span>,
                                    <span key={index}>{item.zipCode}</span>,
                                    <span key={index}>{item.country}</span>,
                                    <span key={index}>{item.myCompany}</span>,
                                ]}
                            /> */}
                        </Tab>
                        <Tab eventKey="Events" title="Events">
                            <FavoritesTableEvents
                                events={favorites?.events || []}
                            />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default FavoritesPage;
