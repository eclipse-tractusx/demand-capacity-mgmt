package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import eclipse.tractusx.demand_capacity_mgmt_specification.api.EdcApi;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.util.List;
import lombok.AllArgsConstructor;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.EDCService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@AllArgsConstructor
public class EDCController implements EdcApi {

    private final EDCService edcService;

    @Override
    public ResponseEntity<List<Asset>> createAssetRequest(QuerySpec querySpec) throws Exception {
        return ResponseEntity.ok(edcService.createAssetRequest(querySpec));
    }

    @Override
    public ResponseEntity<List<ContractDefinitionOutput>> createContractRequest(QuerySpec querySpec) throws Exception {
        return ResponseEntity.ok(edcService.createContractDefRequest(querySpec));
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
