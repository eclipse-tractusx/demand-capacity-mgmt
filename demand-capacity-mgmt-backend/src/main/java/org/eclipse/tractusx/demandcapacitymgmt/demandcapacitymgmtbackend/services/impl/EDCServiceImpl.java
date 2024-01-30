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

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import io.github.cdimascio.dotenv.Dotenv;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
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

    private static final String BASE_URL = getEnv("BASE_URL");
    private final String apiKey = getEnv("API_KEY");
    private final WebClient webClient = WebClient.create(BASE_URL);
    private String accessToken;
    private Instant tokenExpiration;

    private final String tokenEndpoint = getEnv("TOKEN_ENDPOINT");
    private final String clientId = getEnv("CLIENT_ID");
    private final String clientSecret = getEnv("CLIENT_SECRET");
    private final String grantType = getEnv("GRANT_TYPE");

    private static String getEnv(String key) {
        Dotenv dotenv = Dotenv.configure().load();
        return dotenv.get(key);
    }

    public Mono<String> getToken() {
        if (accessToken != null && !isTokenExpired()) {
            return Mono.just(accessToken);
        } else {
            return getAccessToken().map(AccessTokenResponse::getAccessToken);
        }
    }

    @Override
    public Mono<AccessTokenResponse> getAccessToken() {
        WebClient client = WebClient
            .builder()
            .baseUrl(tokenEndpoint)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
            .build();

        return client
            .post()
            .body(
                BodyInserters
                    .fromFormData("grant_type", grantType)
                    .with("client_id", clientId)
                    .with("client_secret", clientSecret)
            )
            .retrieve()
            .bodyToMono(AccessTokenResponse.class)
            .doOnSuccess(
                response -> {
                    accessToken = response.getAccessToken();
                    // Set token expiration time (assuming response provides expiresIn in seconds)
                    tokenExpiration = Instant.now().plusSeconds(response.getExpiresIn().longValue());
                }
            );
    }

    private boolean isTokenExpired() {
        return tokenExpiration != null && Instant.now().isAfter(tokenExpiration);
    }

    private WebClient webClientCreation(String path) {
        return WebClient.builder().baseUrl(BASE_URL + path).defaultHeader(HttpHeaders.CONTENT_TYPE).build();
    }

    @Override
    public Mono<IdResponse> createAsset(AssetEntryNewDto dto) {
        return webClientCreation("/management/v2/assets")
            .post()
            .header("x-api-key", apiKey)
            .bodyValue(dto)
            .retrieve()
            .bodyToMono(IdResponse.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public List<Asset> createAssetRequest(QuerySpec dto) {
        return webClientCreation("/management/v2/assets/request")
            .post()
            .header("x-api-key", apiKey)
            .retrieve()
            .bodyToFlux(Asset.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)))
            .doOnError(this::logErrorDetails)
            .collectList()
            .block(); // Blocking to get the List
    }

    private void logErrorDetails(Throwable error) {
        // Log error details
        System.err.println("Error occurred while making the request: " + error.getMessage());
    }

    @Override
    public Asset getAsset(String assetId) {
        return webClientCreation("/management/v2/assets/" + assetId)
            .get()
            .header("x-api-key", apiKey)
            .retrieve()
            .bodyToMono(Asset.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)))
            .doOnError(this::logErrorDetails)
            .block(); // Blocking to get the List
    }

    @Override
    public Void deleteAsset(String assetId) {
        webClientCreation("/management/v2/assets/" + assetId)
            .delete()
            .header("x-api-key", apiKey)
            .retrieve()
            .bodyToMono(Asset.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)))
            .doOnError(this::logErrorDetails)
            .block();
        return null;
    }

    @Override
    public Mono<IdResponse> createPolicy(PolicyDefinitionInput dto) {
        return webClientCreation("/management/v2/policydefinitions")
            .post()
            .header("x-api-key", apiKey)
            .bodyValue(dto)
            .retrieve()
            .bodyToMono(IdResponse.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public List<PolicyDefinitionOutput> createPolicyRequest(QuerySpec dto) {
        return webClientCreation("/management/v2/policydefinitions/request")
            .post()
            .header("x-api-key", apiKey)
            .retrieve()
            .bodyToFlux(PolicyDefinitionOutput.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)))
            .doOnError(this::logErrorDetails)
            .collectList()
            .block();
    }

    @Override
    public PolicyDefinitionOutput getPolicy(String policyId) {
        return webClientCreation("/management/v2/policydefinitions/" + policyId)
            .get()
            .header("x-api-key", apiKey)
            .retrieve()
            .bodyToMono(PolicyDefinitionOutput.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)))
            .doOnError(this::logErrorDetails)
            .block();
    }

    @Override
    public Void deletePolicy(String policyId) {
        webClientCreation("/management/v2/policydefinitions/" + policyId)
            .delete()
            .header("x-api-key", apiKey)
            .retrieve()
            .bodyToMono(PolicyDefinitionOutput.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)))
            .doOnError(this::logErrorDetails)
            .block();
        return null;
    }

    @Override
    public Mono<IdResponse> createContractDef(ContractDefinitionInput dto) {
        return webClientCreation("/management/v2/contractdefinitions")
            .post()
            .header("x-api-key", apiKey)
            .bodyValue(dto)
            .retrieve()
            .bodyToMono(IdResponse.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)));
    }

    @Override
    public List<ContractDefinitionOutput> createContractDefRequest(QuerySpec dto) {
        return webClientCreation("/management/v2/contractdefinitions/request")
            .post()
            .header("x-api-key", apiKey)
            .retrieve()
            .bodyToFlux(ContractDefinitionOutput.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)))
            .doOnError(this::logErrorDetails)
            .collectList()
            .block();
    }

    @Override
    public ContractDefinitionOutput getContractDef(String contractDefId) {
        return webClientCreation("/management/v2/contractdefinitions/" + contractDefId)
            .get()
            .header("x-api-key", apiKey)
            .retrieve()
            .bodyToMono(ContractDefinitionOutput.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)))
            .doOnError(this::logErrorDetails)
            .block();
    }

    @Override
    public Void deleteContractDef(String contractDefId) {
        webClientCreation("/management/v2/contractdefinitions/" + contractDefId)
            .delete()
            .header("x-api-key", apiKey)
            .retrieve()
            .bodyToMono(ContractDefinitionOutput.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(3)))
            .doOnError(this::logErrorDetails)
            .block();
        return null;
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
