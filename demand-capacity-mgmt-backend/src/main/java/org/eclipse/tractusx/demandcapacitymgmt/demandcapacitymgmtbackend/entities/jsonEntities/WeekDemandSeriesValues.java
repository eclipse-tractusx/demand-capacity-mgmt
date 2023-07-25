package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.jsonEntities;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WeekDemandSeriesValues {

    private LocalDateTime calendarWeek;

    private Double demand;
}
