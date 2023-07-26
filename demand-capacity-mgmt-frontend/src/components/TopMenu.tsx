
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
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaStar, FaArrowUp,FaArrowDown } from 'react-icons/fa';
import { FiSettings,FiLogOut } from 'react-icons/fi';

function TopMenuLinks() {
  return (
    <Navbar expand="lg" className="navbar navbar-expand-sm bg-dark navbar-dark">
      <Container>
        <Navbar.Brand href="#home"><img srcSet='/media/logo.png' alt="Logo" width="30" height="24" className='d-inline-block align-text-top'/> - CompanyName</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#favorites"><FaStar/> Favorites <span className="badge rounded-pill text-bg-primary" id="favorites-count">0</span></Nav.Link>
            <Nav.Link href="#alerts">Alerts <span className="badge rounded-pill text-bg-danger" id="alerts-count">0</span></Nav.Link>
            <Nav.Link href="#statusup"><FaArrowUp/> Status  <span className="badge rounded-pill text-bg-success" id="status-plus-count">0</span> </Nav.Link>
            <Nav.Link href="#statusdown"><FaArrowDown/> Status <span className="badge rounded-pill text-bg-danger" id="status-minus-count">0</span> </Nav.Link>
            <Nav.Link href="#todo">Todo <span className="badge rounded-pill text-bg-warning" id="todo-count">0</span> </Nav.Link>
            <Nav.Link href="#events">Events <span className="badge rounded-pill text-bg-info" id="events-count">0</span></Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">USERID</a>
          </Navbar.Text>
          <Nav.Link href="#settings" className="p-3 navbar-nav nav-item"><FiSettings/></Nav.Link>
          <Nav.Link href="#logout" className="p-2 navbar-nav nav-item"><FiLogOut/></Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopMenuLinks;