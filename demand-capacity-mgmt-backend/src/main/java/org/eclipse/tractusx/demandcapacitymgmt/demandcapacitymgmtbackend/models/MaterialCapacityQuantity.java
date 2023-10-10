package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.models;

import java.time.LocalDateTime;

public class MaterialCapacityQuantity {

    private double maximumCapacity;
    private double actualCapacity;
    private LocalDateTime calendarWeek;
    private double demand;

    private int materialDemandOrder;

    public MaterialCapacityQuantity(
        double maximumCapacity,
        double actualCapacity,
        LocalDateTime calendarWeek,
        double demand,
        int materialDemandOrder
    ) {
        this.maximumCapacity = maximumCapacity;
        this.actualCapacity = actualCapacity;
        this.calendarWeek = calendarWeek;
        this.demand = demand;
        this.materialDemandOrder = materialDemandOrder;
    }

    public double getMaximumCapacity() {
        return maximumCapacity;
    }

    public void setMaximumCapacity(double maximumCapacity) {
        this.maximumCapacity = maximumCapacity;
    }

    public double getActualCapacity() {
        return actualCapacity;
    }

    public int getMaterialDemandOrder() {
        return materialDemandOrder;
    }

    public void setActualCapacity(double actualCapacity) {
        this.actualCapacity = actualCapacity;
    }

    public LocalDateTime getCalendarWeek() {
        return calendarWeek;
    }

    public void setCalendarWeek(LocalDateTime calendarWeek) {
        this.calendarWeek = calendarWeek;
    }

    public double getDemand() {
        return demand;
    }

    public void setDemand(double demand) {
        this.demand = demand;
    }

    public void setMaterialDemandOrder(int materialDemandOrder) {
        this.materialDemandOrder = materialDemandOrder;
    }

    @Override
    public String toString() {
        return (
            "MaterialCapacityQuantity{" +
            "maximumCapacity=" +
            maximumCapacity +
            ", actualCapacity=" +
            actualCapacity +
            ", calendarWeek=" +
            calendarWeek +
            ", demand=" +
            demand +
            '}'
        );
    }
}
