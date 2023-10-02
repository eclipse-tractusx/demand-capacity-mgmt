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
import React, { useState, useEffect } from 'react';
import { Modal, Breadcrumb } from 'react-bootstrap';
import WeeklyView from '../demands/DemandsOverview';
import DemandCategoryContextProvider from '../../contexts/DemandCategoryProvider';
import { DemandProp } from '../../interfaces/demand_interfaces';
import {LoadingGatheringDataMessage} from './LoadingMessages';

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
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState(0); // Add a key to force re-render

  // Simulate a delay to demonstrate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setModalVisible(true);
    }, 2000); // Simulate 2 seconds of loading

    const modalTimer = setTimeout(() => {
      setModalKey(prevKey => prevKey + 1); // Change the key to force re-render
    });

    return () => {
      clearTimeout(timer);
      clearTimeout(modalTimer);
      setLoading(true);
      setModalVisible(false);
    };
  }, [show]); // Re-run the effect when the 'show' prop changes

  // Don't render the modal until loading is done
  if (loading || !modalVisible) {
    return (
      <Modal
        key={modalKey} // Use the 'key' prop to force re-render
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
            <Breadcrumb.Item active>Overview</Breadcrumb.Item>
          </Breadcrumb>
        </Modal.Header>
        <Modal.Body>
          <LoadingGatheringDataMessage/>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal
      key={modalKey} // Use the 'key' prop to force re-render
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
            <WeeklyView demandData={selectedDemand} />
          </DemandCategoryContextProvider>
        ) : null}
      </Modal.Body>
    </Modal>
  );
}

export default DemandDetailsModal;
