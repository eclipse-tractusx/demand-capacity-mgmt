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
import { Breadcrumb, Modal } from 'react-bootstrap';
import DemandCategoryContextProvider from '../../contexts/DemandCategoryProvider';
import { DemandProp } from '../../interfaces/demand_interfaces';
import WeeklyView from '../demands/DemandsOverview';

interface DemandDetailsModalProps {
  show: boolean;
  onHide: () => void;
  dialogClassName: string;
  fullscreen: string;
  selectedDemand: DemandProp | null;
}

function DemandDetailsModal({
  show,
  onHide,
  dialogClassName,
  fullscreen,
  selectedDemand,
}: DemandDetailsModalProps) {


  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      dialogClassName={dialogClassName}
      fullscreen={fullscreen}
    >
      <Modal.Header closeButton>
        <Breadcrumb>
          <Breadcrumb.Item href="#" onClick={onHide}>
            Demand Management
          </Breadcrumb.Item>
          {selectedDemand ? (
            <Breadcrumb.Item href="#">{selectedDemand.id}</Breadcrumb.Item>
          ) : null}
          <Breadcrumb.Item active>Overview</Breadcrumb.Item>
        </Breadcrumb>
      </Modal.Header>
      <Modal.Body>
        {selectedDemand ? (
          <DemandCategoryContextProvider>
            <WeeklyView demandId={selectedDemand.id} />
          </DemandCategoryContextProvider>
        ) : null}
      </Modal.Body>
    </Modal>
  );
}

export default DemandDetailsModal;
