/*
 * ******************************************************************************
 * Copyright (c) 2023 BMW AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * *******************************************************************************
 */

import React from "react";
import Modal from "react-bootstrap/Modal";
import { FcAlarmClock } from "react-icons/fc";
import ConfigureAlertModal from "./ConfigureAlertModal";
import ConfiguredAlertsTable from "./ConfiguredAlertsTable";


type RulesModalProps = {
    showRulesModal: boolean,
    hideRulesModal: () => void,
};

const RulesModal: React.FC<RulesModalProps> = ({ showRulesModal, hideRulesModal }) => {
    return <Modal
        show={showRulesModal}
        onHide={hideRulesModal}
        size='lg'
        backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <FcAlarmClock size={35} /><h4 className='icon-text-padding'> Configured Alert Rules</h4>
            </div>
        </Modal.Header>
        <Modal.Body>
            <ConfigureAlertModal />
            <br />
            <ConfiguredAlertsTable />
        </Modal.Body>
    </Modal>
}


export default RulesModal;