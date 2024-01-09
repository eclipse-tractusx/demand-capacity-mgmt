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

import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaList } from "react-icons/fa";
import { FcHighPriority } from "react-icons/fc";
import { AlertsContext } from "../../contexts/AlertsContextProvider";
import AlertsTable from "../alerts/AlertsTable";
import ConfigureAlertModal from "../alerts/ConfigureAlertModal";
import RulesModal from "../alerts/RulesModal";
import { LoadingMessage } from "../common/LoadingMessages";


function AlertsPage() {
    const [loading, setLoading] = useState(false);
    const [showRulesModal, setShowRulesModal] = useState(false);
    const { triggeredAlerts, fetchTriggeredAlertsWithRetry } = useContext(AlertsContext)!;

    const openRulesModalClick = () => {
        setShowRulesModal(true);
    };
    const hideRulesModal = () => {
        setShowRulesModal(false);
    };

    useEffect(() => {
        fetchTriggeredAlertsWithRetry();
    }, []);

    if (loading) {
        return <LoadingMessage />; // Show loading spinner when data is loading
    }
    return (
        <>
            <br />
            <div className="container-xl">
                <div className="row">
                    <div className="col-sm-6">
                        <div style={{ display: 'flex' }}>
                            <FcHighPriority size={35} />
                            <h3 className="icon-text-padding">Alerts</h3>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <Button className='btn btn-primary float-end ms-2' onClick={openRulesModalClick}>
                            <span><FaList /> Alert Rules</span>
                        </Button>
                        <ConfigureAlertModal />
                    </div>
                </div>

                <div className="table">
                    <div className="table-wrapper">
                        <AlertsTable alerts={triggeredAlerts} />
                    </div>
                </div>
            </div>
            <RulesModal showRulesModal={showRulesModal} hideRulesModal={hideRulesModal} />
        </>

    );
}

export default AlertsPage;