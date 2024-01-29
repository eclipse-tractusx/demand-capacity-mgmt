package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.util.List;
import javax.xml.catalog.Catalog;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
