/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *    See the NOTICE file(s) distributed with this work for additional
 *    information regarding copyright ownership.
 *
 *    This program and the accompanying materials are made available under the
 *    terms of the Apache License, Version 2.0 which is available at
 *    https://www.apache.org/licenses/LICENSE-2.0.
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *    License for the specific language governing permissions and limitations
 *    under the License.
 *
 *    SPDX-License-Identifier: Apache-2.0
 *    ********************************************************************************
 */

package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.*;
import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.bottlenecks.CategoryDeltaDto;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.bottlenecks.MonthReportDto;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.bottlenecks.WeekReportDto;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.bottlenecks.YearReportDto;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.BottleneckManager;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class BottleneckDetectorUtil implements BottleneckManager {

    private static final LocalDate TWO_WEEKS_FROM_NOW = LocalDate.now().plusWeeks(2);
    private final MaterialDemandRepository materialDemandRepository;
    private final CapacityGroupRepository capacityGroupRepository;
    private final StatusesRepository statusesRepository;
    private final UserRepository userRepository;
    private final LinkedCapacityGroupMaterialDemandRepository matchedDemandsRepository;
    private final LoggingHistoryRepository loggingRepository;

    private final CapacityGroupRuleSetRepository cgRuleSetRepository;

    private final CompanyRuleSetRepository cdRuleSetRepository;

    @Override
    public void calculateTodos(String userID) {
        userRepository
            .findById(UUID.fromString(userID))
            .ifPresent(
                user -> {
                    List<MaterialDemandEntity> demands = fetchDemandsBasedOnRole(user, userID);

                    StatusesEntity statusesEntity = statusesRepository
                        .findByUserID(UUID.fromString(userID))
                        .orElseGet(() -> generateNewEntity(userID));

                    statusesEntity.setTodosCount(demands.size());
                    statusesRepository.save(statusesEntity);
                }
            );
    }

    private StatusesEntity generateNewEntity(String userID) {
        return StatusesEntity.builder().userID(UUID.fromString(userID)).build();
    }

    private List<MaterialDemandEntity> fetchDemandsBasedOnRole(UserEntity user, String userID) {
        List<MaterialDemandEntity> demands = new ArrayList<>();

        if (user.getRole().equals(Role.CUSTOMER)) {
            demands =
                materialDemandRepository
                    .findAll() //TODO SUPPLIER AQUI findbysupplierID
                    .stream()
                    .filter(
                        d ->
                            d
                                .getDemandSeries()
                                .stream()
                                .allMatch(
                                    series ->
                                        series
                                            .getDemandSeriesValues()
                                            .stream()
                                            .allMatch(value -> value.getDemand() == 0)
                                )
                    )
                    .collect(Collectors.toList());
        } else if (user.getRole().equals(Role.SUPPLIER)) {
            demands =
                materialDemandRepository
                    .findAll() //TODO CUSTOMER AQUI findbycustomerID
                    .stream()
                    .filter(d -> d.getLinkStatus() == EventType.UN_LINKED)
                    .collect(Collectors.toList());
        }
        return demands;
    }

    @Override
    public void calculateBottleneck(String userID, boolean postLog) {
        UserEntity user = getUser(userID).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<CapacityGroupEntity> capacityGroups = capacityGroupRepository.findByUserID(user.getId());

        for (CapacityGroupEntity cgs : capacityGroups) {
            Pair<Integer, Integer> weeklyResults = processCapacityGroup(userID, cgs, postLog);
            updateAndLogStatus(userID, postLog, weeklyResults, cgs.getId());
        }
    }

    private Optional<UserEntity> getUser(String userID) {
        return userRepository.findById(UUID.fromString(userID));
    }

    private Optional<StatusesEntity> getStatus(String userID) {
        return statusesRepository.findByUserID(UUID.fromString(userID));
    }

    private void updateAndLogStatus(String userID, boolean postLog, Pair<Integer, Integer> weeklyResults, UUID cgID) {
        int improvements = weeklyResults.getKey();
        int degradations = weeklyResults.getValue();

        StatusesEntity status = getStatus(userID).orElseGet(() -> createInitialStatus(userID));
        status.setStatusImprovementCount(improvements);
        status.setStatusDegradationCount(degradations);
        statusesRepository.save(status);

        logImprovementsAndDegradations(userID, postLog, improvements, degradations, cgID);
    }

    private void logImprovementsAndDegradations(
        String userID,
        boolean postLog,
        int improvements,
        int degradations,
        UUID cgID
    ) {
        if (improvements > 0) {
            logEvent(
                EventType.STATUS_IMPROVEMENT,
                userID,
                postLog,
                "Status improved for " + improvements + " weeks",
                cgID
            );
        }
        if (degradations > 0) {
            logEvent(
                EventType.STATUS_REDUCTION,
                userID,
                postLog,
                "Status degraded for " + degradations + " weeks",
                cgID
            );
        }
    }

    private Pair<Integer, Integer> processCapacityGroup(String userID, CapacityGroupEntity cgs, boolean postLog) {
        List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities = matchedDemandsRepository.findByCapacityGroupID(
            cgs.getId()
        );

        int weeklyImprovements = 0;
        int weeklyDegradations = 0;

        for (LinkedCapacityGroupMaterialDemandEntity entity : matchedEntities) {
            Pair<Integer, Integer> results = processEachDemandEntity(entity, userID, cgs, postLog);
            weeklyImprovements += results.getKey();
            weeklyDegradations += results.getValue();
        }

        updateCapacityGroupStatus(cgs, weeklyImprovements, weeklyDegradations);
        return Pair.of(weeklyImprovements, weeklyDegradations);
    }

    private Pair<Integer, Integer> processEachDemandEntity(
        LinkedCapacityGroupMaterialDemandEntity entity,
        String userID,
        CapacityGroupEntity cgs,
        boolean postLog
    ) {
        int improvements = 0;
        int degradations = 0;

        Optional<MaterialDemandEntity> materialDemandOpt = materialDemandRepository.findById(
            entity.getMaterialDemandID()
        );
        if (materialDemandOpt.isPresent()) {
            MaterialDemandEntity materialDemand = materialDemandOpt.get();

            for (DemandSeries demandSeries : materialDemand.getDemandSeries()) {
                Pair<Integer, Integer> demandSeriesResults = processDemandSeries(demandSeries, cgs, userID, postLog);
                improvements += demandSeriesResults.getKey();
                degradations += demandSeriesResults.getValue();
            }
        }

        return Pair.of(improvements, degradations);
    }

    private Pair<Integer, Integer> processDemandSeries(
        DemandSeries demandSeries,
        CapacityGroupEntity cgs,
        String userID,
        boolean postLog
    ) {
        int improvements = 0;
        int degradations = 0;

        List<DemandSeriesValues> demandSeriesValuesList = demandSeries.getDemandSeriesValues();
        Map<LocalDate, Double> weeklyDemands = getWeeklyDemands(Collections.singletonList(demandSeries));

        for (Map.Entry<LocalDate, Double> entry : weeklyDemands.entrySet()) {
            LocalDate week = entry.getKey();
            Double demand = entry.getValue();

            DemandSeriesValues demandSeriesValue = findOrCreateDemandSeriesValue(demandSeriesValuesList, week);
            EventType eventType = determineEventType(cgs, demand);

            if (eventType == EventType.STATUS_REDUCTION) {
                degradations++;
            } else if (eventType == EventType.STATUS_IMPROVEMENT) {
                improvements++;
            }

            if (postLog) {
                logEvent(eventType, userID, true, null, cgs.getId());
            }
        }

        return Pair.of(improvements, degradations);
    }

    private void updateCapacityGroupStatus(CapacityGroupEntity cgs, int weeklyImprovements, int weeklyDegradations) {
        if (weeklyDegradations > 0) {
            cgs.setLinkStatus(EventType.STATUS_REDUCTION);
        } else if (weeklyImprovements > 0) {
            cgs.setLinkStatus(EventType.STATUS_IMPROVEMENT);
        } else {
            cgs.setLinkStatus(EventType.GENERAL_EVENT);
        }
        capacityGroupRepository.save(cgs);
    }

    private DemandSeriesValues findOrCreateDemandSeriesValue(
        List<DemandSeriesValues> demandSeriesValuesList,
        LocalDate week
    ) {
        return demandSeriesValuesList
            .stream()
            .filter(dsv -> dsv.getCalendarWeek().equals(week))
            .findFirst()
            .orElseGet(DemandSeriesValues::new);
    }

    private Map<LocalDate, Double> getWeeklyDemands(List<DemandSeries> matchedDemandSeries) {
        return matchedDemandSeries
            .stream()
            .flatMap(demand -> demand.getDemandSeriesValues().stream())
            .filter(value -> !value.getCalendarWeek().isBefore(TWO_WEEKS_FROM_NOW))
            .collect(
                Collectors.groupingBy(
                    DemandSeriesValues::getCalendarWeek,
                    Collectors.summingDouble(DemandSeriesValues::getDemand)
                )
            );
    }

    private void logEvent(EventType eventType, String userID, boolean postLog, String descriptionOverride, UUID cgID) {
        if (!postLog) return;

        LoggingHistoryEntity logEntity = new LoggingHistoryEntity();
        logEntity.setObjectType(EventObjectType.CAPACITY_GROUP);
        logEntity.setCapacityGroupId(cgID);
        logEntity.setEventType(eventType);
        logEntity.setUserAccount(getUser(userID).map(UserEntity::getUsername).orElse("Unknown"));
        logEntity.setTime_created(Timestamp.valueOf(LocalDateTime.now()));
        logEntity.setLogID(UUID.randomUUID());

        logEntity.setDescription(
            Optional.ofNullable(descriptionOverride).orElseGet(() -> getEventDescription(eventType))
        );
        if (logEntity.getDescription() != null) {
            loggingRepository.save(logEntity);
        }
    }

    private String getEventDescription(EventType eventType) {
        Map<EventType, String> descriptions = new HashMap<>();
        descriptions.put(EventType.STATUS_IMPROVEMENT, "Status improvement");
        descriptions.put(EventType.STATUS_REDUCTION, "Status degradation");
        return descriptions.get(eventType);
    }

    private EventType determineEventType(CapacityGroupEntity capacityGroup, double totalDemand) {
        double actualCapacity = capacityGroup.getDefaultActualCapacity();

        if (totalDemand > actualCapacity) {
            return EventType.STATUS_REDUCTION;
        } else if (totalDemand < actualCapacity) {
            return EventType.STATUS_IMPROVEMENT;
        } else { // totalDemand == actualCapacity
            return EventType.GENERAL_EVENT;
        }
    }

    private StatusesEntity createInitialStatus(String userID) {
        StatusesEntity status = new StatusesEntity();
        status.setUserID(UUID.fromString(userID));
        status.setStatusImprovementCount(0);
        status.setStatusDegradationCount(0);
        statusesRepository.save(status);
        return status;
    }

    //YEAR REPORT CALCULATIONS

    private YearReport convertToYearReport(YearReportDto yearReportDto) {
        YearReport yearReport = new YearReport();
        yearReport.setYear(yearReportDto.getYear());
        yearReport.setCapacityGroupId(yearReportDto.getCapacityGroupId());
        yearReport.setRuled(yearReportDto.isRuled());
        yearReport.setPercentage(yearReportDto.getPercentage());
        yearReport.setTotalWeeksCurrentYear(yearReportDto.getTotalWeeksCurrentYear());
        yearReport.setEnabledPercentages(yearReportDto.getEnabledPercentages());

        if (yearReportDto.getMonthReportDto() != null) {
            List<MonthReport> monthReports = new ArrayList<>();
            for (MonthReportDto monthReportDto : yearReportDto.getMonthReportDto()) {
                monthReports.add(convertToMonthReport(monthReportDto));
            }
            yearReport.setMonthReport(monthReports);
        }

        return yearReport;
    }

    private MonthReport convertToMonthReport(MonthReportDto monthReportDto) {
        MonthReport monthReport = new MonthReport();
        monthReport.setMonth(monthReportDto.getMonth());

        if (monthReportDto.getWeekReportDto() != null) {
            List<WeekReport> weekReports = new ArrayList<>();
            for (WeekReportDto weekReportDto : monthReportDto.getWeekReportDto()) {
                weekReports.add(convertToWeekReport(weekReportDto));
            }
            monthReport.setWeekReport(weekReports);
        }
        return monthReport;
    }

    private WeekReport convertToWeekReport(WeekReportDto weekReportDto) {
        WeekReport weekReport = new WeekReport();
        weekReport.setWeek(weekReportDto.getWeek());
        weekReport.setMaxCapacity(weekReportDto.getMaxCapacity());
        weekReport.setActCapacity(weekReportDto.getActCapacity());
        ArrayList<CategoryDelta> deltas = new ArrayList<>();
        for (CategoryDeltaDto dto : weekReportDto.getCategoryDeltaDtos()) {
            deltas.add(convertToCategoryDelta(dto));
        }
        weekReport.setCategoryDeltas(deltas);
        return weekReport;
    }

    private CategoryDelta convertToCategoryDelta(CategoryDeltaDto categoryDeltaDto) {
        CategoryDelta categoryDelta = new CategoryDelta();
        categoryDelta.setCatID(categoryDeltaDto.getCatID());
        categoryDelta.setCatName(categoryDeltaDto.getCatName());
        categoryDelta.setCatCode(categoryDeltaDto.getCatCode());
        categoryDelta.setDelta(categoryDeltaDto.getDelta());
        return categoryDelta;
    }

    // Year report generation
    @Override
    public YearReportResponse generateYearReport(
        String userID,
        String capacityGroupID,
        LocalDate startDate,
        LocalDate endDate,
        boolean ruled,
        int percentage
    ) {
        List<YearReportDto> yearReports = new ArrayList<>();
        for (int year = startDate.getYear(); year <= endDate.getYear(); year++) {
            YearReportDto yearReport = new YearReportDto();
            CapacityGroupEntity cgs = capacityGroupRepository.findById(UUID.fromString(capacityGroupID)).get();
            List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities = matchedDemandsRepository.findByCapacityGroupID(
                cgs.getId()
            );
            yearReport.setYear(year);
            yearReport.setCapacityGroupId(capacityGroupID);
            yearReport.setTotalWeeksCurrentYear(getWeeksInYear(year));

            String enabledPercentages;
            Optional<CapacityGroupRuleSetEntity> cgRuleSet = cgRuleSetRepository.findByCgID(cgs.getId());
            if (cgRuleSet.isPresent()) {
                enabledPercentages = cgRuleSet.get().getRuled_percentage();
                yearReport.setRuled(true);
                yearReport.setEnabledPercentages(enabledPercentages);
            } else {
                Optional<CompanyRuleSetEntity> companyRuleSet = cdRuleSetRepository.findByCompanyID(
                    cgs.getCustomer().getId()
                );
                if (companyRuleSet.isPresent()) {
                    yearReport.setRuled(true);
                    yearReport.setEnabledPercentages(companyRuleSet.get().getRuled_percentage());
                } else {
                    companyRuleSet = cdRuleSetRepository.findByCompanyID(cgs.getSupplier().getId());
                    if (companyRuleSet.isPresent()) {
                        yearReport.setRuled(true);
                        yearReport.setEnabledPercentages(companyRuleSet.get().getRuled_percentage());
                    } else {
                        yearReport.setRuled(false);
                        yearReport.setEnabledPercentages("{}");
                    }
                }
            }

            List<MonthReportDto> monthReports = new ArrayList<>();
            for (int month = 1; month <= 12; month++) {
                if (isMonthWithinRange(year, month, startDate, endDate)) {
                    MonthReportDto monthReport = processMonth(
                        matchedEntities,
                        month,
                        year,
                        cgs.getDefaultActualCapacity(),
                        cgs.getDefaultMaximumCapacity(),
                        startDate,
                        endDate,
                        ruled,
                        percentage
                    );
                    monthReports.add(monthReport);
                }
            }

            yearReport.setMonthReportDto(monthReports);
            yearReports.add(yearReport);
        }
        ArrayList<YearReport> reports = new ArrayList<>();

        for (YearReportDto yearReportDto : yearReports) {
            reports.add(convertToYearReport(yearReportDto));
        }
        YearReportResponse response = new YearReportResponse();
        response.setReports(reports);
        return response;
    }

    private boolean weekFallsInRange(LocalDate currentWeekStart, LocalDate startDate, LocalDate endDate) {
        LocalDate currentWeekEnd = currentWeekStart.plusDays(6); // Assuming a week is 7 days
        return !currentWeekStart.isAfter(endDate) && !currentWeekEnd.isBefore(startDate);
    }

    private boolean isMonthWithinRange(int year, int month, LocalDate startDate, LocalDate endDate) {
        YearMonth yearMonth = YearMonth.of(year, month);
        return !yearMonth.isBefore(YearMonth.from(startDate)) && !yearMonth.isAfter(YearMonth.from(endDate));
    }

    // Month report processing
    private MonthReportDto processMonth(
        List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities,
        int month,
        int year,
        float capacity,
        float maxCapacity,
        LocalDate startDate,
        LocalDate endDate,
        boolean ruled,
        int percentage
    ) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate firstDayOfMonth = yearMonth.atDay(1);
        LocalDate lastDayOfMonth = yearMonth.atEndOfMonth();

        List<WeekReportDto> weekReports = new ArrayList<>();

        LocalDate current = firstDayOfMonth.with(WeekFields.ISO.dayOfWeek(), 1);
        if (current.getMonthValue() != month) {
            current = current.plusWeeks(1);
        }

        while (!current.isAfter(lastDayOfMonth)) {
            int weekOfYear = current.get(WeekFields.ISO.weekOfWeekBasedYear());

            // Check if the current week is within the date range
            if (weekFallsInRange(current, startDate, endDate)) {
                List<DemandSeriesValues> weekDemandValues = getDemandsForWeek(matchedEntities, weekOfYear, year);
                weekReports.add(
                    calculateWeekDelta(weekDemandValues, weekOfYear, capacity, maxCapacity, ruled, percentage)
                );
            }

            current = current.plusWeeks(1);
        }

        MonthReportDto monthReport = new MonthReportDto();
        monthReport.setMonth(yearMonth.getMonth().toString());
        monthReport.setWeekReportDto(weekReports);

        return monthReport;
    }

    private List<DemandSeriesValues> getDemandsForWeek(
        List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities,
        int weekOfYear,
        int year
    ) {
        List<DemandSeriesValues> weekDemandValues = new ArrayList<>();

        for (LinkedCapacityGroupMaterialDemandEntity entity : matchedEntities) {
            Optional<MaterialDemandEntity> materialDemandOpt = materialDemandRepository.findById(
                entity.getMaterialDemandID()
            );
            materialDemandOpt.ifPresent(
                materialDemand -> {
                    for (DemandSeries demandSeries : materialDemand.getDemandSeries()) {
                        // Filter the demand series values based on the weekOfYear and year
                        List<DemandSeriesValues> filteredValues = demandSeries
                            .getDemandSeriesValues()
                            .stream()
                            .filter(
                                dsv -> {
                                    LocalDate demandDate = dsv.getCalendarWeek();
                                    return (
                                        demandDate.get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear()) ==
                                        weekOfYear &&
                                        demandDate.getYear() == year
                                    );
                                }
                            )
                            .toList();

                        weekDemandValues.addAll(filteredValues);
                    }
                }
            );
        }

        return weekDemandValues;
    }

    private WeekReportDto calculateWeekDelta(
        List<DemandSeriesValues> weekDemandValues,
        int weekNumber,
        float capacity,
        float maxCapacity,
        Boolean ruled,
        Integer percentage
    ) {
        WeekReportDto weekReport = new WeekReportDto();
        weekReport.setWeek(weekNumber);
        weekReport.setActCapacity(capacity);
        weekReport.setMaxCapacity(maxCapacity);

        Map<String, List<DemandSeriesValues>> groupedByCategory = weekDemandValues
            .stream()
            .collect(Collectors.groupingBy(dsv -> dsv.getDemandSeries().getDemandCategory().getId().toString()));

        List<CategoryDeltaDto> categoryDeltaDtos = new ArrayList<>();
        for (Map.Entry<String, List<DemandSeriesValues>> entry : groupedByCategory.entrySet()) {
            double totalDemand = entry.getValue().stream().mapToDouble(DemandSeriesValues::getDemand).sum();

            // Apply adjustment if ruled is true and percentage is not null
            double adjustedCapacity = (ruled != null && ruled && percentage != null)
                ? capacity * (1 + (percentage / 100.0))
                : capacity;
            double totalDelta = adjustedCapacity - totalDemand;

            DemandCategoryEntity category = entry.getValue().get(0).getDemandSeries().getDemandCategory();
            CategoryDeltaDto categoryDeltaDto = new CategoryDeltaDto();
            categoryDeltaDto.setCatID(category.getId().toString());
            categoryDeltaDto.setCatName(category.getDemandCategoryName());
            categoryDeltaDto.setCatCode(category.getDemandCategoryCode());
            categoryDeltaDto.setDelta(totalDelta);

            categoryDeltaDtos.add(categoryDeltaDto);
        }

        weekReport.setCategoryDeltaDtos(categoryDeltaDtos);
        return weekReport;
    }

    private int getWeeksInYear(int year) {
        LocalDate lastDayOfYear = LocalDate.of(year, 12, 31);
        return (
                lastDayOfYear.getDayOfWeek() == DayOfWeek.THURSDAY ||
                (lastDayOfYear.isLeapYear() && lastDayOfYear.getDayOfWeek() == DayOfWeek.WEDNESDAY)
            )
            ? 53
            : 52;
    }
}
