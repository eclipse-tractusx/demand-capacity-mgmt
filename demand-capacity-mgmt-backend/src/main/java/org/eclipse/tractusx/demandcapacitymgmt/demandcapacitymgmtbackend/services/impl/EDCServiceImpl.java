package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.time.Duration;
import java.time.Instant;
import javax.xml.catalog.Catalog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.EDCService;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

@RequiredArgsConstructor
@Service
@Slf4j
public class EDCServiceImpl implements EDCService {

    private final WebClient webClient = WebClient.create("https://materialpass.int.demo.catena-x.net/BPNL000000000000");
    private String accessToken;
    private Instant tokenExpiration;

    public Mono<String> getToken() {
        if (accessToken != null && !isTokenExpired()) {
            return Mono.just(accessToken);
        } else {
            return getAccessToken().map(AccessTokenResponse::getAccessToken);
        }
    }

    @Override
    public Mono<AccessTokenResponse> getAccessToken() {
        String tokenEndpoint =
                "https://centralidp.int.demo.catena-x.net/auth/realms/CX-Central/protocol/openid-connect/token";
        // Set the client credentials
        String clientId = "sa574";
        String clientSecret = "Lh0ctCMQQitoS8qxwKVx9BgbwYOhNJns";
        String grantType = "client_credentials";

        WebClient client = WebClient.builder()
                .baseUrl(tokenEndpoint)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();

        return client.post()
                .body(BodyInserters.fromFormData("grant_type", grantType)
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret))
                .retrieve()
                .bodyToMono(AccessTokenResponse.class)
                .doOnSuccess(response -> {
                    accessToken = response.getAccessToken();
                    // Set token expiration time (assuming response provides expiresIn in seconds)
                    tokenExpiration = Instant.now().plusSeconds(response.getExpiresIn().longValue());
                });
    }

    private boolean isTokenExpired() {
        return tokenExpiration != null && Instant.now().isAfter(tokenExpiration);
    }

    @Override
    public Mono<IdResponse> createAsset(AssetInput dto) {
        return getToken()
            .flatMap(
                accessToken -> {
                    return webClient
                        .post()
                        .uri(uriBuilder -> uriBuilder.path("/management/v2/assets").build())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(BodyInserters.fromValue(dto))
                        .retrieve()
                        .bodyToMono(IdResponse.class);
                }
            )
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public Flux<AssetOutput> createAssetRequest(QuerySpec dto) {
        return webClient
            .post()
            .uri(uriBuilder -> uriBuilder.path("/management/v2/assets/request").build())
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
            .uri(uriBuilder -> uriBuilder.pathSegment("/management/v2/assets", "{id}").build(assetId))
            .retrieve()
            .toEntity(AssetOutput.class)
            .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<Void> deleteAsset(String assetId) {
        return webClient
            .delete()
            .uri(uriBuilder -> uriBuilder.pathSegment("/management/v2/assets", "{id}").build(assetId))
            .retrieve()
            .bodyToMono(Void.class);
    }

    @Override
    public Mono<IdResponse> createPolicy(PolicyDefinitionInput dto) {
        return webClient
            .post()
            .uri(uriBuilder -> uriBuilder.path("/management/v2/policydefinitions").build())
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
            .uri(uriBuilder -> uriBuilder.path("/management/v2/policydefinitions/request").build())
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
            .uri(uriBuilder -> uriBuilder.pathSegment("/management/v2/policydefinitions", "{id}").build(policyId))
            .retrieve()
            .toEntity(PolicyDefinitionOutput.class)
            .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<Void> deletePolicy(String policyId) {
        return webClient
            .delete()
            .uri(uriBuilder -> uriBuilder.pathSegment("/management/v2policydefinitions", "{id}").build(policyId))
            .retrieve()
            .bodyToMono(Void.class);
    }

    @Override
    public Mono<IdResponse> createContractDef(ContractDefinitionInput dto) {
        return webClient
            .post()
            .uri(uriBuilder -> uriBuilder.path("/management/v2/contractdefinitions").build())
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
            .uri(uriBuilder -> uriBuilder.path("/management/v2/contractdefinitions/request").build())
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
            .uri(
                uriBuilder ->
                    uriBuilder.pathSegment("/management/v2/contractdefinitions/{id}", "{id}").build(contractDefId)
            )
            .retrieve()
            .toEntity(ContractDefinitionOutput.class)
            .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<Void> deleteContractDef(String contractDefId) {
        return webClient
            .delete()
            .uri(
                uriBuilder ->
                    uriBuilder.pathSegment("/management/v2/contractdefinitions/{id}", "{id}").build(contractDefId)
            )
            .retrieve()
            .bodyToMono(Void.class);
    }

    @Override
    public Mono<Catalog> createCatalogRequest(CatalogRequest dto) {
        return webClient
            .post()
            .uri(uriBuilder -> uriBuilder.path("/management/v2/catalog/request").build())
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
            .uri(uriBuilder -> uriBuilder.path("/management/v2/contractnegotiations").build())
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
            .uri(uriBuilder -> uriBuilder.path("/management/v2/contractnegotiations/request").build())
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
            .uri(uriBuilder -> uriBuilder.path("/management/v2/transferprocesses").build())
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
            .uri(uriBuilder -> uriBuilder.path("/management/v2/transferprocesses/request").build())
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
            .uri(
                uriBuilder ->
                    uriBuilder.pathSegment("/management/v2/contractdefinitions/{id}", "{id}").build(transferProcessId)
            )
            .retrieve()
            .toEntity(TransferProcess.class)
            .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<IdResponse> createEDR(NegotiateEdrRequest dto) {
        return webClient
            .post()
            .uri(uriBuilder -> uriBuilder.path("/management/edrs").build())
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
            .uri(uriBuilder -> uriBuilder.pathSegment("/management/edrs", "{id}").build(edrId))
            .retrieve()
            .toEntity(DataAddress.class)
            .flatMap(responseEntity -> Mono.justOrEmpty(responseEntity.getBody()));
    }

    @Override
    public Mono<Void> deleteEDR(String edrId) {
        return webClient
            .delete()
            .uri(uriBuilder -> uriBuilder.pathSegment("/management/edrs", "{id}").build(edrId))
            .retrieve()
            .bodyToMono(Void.class);
    }

    @Override
    public Mono<AssetRequest> createAASRequest(AssetRequest dto) {
        return webClient
            .post()
            .uri(uriBuilder -> uriBuilder.path("/management/aas/request").build())
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
            .uri(
                uriBuilder ->
                    uriBuilder
                        .path("/management/edrs")
                        .queryParam("agreementId", agreementId)
                        .queryParam("assetId", assetId)
                        .queryParam("providerId", providerId)
                        .build()
            )
            .retrieve()
            .bodyToMono(EndpointDataReferenceEntry.class);
    }
}
