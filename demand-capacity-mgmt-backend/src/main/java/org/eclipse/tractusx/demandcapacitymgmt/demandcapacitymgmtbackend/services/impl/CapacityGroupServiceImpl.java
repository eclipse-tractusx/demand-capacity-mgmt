package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.CapacityGroupStatus;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.BadRequestException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.exceptions.NotFoundException;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.CapacityGroupRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CapacityGroupService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.CompanyService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.UnityOfMeasureService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.DataConverterUtil;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils.UUIDUtil;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class CapacityGroupServiceImpl implements CapacityGroupService {

    private final CompanyService companyService;

    private final UnityOfMeasureService unityOfMeasureService;

    private final CapacityGroupRepository capacityGroupRepository;

    private final LinkDemandRepository linkDemandRepository;

    @Override
    public CapacityGroupResponse createCapacityGroup(CapacityGroupRequest capacityGroupRequest) {
        validateRequestFields(capacityGroupRequest);

        CapacityGroupEntity capacityGroupEntity = enrichCapacityGroup(capacityGroupRequest);

        capacityGroupEntity = capacityGroupRepository.save(capacityGroupEntity);

        return convertCapacityGroupDto(capacityGroupEntity);
    }

    @Override
    public CapacityGroupResponse getCapacityGroupById(String capacityGroupId) {
        CapacityGroupEntity capacityGroupEntity = getCapacityGroupEntity(capacityGroupId);
        return convertCapacityGroupDto(capacityGroupEntity);
    }

    @Override
    public List<CapacityGroupEntity> getAllByStatus(CapacityGroupStatus status) {
        return capacityGroupRepository.findAllByStatus(status);
    }

    @Override
    public List<CapacityGroupDefaultViewResponse> getAll() {
        List<CapacityGroupEntity> capacityGroupEntityList = capacityGroupRepository.findAll();
        return convertCapacityGroupEntity(capacityGroupEntityList);
    }

    private CapacityGroupEntity getCapacityGroupEntity(String capacityGroupId) {
        UUIDUtil.checkValidUUID(capacityGroupId);
        UUID uuid = UUIDUtil.generateUUIDFromString(capacityGroupId);
        Optional<CapacityGroupEntity> capacityGroup = capacityGroupRepository.findById(uuid);

        if (capacityGroup.isEmpty()) {
            throw new NotFoundException("");
        }

        return capacityGroup.get();
    }

    private void validateRequestFields(CapacityGroupRequest capacityGroupRequest) {
        if (!UUIDUtil.checkValidUUID(capacityGroupRequest.getCustomer())) {
            throw new BadRequestException("not a valid ID");
        }

        if (!UUIDUtil.checkValidUUID(capacityGroupRequest.getSupplier())) {
            throw new BadRequestException("not a valid ID");
        }

        capacityGroupRequest.getSupplierLocations().forEach(UUIDUtil::checkValidUUID);

        List<UUID> expectedSuppliersLocation = capacityGroupRequest
            .getSupplierLocations()
            .stream()
            .map(UUIDUtil::generateUUIDFromString)
            .toList();

        List<CompanyEntity> companyEntities = companyService.getCompanyIn(expectedSuppliersLocation);

        boolean hasAllCompanies = companyEntities
            .stream()
            .map(CompanyEntity::getId)
            .allMatch(expectedSuppliersLocation::contains);

        if (!hasAllCompanies) {
            throw new BadRequestException("Some Invalid Company");
        }

        List<LocalDateTime> dates = capacityGroupRequest
            .getCapacities()
            .stream()
            .map(capacityResponse -> DataConverterUtil.convertFromString(capacityResponse.getCalendarWeek()))
            .toList();

        if (!DataConverterUtil.checkListAllMonday(dates) || !DataConverterUtil.checkDatesSequence(dates)) {
            throw new BadRequestException("not a valid dates");
        }
    }

    private CapacityGroupEntity enrichCapacityGroup(CapacityGroupRequest capacityGroupRequest) {
        UUID capacityGroupId = UUID.randomUUID();
        AtomicReference<String> materialNumberCustomer = new AtomicReference<>("");
        AtomicReference<String> materialDescriptionCustomer = new AtomicReference<>("");
        UnitMeasureEntity unitMeasure = unityOfMeasureService.findById(
            UUIDUtil.generateUUIDFromString(capacityGroupRequest.getUnitOfMeasure())
        );

        CompanyEntity supplier = companyService.getCompanyById(
            UUIDUtil.generateUUIDFromString(capacityGroupRequest.getSupplier())
        );

        CompanyEntity customer = companyService.getCompanyById(
            UUIDUtil.generateUUIDFromString(capacityGroupRequest.getSupplier())
        );

        List<CapacityTimeSeries> capacityTimeSeries = capacityGroupRequest
            .getCapacities()
            .stream()
            .map(
                capacityRequest ->
                    enrichCapacityTimeSeries(
                        DataConverterUtil.convertFromString(capacityRequest.getCalendarWeek()),
                        capacityRequest.getActualCapacity().doubleValue(),
                        capacityRequest.getMaximumCapacity().doubleValue()
                    )
            )
            .toList();

        List<LinkedDemandSeries> linkDemandEntityList = capacityGroupRequest
            .getLinkedDemandSeries()
            .stream()
            .map(
                s -> {
                    LinkDemandEntity linkDemandEntity = linkDemandRepository
                        .findById(UUIDUtil.generateUUIDFromString(s))
                        .orElseThrow();

                    materialNumberCustomer.set(linkDemandEntity.getMaterialNumberCustomer());

                    materialDescriptionCustomer.set(linkDemandEntity.getMaterialNumberCustomer());

                    linkDemandEntity.setLinked(true);
                    linkDemandRepository.save(linkDemandEntity);

                    return LinkedDemandSeries
                        .builder()
                        .materialNumberSupplier(linkDemandEntity.getMaterialNumberSupplier())
                        .materialNumberCustomer(linkDemandEntity.getMaterialNumberCustomer())
                        .build();
                }
            )
            .toList();

        return CapacityGroupEntity
            .builder()
            .id(UUID.randomUUID())
            .capacityGroupId(capacityGroupId)
            .supplierId(supplier)
            .supplierLocation(capacityGroupRequest.getSupplierLocations())
            .customerId(customer)
            .unitMeasure(unitMeasure)
            .changedAt(LocalDateTime.now())
            .capacityTimeSeries(capacityTimeSeries)
            .linkedDemandSeries(linkDemandEntityList)
            .name(capacityGroupRequest.getName())
            .materialNumberCustomer(materialNumberCustomer.get())
            .materialDescriptionCustomer(materialDescriptionCustomer.get())
            .build();
    }

    private CapacityTimeSeries enrichCapacityTimeSeries(
        LocalDateTime calendarWeek,
        Double actualCapacity,
        Double maximumCapacity
    ) {
        return CapacityTimeSeries
            .builder()
            .id(UUID.randomUUID())
            .calendarWeek(calendarWeek)
            .actualCapacity(actualCapacity)
            .maximumCapacity(maximumCapacity)
            .build();
    }

    private CapacityGroupResponse convertCapacityGroupDto(CapacityGroupEntity capacityGroupEntity) {
        CapacityGroupResponse responseDto = new CapacityGroupResponse();

        CompanyDto customer = companyService.convertEntityToDto(capacityGroupEntity.getCustomerId());
        CompanyDto supplier = companyService.convertEntityToDto(capacityGroupEntity.getSupplierId());
        UnitMeasure unitMeasure = enrichUnitMeasure(capacityGroupEntity.getUnitMeasure());

        responseDto.setCustomer(customer);
        responseDto.setSupplier(supplier);
        responseDto.setUnitOfMeasure(unitMeasure);
        responseDto.setChangeAt(capacityGroupEntity.getChangedAt().toString());
        responseDto.setName(capacityGroupEntity.getName());
        responseDto.setCapacityGroupId(capacityGroupEntity.getCapacityGroupId().toString());

        List<CapacityRequest> capacityRequests = capacityGroupEntity
            .getCapacityTimeSeries()
            .stream()
            .map(this::convertCapacityTimeSeries)
            .toList();

        responseDto.setCapacities(capacityRequests);

        List<LinkedDemandSeriesResponse> linkedDemandSeriesResponses = capacityGroupEntity
            .getLinkedDemandSeries()
            .stream()
            .map(this::convertLinkedDemandSeries)
            .toList();
        responseDto.setLinkedDemandSeries(linkedDemandSeriesResponses);

        List<CompanyDto> companyDtoList = capacityGroupEntity
            .getSupplierLocation()
            .stream()
            .map(this::convertString)
            .toList();

        responseDto.setSupplierLocations(companyDtoList);

        return responseDto;
    }

    private UnitMeasure enrichUnitMeasure(UnitMeasureEntity unitMeasureEntity) {
        UnitMeasure unitMeasure = new UnitMeasure();

        unitMeasure.setId(unitMeasureEntity.getId().toString());
        unitMeasure.setCodeValue(unitMeasureEntity.getCodeValue());
        unitMeasure.setDisplayValue(unitMeasureEntity.getDisplayValue());

        return unitMeasure;
    }

    private CapacityRequest convertCapacityTimeSeries(CapacityTimeSeries capacityTimeSeries) {
        CapacityRequest capacityRequest = new CapacityRequest();

        capacityRequest.setActualCapacity(new BigDecimal(capacityTimeSeries.getActualCapacity()));
        capacityRequest.setMaximumCapacity(new BigDecimal(capacityTimeSeries.getMaximumCapacity()));
        capacityRequest.setCalendarWeek(capacityRequest.getCalendarWeek());

        return capacityRequest;
    }

    private LinkedDemandSeriesResponse convertLinkedDemandSeries(LinkedDemandSeries linkedDemandSeries) {
        LinkedDemandSeriesResponse linkedDemandSeriesResponse = new LinkedDemandSeriesResponse();

        linkedDemandSeriesResponse.setMaterialNumberCustomer(linkedDemandSeries.getMaterialNumberCustomer());
        linkedDemandSeriesResponse.setMaterialNumberSupplier(linkedDemandSeries.getMaterialNumberSupplier());

        CompanyDto customer = companyService.convertEntityToDto(linkedDemandSeries.getCustomerId());
        linkedDemandSeriesResponse.setCustomerLocation(customer);

        DemandCategoryResponse demand = convertDemandCategoryEntity(linkedDemandSeries.getDemandCategory());
        linkedDemandSeriesResponse.setDemandCategory(demand);

        return linkedDemandSeriesResponse;
    }

    private DemandCategoryResponse convertDemandCategoryEntity(DemandCategoryEntity demandCategoryEntity) {
        DemandCategoryResponse response = new DemandCategoryResponse();

        response.setId(demandCategoryEntity.getId().toString());
        response.setDemandCategoryCode(demandCategoryEntity.getDemandCategoryCode());
        response.setDemandCategoryName(demandCategoryEntity.getDemandCategoryName());

        return response;
    }

    private CompanyDto convertString(String supplier) {
        CompanyEntity entity = companyService.getCompanyById(UUID.fromString(supplier));

        return companyService.convertEntityToDto(entity);
    }

    private List<CapacityGroupDefaultViewResponse> convertCapacityGroupEntity(
        List<CapacityGroupEntity> capacityGroupEntityList
    ) {
        List<CapacityGroupDefaultViewResponse> capacityGroupList = new ArrayList<>();

        for (CapacityGroupEntity entity : capacityGroupEntityList) {
            CapacityGroupDefaultViewResponse response = new CapacityGroupDefaultViewResponse();

            response.setName(entity.getName());
            response.setStatus(entity.getStatus().toString());
            response.setSupplierBNPL(entity.getSupplierId().getBpn());
            response.setCustomerName(entity.getCustomerId().getCompanyName());
            response.setCustomerBPNL(entity.getCustomerId().getBpn());
            response.setInternalId(entity.getId().toString());
            response.setNumberOfMaterials(new BigDecimal(entity.getCapacityTimeSeries().size()));
            //response.setFavoritedBy();
            //response.setCatXUuid();

            capacityGroupList.add(response);
        }

        return capacityGroupList;
    }
}
