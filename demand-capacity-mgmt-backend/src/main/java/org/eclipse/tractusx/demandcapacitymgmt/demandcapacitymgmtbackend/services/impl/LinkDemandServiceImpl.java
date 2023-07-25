package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import java.util.LinkedList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LinkDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.WeekBasedMaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.LinkDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LinkDemandService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class LinkDemandServiceImpl implements LinkDemandService {

    private final LinkDemandRepository linkDemandRepository;

    @Override
    public void createLinkDemands(List<WeekBasedMaterialDemandEntity> weekBasedMaterialDemandEntities) {
        List<LinkDemandEntity> linkDemandEntityList = new LinkedList<>();

        weekBasedMaterialDemandEntities.forEach(
            weekBasedMaterialDemand -> {
                List<LinkDemandEntity> linkDemandEntity = convertFromWeekBasedMaterial(weekBasedMaterialDemand);

                linkDemandEntityList.addAll(linkDemandEntity);
            }
        );

        linkDemandRepository.saveAll(linkDemandEntityList);
    }

    private List<LinkDemandEntity> convertFromWeekBasedMaterial(WeekBasedMaterialDemandEntity weekBasedMaterialDemand) {
        return weekBasedMaterialDemand
            .getWeekBasedMaterialDemand()
            .getDemandSeries()
            .stream()
            .map(
                demandWeekSeriesDto ->
                    LinkDemandEntity
                        .builder()
                        .linked(false)
                        .demandCategoryId(demandWeekSeriesDto.getDemandCategory().getDemandCategoryCode())
                        .weekBasedMaterialDemand(weekBasedMaterialDemand)
                        .materialNumberSupplier(
                            weekBasedMaterialDemand.getWeekBasedMaterialDemand().getMaterialNumberSupplier()
                        )
                        .materialNumberCustomer(
                            weekBasedMaterialDemand.getWeekBasedMaterialDemand().getMaterialNumberCustomer()
                        )
                        .build()
            )
            .toList();
    }
}
