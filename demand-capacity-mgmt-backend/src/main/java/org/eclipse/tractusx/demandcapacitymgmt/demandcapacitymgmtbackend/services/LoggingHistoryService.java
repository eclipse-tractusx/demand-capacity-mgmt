package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.util.List;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.LoggingHistoryEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.MaterialDemandEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.MaterialDemandStatus;
import org.springframework.http.ResponseEntity;

public interface LoggingHistoryService {
    List<LoggingHistoryResponse> getAllLoggingHistory();
    boolean postLog(LoggingHistoryEntity logEntity);
    //getLoggingHistoryByCapacity()
    //getLoggingHistoryByMaterialDemand()
    //filterByTime
    //getEventsCount
    //getAllEventsRelatedToMeOnly
    //filter events by event type (todo,general,status imp, status des)
    //filter events by event type (opened,read/unread,status imp, status des)

    // filters or query by
    //    managedb or last changed by them self(if it changed by me)
    //if it was favorited by me
    //    the time
    //    description for the event (deleted,validated,created, recieved by edc )

}
