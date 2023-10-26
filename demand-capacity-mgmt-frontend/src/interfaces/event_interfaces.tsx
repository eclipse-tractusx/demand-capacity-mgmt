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

import { FaArrowDown, FaArrowUp, FaEnvelope, FaExclamation, FaLink, FaUnlink, FaWrench } from "react-icons/fa"


export interface EventProp {
  id: number
  logID: string,
  userAccount: string
  timeCreated: string
  objectType: string
  eventType: string
  capacityGroupId: string
  materialDemandId: string
  eventDescription: string
  isFavorited: boolean
}


export enum EventType {
  GENERAL_EVENT = 'GENERAL_EVENT',
  TODO = 'TODO',
  ALERT = 'ALERT',
  STATUS_IMPROVEMENT = 'STATUS_IMPROVEMENT',
  STATUS_REDUCTION = 'STATUS_REDUCTION',
  LINKED = 'LINKED',
  UN_LINKED = 'UN_LINKED'
}

export const eventTypeIcons: { [key: string]: React.ReactNode } = {
  GENERAL_EVENT: <FaEnvelope className="text-primary" size={25} />,
  TODO: <FaWrench className="text-warning" size={25} />,
  ALERT: <FaExclamation className="text-danger" size={25} />,
  STATUS_IMPROVEMENT: <FaArrowUp className="text-success" size={25} />,
  STATUS_REDUCTION: <FaArrowDown className="text-danger" size={25} />,
  LINKED: <FaLink className="text-info" size={25} />,
  UN_LINKED: <FaUnlink className="text-danger" size={25} />,
};