package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandSeriesCategoryDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandSeriesDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.DemandWeekSeriesDto;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekBasedMaterialDemandRequestDto;
import java.util.List;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.SupplierRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.WeekBasedMaterialDemandRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl.WeekBasedMaterialServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class WeekBasedMaterialServiceTest {

    @InjectMocks
    private WeekBasedMaterialServiceImpl weekBasedMaterialService;

    @Mock
    private WeekBasedMaterialDemandRepository weekBasedMaterialDemandRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private LinkDemandService linkDemandService;

    @Mock
    private DemandService demandService;

    private static DemandSeriesDto demandSeriesDto = createDemandSeriesDto();
    private static DemandWeekSeriesDto demandWeekSeriesDto = createDemandWeekSeriesDto();

    private static WeekBasedMaterialDemandRequestDto weekBasedMaterialDemandRequestDto = createWeekBasedMaterialDemandRequestDto();

    @Test
    void shouldCreateWeekBasedMaterial() {
        weekBasedMaterialService.createWeekBasedMaterial(List.of(weekBasedMaterialDemandRequestDto));

        verify(weekBasedMaterialDemandRepository, times(1)).save(any());
    }

    private static DemandSeriesDto createDemandSeriesDto() {
        DemandSeriesDto demandSeriesDto = new DemandSeriesDto();
        demandSeriesDto.setCalendarWeek("2023-06-19");
        demandSeriesDto.setDemand("1");

        return demandSeriesDto;
    }

    private static DemandWeekSeriesDto createDemandWeekSeriesDto() {
        DemandWeekSeriesDto demandWeekSeriesDto = new DemandWeekSeriesDto();

        DemandSeriesCategoryDto demandSeriesCategoryDto = new DemandSeriesCategoryDto();
        demandSeriesCategoryDto.setId("f50c3e71-a1a7-44c9-9de6-2e7aaaf65ac4");

        demandWeekSeriesDto.setCustomerLocation("");
        demandWeekSeriesDto.setDemands(List.of(demandSeriesDto));
        demandWeekSeriesDto.setDemandCategory(demandSeriesCategoryDto);
        demandWeekSeriesDto.setExpectedSupplierLocation("");

        return demandWeekSeriesDto;
    }

    private static WeekBasedMaterialDemandRequestDto createWeekBasedMaterialDemandRequestDto() {
        WeekBasedMaterialDemandRequestDto basedMaterialDemandRequestDto = new WeekBasedMaterialDemandRequestDto();
        basedMaterialDemandRequestDto.setMaterialNumberCustomer("test");
        basedMaterialDemandRequestDto.setMaterialDemandId("f50c3e71-a1a7-44c9-9de6-2e7aaaf65ac4");
        basedMaterialDemandRequestDto.setSupplier("f50c3e71-a1a7-44c9-9de6-2e7aaaf65ac4");
        basedMaterialDemandRequestDto.setCustomer("f50c3e71-a1a7-44c9-9de6-2e7aaaf65ac4");
        basedMaterialDemandRequestDto.setMaterialDescriptionCustomer("");
        basedMaterialDemandRequestDto.setUnityOfMeasure("un");

        basedMaterialDemandRequestDto.setDemandSeries(List.of(demandWeekSeriesDto));

        return basedMaterialDemandRequestDto;
    }
}
