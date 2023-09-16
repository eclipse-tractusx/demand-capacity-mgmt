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

import Nav from "react-bootstrap/Nav";
import {FaArrowDown, FaArrowUp, FaStar} from "react-icons/fa";

function Component63() {

    return (
        <>
            <Nav className="me-auto">
                <Nav.Link href="#favorites"><FaStar/> Favorites <span className="badge rounded-pill text-bg-primary" id="favorites-count">0</span></Nav.Link>
                <Nav.Link href="#alerts">Alerts <span className="badge rounded-pill text-bg-danger" id="alerts-count">0</span></Nav.Link>
                <Nav.Link href="#statusup"><FaArrowUp/> Status  <span className="badge rounded-pill text-bg-success" id="status-plus-count">0</span> </Nav.Link>
                <Nav.Link href="#statusdown"><FaArrowDown/> Status <span className="badge rounded-pill text-bg-danger" id="status-minus-count">0</span> </Nav.Link>
                <Nav.Link href="#todo">Todo <span className="badge rounded-pill text-bg-warning" id="todo-count">0</span> </Nav.Link>
                <Nav.Link href="#events">Events <span className="badge rounded-pill text-bg-info" id="events-count">0</span></Nav.Link>
            </Nav>
        </>

    );
}

export default Component63;