package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.StatusesResponse;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.StatusObjectEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.StatusesEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.StatusesRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.StatusesService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class StatusesServiceImpl implements StatusesService {

    private final StatusesRepository statusesRepository;

    @Override
    public StatusesResponse postStatuses(StatusRequest statusRequest) {
        StatusesEntity statusesEntity = convertDtoToEntity(statusRequest);
        statusesRepository.save(statusesEntity);
        return convertStatusesResponseDto(statusesEntity);
    }

    // TODO: remove the hardcoded id
    private StatusesEntity convertDtoToEntity(StatusRequest statusRequest) {
        StatusObjectEntity todos = StatusObjectEntity
            .builder()
            .id(UUID.fromString("21c10efa-9a75-4da9-9ef9-589d3a54b2ab"))
            .count(statusRequest.getTodos().getCount())
            .capacityGroupIds(statusRequest.getTodos().getCapacityGroups())
            .materialDemandIds(statusRequest.getTodos().getMaterialDemandsIds())
            .build();

        StatusObjectEntity general = StatusObjectEntity
            .builder()
            .id(UUID.fromString("526cf84f-6be3-4b06-9fd5-9da276ab6f32"))
            .count(statusRequest.getGeneral().getCount())
            .capacityGroupIds(statusRequest.getGeneral().getCapacityGroups())
            .materialDemandIds(statusRequest.getGeneral().getMaterialDemandsIds())
            .build();

        StatusObjectEntity statusImprovement = StatusObjectEntity
            .builder()
            .id(UUID.fromString("a10f808a-52e0-4375-ac1b-19eba4523c72"))
            .count(statusRequest.getStatusImprovement().getCount())
            .capacityGroupIds(statusRequest.getStatusImprovement().getCapacityGroups())
            .materialDemandIds(statusRequest.getStatusImprovement().getMaterialDemandsIds())
            .build();

        StatusObjectEntity statusDegredation = StatusObjectEntity
            .builder()
            .id(UUID.fromString("aeeab6ed-cdb1-434f-8886-f065ac5dafc0"))
            .count(statusRequest.getStatusDegredation().getCount())
            .capacityGroupIds(statusRequest.getStatusDegredation().getCapacityGroups())
            .materialDemandIds(statusRequest.getStatusDegredation().getMaterialDemandsIds())
            .build();

        return StatusesEntity
            .builder()
            .id(UUID.fromString("67bb2c53-d717-4a73-90c2-4f18984b10f7"))
            .todos(todos)
            .general(general)
            .statusImprovment(statusImprovement)
            .statusDegredation(statusDegredation)
            .build();
    }

    @Override
    public StatusesResponse getAllStatuses() {
        List<StatusesEntity> statusesEntities = statusesRepository.findAll();
        return statusesEntities.stream().map(this::convertStatusesResponseDto).toList().get(0);
    }

    private StatusesResponse convertStatusesResponseDto(StatusesEntity statusesEntity) {
        StatusesResponse responseDto = new StatusesResponse();
        StatusDto todos = new StatusDto();
        StatusDto general = new StatusDto();
        StatusDto statusImprovment = new StatusDto();
        StatusDto statusDegredation = new StatusDto();

        todos.setCount(statusesEntity.getTodos().getCount());
        todos.setCapacityGroups(statusesEntity.getTodos().getCapacityGroupIds());
        todos.setMaterialDemandsIds(statusesEntity.getTodos().getMaterialDemandIds());

        general.setCount(statusesEntity.getGeneral().getCount());
        general.setCapacityGroups(statusesEntity.getGeneral().getCapacityGroupIds());
        general.setMaterialDemandsIds(statusesEntity.getGeneral().getMaterialDemandIds());

        statusImprovment.setCount(statusesEntity.getStatusImprovment().getCount());
        statusImprovment.setCapacityGroups(statusesEntity.getStatusImprovment().getCapacityGroupIds());
        statusImprovment.setMaterialDemandsIds(statusesEntity.getStatusImprovment().getMaterialDemandIds());

        statusDegredation.setCount(statusesEntity.getStatusDegredation().getCount());
        statusDegredation.setCapacityGroups(statusesEntity.getStatusDegredation().getCapacityGroupIds());
        statusDegredation.setMaterialDemandsIds(statusesEntity.getStatusDegredation().getMaterialDemandIds());

        responseDto.setTodos(todos);
        responseDto.setGeneral(general);
        responseDto.setStatusImprovement(statusImprovment);
        responseDto.setStatusDegredation(statusDegredation);

        return responseDto;
    }
}
