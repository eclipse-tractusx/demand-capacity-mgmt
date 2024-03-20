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
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export enum ConfirmationAction {
  Delete = 'delete',
  Unlink = 'unlink',
}

interface ConfirmationModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  action: ConfirmationAction; // Specify the action type
}

const DangerConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onCancel, onConfirm, action }) => {
  const title = action === ConfirmationAction.Delete ? 'Confirm Deletion' : 'Confirm Unlink';
  const confirmText = action === ConfirmationAction.Delete ? 'Confirm Delete' : 'Unlink';

  const confirmationMessage =
    action === ConfirmationAction.Delete
      ? 'Are you sure you want to delete this item?'
      : 'Are you sure you want to unlink this material demand from this capacity group?';

  return (
    <Modal show={show} onHide={onCancel} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{confirmationMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DangerConfirmationModal;
