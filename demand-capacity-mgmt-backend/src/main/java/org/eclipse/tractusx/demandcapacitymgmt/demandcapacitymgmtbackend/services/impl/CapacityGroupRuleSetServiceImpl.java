package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.CGRulesetRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.CGRulesetResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.CapacityGroupRuleSetEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CapacityGroupRuleSetRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupRuleSetService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CapacityGroupRuleSetServiceImpl implements CapacityGroupRuleSetService {
    private final CapacityGroupRuleSetRepository repository;

    @Override
    public CGRulesetResponse getCapacityGroupRuleSets(String cgID) {
        CGRulesetResponse response = new CGRulesetResponse();
        Optional<CapacityGroupRuleSetEntity> entityOptional = repository.findById(UUID.fromString(cgID));

        if (entityOptional.isPresent()) {
            CapacityGroupRuleSetEntity entity = entityOptional.get();
            response.setCgID(cgID);

            response.setPercentage(entity.getRuled_percentage());
        } else {
            log.error("CapacityGroupRuleSetEntity not found for ID: {}", cgID);
            response.setCgID(cgID);
            response.setPercentage("");
        }
        return response;
    }

    @Override
    public CGRulesetResponse applyCapacityGroupRuleSets(CGRulesetRequest request) {
        UUID cgUUID = UUID.fromString(request.getCgID());
        CapacityGroupRuleSetEntity entity = repository.findById(cgUUID)
                .orElse(new CapacityGroupRuleSetEntity());

        entity.setCgID(cgUUID);
        entity.setRuled_percentage(request.getPercentages());

        CapacityGroupRuleSetEntity savedEntity = repository.save(entity);

        CGRulesetResponse response = new CGRulesetResponse();
        response.setCgID(savedEntity.getCgID().toString());
        response.setPercentage(savedEntity.getRuled_percentage());

        return response;
    }
}
