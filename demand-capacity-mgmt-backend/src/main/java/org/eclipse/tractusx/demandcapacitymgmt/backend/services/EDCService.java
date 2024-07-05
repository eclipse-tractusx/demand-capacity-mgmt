/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023, 2024 Contributors to the Eclipse Foundation
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
package org.eclipse.tractusx.demandcapacitymgmt.backend.services;

import eclipse.tractusx.demandcapacitymgm.specification.model.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.xml.catalog.Catalog;
import java.util.List;

public interface EDCService {
    Mono<IdResponse> createAsset(AssetEntryNewDto dto);

    List<Asset> createAssetRequest(QuerySpec dto);

    Asset getAsset(String assetId);

    Void deleteAsset(String assetId);

    Mono<IdResponse> createPolicy(PolicyDefinitionInput dto);

    List<PolicyDefinitionOutput> createPolicyRequest(QuerySpec dto);

    PolicyDefinitionOutput getPolicy(String policyId);

    Void deletePolicy(String policyId);

    Mono<IdResponse> createContractDef(ContractDefinitionInput dto);

    List<ContractDefinitionOutput> createContractDefRequest(QuerySpec dto);

    ContractDefinitionOutput getContractDef(String contractDefId);

    Void deleteContractDef(String contractDefId);

    Mono<Catalog> createCatalogRequest(CatalogRequest dto);

    Mono<IdResponse> createContractNeg(ContractRequest dto);

    Flux<ContractNegotiation> createContractNegRequest(QuerySpec dto);

    Mono<IdResponse> createTransferProcess(TransferRequest dto);

    Flux<TransferProcess> createTransferProcessRequest(QuerySpec dto);

    Mono<TransferProcess> getTransferProcess(String transferProcessId);

    Mono<IdResponse> createEDR(NegotiateEdrRequest dto);

    Mono<AccessTokenResponse> getAccessToken();

    Mono<DataAddress> getEDR(String edrId);

    Mono<Void> deleteEDR(String edrId);

    Mono<AssetRequest> createAASRequest(AssetRequest dto);

    Mono<EndpointDataReferenceEntry> getEDRSByParameters(String agreementId, String assetId, String providerId);
}
