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

package org.eclipse.tractusx.demandcapacitymgmt.backend.controllers;

import eclipse.tractusx.demandcapacitymgmt.specification.api.CdRulesetApi;
import eclipse.tractusx.demandcapacitymgmt.specification.model.CDRulesetRequest;
import eclipse.tractusx.demandcapacitymgmt.specification.model.CDRulesetResponse;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.CompanyRuleSetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class CompanyRuleSetController implements CdRulesetApi {

    private CompanyRuleSetService service;

    @Override
    public ResponseEntity<CDRulesetResponse> getCompanyRulesets(String cdID) throws Exception {
        return ResponseEntity.status(200).body(service.getCompanyRuleSets(cdID));
    }

    @Override
    public ResponseEntity<CDRulesetResponse> modifyCompanyRuleset(CDRulesetRequest cdRulesetRequest) throws Exception {
        return ResponseEntity.status(200).body(service.applyCompanyRuleSets(cdRulesetRequest));
    }
}
