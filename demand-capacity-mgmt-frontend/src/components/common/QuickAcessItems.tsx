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
import { FaChartLine, FaLink } from 'react-icons/fa';
import { FcComboChart } from 'react-icons/fc';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import DemandManagement from '../demands/DemandManagement';
import DemandContextProvider from '../../contexts/DemandContextProvider';
import '../../index.css';

function QuickAcessItems() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="float-left" style={{ position: 'absolute', top: '50%', left: 5, transform: 'translate(0%, -50%)' }}>
        <Button variant="primary" className=' m-1 display-4' onClick={handleShow} ><FaChartLine /></Button>
        <br />
        <Button variant="primary" className=' m-1 display-4'><FaLink /></Button>
      </div>
      <DemandContextProvider>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          dialogClassName="custom-modal"
          fullscreen="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <FcComboChart size={35} /><h3 className='icon-text-padding'> Demand Management View</h3>
              </div>
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DemandContextProvider>
              <DemandManagement/>
            </DemandContextProvider>
          </Modal.Body>

        </Modal>
      </DemandContextProvider>
    </>
  );
}

export default QuickAcessItems;