package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.CapacityDeviation;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.StatusColor;

public class StatusManager {

    static StatusColor getStatusColor(int demand ,int maxCapacity, int actualCapacity) {
        CapacityDeviation capacityDeviation = CapacityDeviation.ZERO;
         if (demand > maxCapacity) {
            capacityDeviation = CapacityDeviation.BOTTLENECK;
        } else if (demand > actualCapacity && demand < maxCapacity) {
             capacityDeviation = CapacityDeviation.BOTTLENECK;
        } else if (demand < actualCapacity) {
             capacityDeviation = CapacityDeviation.SURPLUS;
         }
        return capacityDeviation.getStatusColor();
    }

    static EventType getEventType(boolean isMaterialDemandLinkedToCG,
                                   StatusColor oldStatusColor,
                                   StatusColor newStatusColor){
        if(isMaterialDemandLinkedToCG) return EventType.TODO;
        if(newStatusColor == StatusColor.GREEN ||
                (oldStatusColor == StatusColor.RED && newStatusColor == StatusColor.YELLOW)){
            return EventType.STATUS_IMPROVEMENT;
        }
        if(newStatusColor == StatusColor.RED ||
                (oldStatusColor == StatusColor.GREEN && newStatusColor == StatusColor.YELLOW)){
            return EventType.STATUS_REDUCTION;
        }

        return EventType.GENERAL_EVENT;

    }
}
