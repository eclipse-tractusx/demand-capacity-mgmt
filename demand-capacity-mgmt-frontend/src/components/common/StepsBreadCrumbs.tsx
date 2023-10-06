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

interface StepBreadcrumbsProps {
  currentStep: number;
}

const StepBreadcrumbs: React.FC<StepBreadcrumbsProps> = ({ currentStep }) => {
  const steps = ['Welcome', 'Step 1', 'Step 2', 'Step 3'];

  return (
    <center>
      <h4 className='content-flex'>
        {steps.map((stepLabel, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className='separator'>{' > '}</span>}
            <span className={`step ${currentStep === index ? 'active-step' : ''}`}>
              {stepLabel}
            </span>
          </React.Fragment>
        ))}
      </h4>
    </center>
  );
};

export default StepBreadcrumbs;
