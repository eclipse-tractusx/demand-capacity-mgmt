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

import eclipse.tractusx.demandcapacitymgmt.specification.api.EdcApi;
import eclipse.tractusx.demandcapacitymgmt.specification.model.*;
import java.util.List;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.backend.services.EDCService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class EDCController implements EdcApi {

    private final EDCService edcService;

    @Override
    public ResponseEntity<List<Asset>> createAssetRequest(QuerySpec querySpec) throws Exception {
        return ResponseEntity.ok(edcService.createAssetRequest(querySpec));
    }

    @Override
    public ResponseEntity<IdResponse> createContract(ContractDefinitionInput contractDefinitionInput) throws Exception {
        return ResponseEntity.ok(edcService.createContractDef(contractDefinitionInput).block());
    }

    @Override
    public ResponseEntity<List<ContractDefinitionOutput>> createContractRequest(QuerySpec querySpec) throws Exception {
        return ResponseEntity.ok(edcService.createContractDefRequest(querySpec));
    }

    @Override
    public ResponseEntity<IdResponse> createPolicy(PolicyDefinitionInput policyDefinitionInput) throws Exception {
        return ResponseEntity.ok(edcService.createPolicy(policyDefinitionInput).block());
    }

    @Override
    public ResponseEntity<List<PolicyDefinitionOutput>> createPolicyRequest(QuerySpec querySpec) throws Exception {
        return ResponseEntity.ok(edcService.createPolicyRequest(querySpec));
    }

    @Override
    public ResponseEntity<Void> deleteAssetById(String assetId) throws Exception {
        return ResponseEntity.ok(edcService.deleteAsset(assetId));
    }

    @Override
    public ResponseEntity<Void> deleteContractById(String contractId) throws Exception {
        return ResponseEntity.ok(edcService.deleteContractDef(contractId));
    }

    @Override
    public ResponseEntity<Void> deletePolicyById(String policyId) throws Exception {
        return ResponseEntity.ok(edcService.deletePolicy(policyId));
    }

    @Override
    public ResponseEntity<AccessTokenResponse> getAccessToken() throws Exception {
        return ResponseEntity.ok(edcService.getAccessToken().block());
    }

    @Override
    public ResponseEntity<Asset> getAssetById(String assetId) throws Exception {
        return ResponseEntity.ok(edcService.getAsset(assetId));
    }

    @Override
    public ResponseEntity<ContractDefinitionOutput> getContractById(String contractId) throws Exception {
        return ResponseEntity.ok(edcService.getContractDef(contractId));
    }

    @Override
    public ResponseEntity<PolicyDefinitionOutput> getPolicyById(String policyId) throws Exception {
        return ResponseEntity.ok(edcService.getPolicy(policyId));
    }

    @Override
    public ResponseEntity<IdResponse> registerAsset(AssetEntryNewDto assetInput) throws Exception {
        return ResponseEntity.ok(edcService.createAsset(assetInput).block());
    }
}
