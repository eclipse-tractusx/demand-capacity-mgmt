
/*
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *  See the NOTICE file(s) distributed with this work for additional information regarding copyright ownership.
 *
 *  This program and the accompanying materials are made available under the terms of the Apache License, Version 2.0 which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 *
 *  SPDX-License-Identifier: Apache-2.0
 */

//import {AiOutlineStock, AiOutlineLink} from 'react-icons/ai';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import DemandsPage from './DemandPage';
import DemandContextProvider from '../contexts/DemandContextProvider';

function QuickAcessItems() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
 // const handleShow = () => setShow(true);

  return (
  <>
  <div className="float-left" style={{position: 'absolute', top: '50%',left:5, transform: 'translate(0%, -50%)'}}>
    {/*<a className="btn btn-primary m-1 display-4"  onClick={handleShow}  href="#"><AiOutlineStock/></a>*/}
    <br />
    {/*<a className="btn btn-primary m-1 h2" href="#"><AiOutlineLink/></a>*/}
</div>
<Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Demand Management View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <DemandContextProvider>
          <DemandsPage></DemandsPage>
        </DemandContextProvider>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
</>
  );
}

export default QuickAcessItems;