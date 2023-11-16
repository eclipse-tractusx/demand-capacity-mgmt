package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.xml.catalog.Catalog;

public interface EDCService {
    Mono<IdResponse> createAsset(AssetInput dto);

    Flux<AssetOutput> createAssetRequest(QuerySpec dto);

    Mono<AssetOutput> getAsset(String assetId);

    Mono<Void> deleteAsset(String assetId);

    Mono<IdResponse> createPolicy(PolicyDefinitionInput dto);

    Flux<PolicyDefinitionOutput> createPolicyRequest(QuerySpec dto);

    Mono<PolicyDefinitionOutput> getPolicy(String policyId);

    Mono<Void> deletePolicy(String policyId);

    Mono<IdResponse> createContractDef(ContractDefinitionInput dto);

    Flux<ContractDefinitionOutput> createContractDefRequest(QuerySpec dto);

    Mono<ContractDefinitionOutput> getContractDef(String contractDefId);

    Mono<Void> deleteContractDef(String contractDefId);

    Mono<Catalog> createCatalogRequest(CatalogRequest dto);

    Mono<IdResponse> createContractNeg(ContractRequest dto);

    Flux<ContractNegotiation> createContractNegRequest(QuerySpec dto);

    Mono<IdResponse> createTransferProcess(TransferRequest dto);

    Flux<TransferProcess> createTransferProcessRequest(QuerySpec dto);

    Mono<TransferProcess> getTransferProcess(String transferProcessId);

    Mono<IdResponse> createEDR(NegotiateEdrRequest dto);

    Mono<DataAddress> getEDR(String edrId);

    Mono<Void> deleteEDR(String edrId);


}
