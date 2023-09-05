package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import java.util.UUID;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventStatus;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;

public class LoggingHistoryUtils {

    //TODO: Add the Event of type 'todo'
    public static EventType getEventType(EventStatus eventStatus) {
        if (
            eventStatus == EventStatus.TRANSITIONED_FROM_GREEN_TO_RED ||
            eventStatus == EventStatus.TRANSITIONED_FROM_YELLOW_TO_RED ||
            eventStatus == EventStatus.TRANSITIONED_FROM_GREEN_TO_YELLOW
        ) {
            return EventType.STATUS_IMPROVEMENT;
        } else if (
            eventStatus == EventStatus.TRANSITIONED_FROM_RED_TO_YELLOW ||
            eventStatus == EventStatus.TRANSITIONED_FROM_YELLOW_TO_GREEN ||
            eventStatus == EventStatus.TRANSITIONED_FROM_RED_TO_GREEN
        ) {
            return EventType.STATUS_REDUCTION;
        }
        return EventType.GENERAL_EVENT;
    }
}
