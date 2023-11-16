package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.EDCService;
import org.springframework.http.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import javax.xml.catalog.Catalog;
import java.time.Duration;

public class EDCServiceImpl implements EDCService {

    private final WebClient webClient = WebClient.create("http://localhost:8081/");

    @Override
    public Mono<IdResponse> createAsset(AssetInput dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v3/assets").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToMono(IdResponse.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Flux<AssetOutput> createAssetRequest(QuerySpec dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v3/assets/request").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToFlux(AssetOutput.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Mono<AssetOutput> getAsset(String assetId) {
        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder.pathSegment("/v3/assets", "{id}").build(assetId))
                .retrieve()
                .toEntity(AssetOutput.class)
                .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<Void> deleteAsset(String assetId) {
        return webClient
                .delete()
                .uri(uriBuilder -> uriBuilder.pathSegment("/v3/assets", "{id}").build(assetId))
                .retrieve()
                .bodyToMono(Void.class);
    }

    @Override
    public Mono<IdResponse> createPolicy(PolicyDefinitionInput dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v2/policydefinitions").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToMono(IdResponse.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Flux<PolicyDefinitionOutput> createPolicyRequest(QuerySpec dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v2/policydefinitions/request").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToFlux(PolicyDefinitionOutput.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Mono<PolicyDefinitionOutput> getPolicy(String policyId) {
        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder.pathSegment("/v2/policydefinitions", "{id}").build(policyId))
                .retrieve()
                .toEntity(PolicyDefinitionOutput.class)
                .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<Void> deletePolicy(String policyId) {
        return webClient
                .delete()
                .uri(uriBuilder -> uriBuilder.pathSegment("/v2/policydefinitions", "{id}").build(policyId))
                .retrieve()
                .bodyToMono(Void.class);
    }

    @Override
    public Mono<IdResponse> createContractDef(ContractDefinitionInput dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v2/contractdefinitions").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToMono(IdResponse.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Flux<ContractDefinitionOutput> createContractDefRequest(QuerySpec dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v2/contractdefinitions/request").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToFlux(ContractDefinitionOutput.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Mono<ContractDefinitionOutput> getContractDef(String contractDefId) {
        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder.pathSegment("/v2/contractdefinitions/{id}", "{id}").build(contractDefId))
                .retrieve()
                .toEntity(ContractDefinitionOutput.class)
                .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<Void> deleteContractDef(String contractDefId) {
        return webClient
                .delete()
                .uri(uriBuilder -> uriBuilder.pathSegment("/v2/contractdefinitions/{id}", "{id}").build(contractDefId))
                .retrieve()
                .bodyToMono(Void.class);
    }

    @Override
    public Mono<Catalog> createCatalogRequest(CatalogRequest dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v2/catalog/request").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToMono(Catalog.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Mono<IdResponse> createContractNeg(ContractRequest dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v2/contractnegotiations").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToMono(IdResponse.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Flux<ContractNegotiation> createContractNegRequest(QuerySpec dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v2/contractnegotiations/request").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToFlux(ContractNegotiation.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Mono<IdResponse> createTransferProcess(TransferRequest dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v2/transferprocesses").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToMono(IdResponse.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Flux<TransferProcess> createTransferProcessRequest(QuerySpec dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/v2/transferprocesses/request").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToFlux(TransferProcess.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Mono<TransferProcess> getTransferProcess(String transferProcessId) {
        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder.pathSegment("/v2/contractdefinitions/{id}", "{id}").build(transferProcessId))
                .retrieve()
                .toEntity(TransferProcess.class)
                .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<IdResponse> createEDR(NegotiateEdrRequest dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/edrs").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToMono(IdResponse.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Mono<DataAddress> getEDR(String edrId) {
        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder.pathSegment("/edrs", "{id}").build(edrId))
                .retrieve()
                .toEntity(DataAddress.class)
                .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<Void> deleteEDR(String edrId) {
        return webClient
                .delete()
                .uri(uriBuilder -> uriBuilder.pathSegment("/edrs", "{id}").build(edrId))
                .retrieve()
                .bodyToMono(Void.class);
    }

    @Override
    public Mono<AssetRequest> createAASRequest(AssetRequest dto) {
        return webClient
                .post()
                .uri(uriBuilder -> uriBuilder.path("/aas/request").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(dto))
                .retrieve()
                .bodyToMono(AssetRequest.class)
                .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Mono<EndpointDataReferenceEntry> getEDRSByParameters(String agreementId, String assetId, String providerId) {
        return webClient
                .get()
                .uri(uriBuilder -> uriBuilder.path("/edrs")
                        .queryParam("agreementId", agreementId)
                        .queryParam("assetId", assetId)
                        .queryParam("providerId", providerId)
                        .build())
                .retrieve()
                .bodyToMono(EndpointDataReferenceEntry.class);
    }


}
