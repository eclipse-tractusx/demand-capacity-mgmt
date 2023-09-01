package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums;

public enum EventStatus {
    FAIL,
    SUCCESS,
    TRANSITIONED_FROM_RED_TO_YELLOW,
    TRANSITIONED_FROM_RED_TO_GREEN,
    TRANSITIONED_FROM_YELLOW_TO_GREEN,
    TRANSITIONED_FROM_GREEN_TO_YELLOW,
    TRANSITIONED_FROM_GREEN_TO_RED,
    TRANSITIONED_FROM_YELLOW_TO_RED,
}
