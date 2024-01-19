package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CDRulesetRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CDRulesetResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CompanyRuleSetEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CompanyRuleSetRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CompanyRuleSetService;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class CompanyRuleSetServiceImpl implements CompanyRuleSetService {

    private final CompanyRuleSetRepository repository;

    @Override
    public CDRulesetResponse getCompanyRuleSets(String companyID) {
        CDRulesetResponse response = new CDRulesetResponse();
        Optional<CompanyRuleSetEntity> entityOptional = repository.findById(UUID.fromString(companyID));

        if (entityOptional.isPresent()) {
            CompanyRuleSetEntity entity = entityOptional.get();
            response.setCompanyID(companyID);

            response.setPercentage(entity.getRuled_percentage());
        } else {
            log.error("CompanyRuleSetEntity not found for ID: {}", companyID);
            response.setCompanyID(companyID);
            response.setPercentage("");
        }
        return response;
    }

    @Override
    public CDRulesetResponse applyCompanyRuleSets(CDRulesetRequest request) {
        UUID cdUUID = UUID.fromString(request.getCompanyID());
        CompanyRuleSetEntity entity = repository.findById(cdUUID)
                .orElse(new CompanyRuleSetEntity());

        entity.setCompanyID(cdUUID);
        entity.setRuled_percentage(request.getPercentages());

        CDRulesetResponse response = new CDRulesetResponse();
        if(entity.getRuled_percentage().equals("{}")){
            repository.deleteByCompanyID(cdUUID);
            response.setCompanyID((cdUUID.toString()));
        } else {
            CompanyRuleSetEntity savedEntity = repository.save(entity);
            response.setCompanyID(savedEntity.getCompanyID().toString());
            response.setPercentage(savedEntity.getRuled_percentage());
        }

        return response;
    }
}
