package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums;

public enum CapacityDeviation {
    BOTTLENECK(StatusColor.RED),
    SURPLUS(StatusColor.GREEN),
    ZERO(StatusColor.GREEN);

    private final StatusColor statusColor;

    CapacityDeviation(StatusColor statusColor) {
        this.statusColor = statusColor;
    }

    public StatusColor getStatusColor() {
        return statusColor;
    }
}
