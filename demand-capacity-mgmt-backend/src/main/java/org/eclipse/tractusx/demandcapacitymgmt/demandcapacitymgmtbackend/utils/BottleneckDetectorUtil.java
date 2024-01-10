package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.utils;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.MonthReport;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.WeekReport;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.YearReport;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.bottlenecks.MonthReportDto;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.bottlenecks.WeekReportDto;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.bottlenecks.YearReportDto;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.*;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.BottleneckManager;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

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

    public YearReport convertToYearReport(YearReportDto yearReportDto) {
        YearReport yearReport = new YearReport();
        yearReport.setYear(yearReportDto.getYear());
        yearReport.setCapacityGroupId(yearReportDto.getCapacityGroupId());
        yearReport.setRuled(yearReportDto.isRuled());
        yearReport.setPercentage(yearReportDto.getPercentage());
        yearReport.setTotalWeeksCurrentYear(yearReportDto.getTotalWeeksCurrentYear());

        if (yearReportDto.getMonthReportDto() != null) {
            List<MonthReport> monthReports = new ArrayList<>();
            for (MonthReportDto monthReportDto : yearReportDto.getMonthReportDto()) {
                monthReports.add(convertToMonthReport(monthReportDto));
            }
            yearReport.setMonthReport(monthReports);
        }

        return yearReport;
    }

    public MonthReport convertToMonthReport(MonthReportDto monthReportDto) {
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

    public WeekReport convertToWeekReport(WeekReportDto weekReportDto) {
        WeekReport weekReport = new WeekReport();
        weekReport.setWeek(weekReportDto.getWeek());
        weekReport.setDelta(weekReportDto.getDelta());
        weekReport.setMaxCapacity(weekReportDto.getMaxCapacity());
        weekReport.setActCapacity(weekReportDto.getActCapacity());
        weekReport.setCatID(weekReportDto.getDemandCatID());
        weekReport.setCatName(weekReportDto.getDemandCatName());
        weekReport.setCatCode(weekReportDto.getDemandCatCode());

        return weekReport;
    }


    // Year report generation
    @Override
    public YearReport generateYearReport(String userID, String capacityGroupID) {
        YearReportDto yearReport = new YearReportDto();
        CapacityGroupEntity cgs = capacityGroupRepository.findById(UUID.fromString(capacityGroupID)).get();
        List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities = matchedDemandsRepository.findByCapacityGroupID(cgs.getId());

        int currentYear = LocalDate.now().getYear();
        yearReport.setYear(currentYear);
        yearReport.setCapacityGroupId(capacityGroupID);
        yearReport.setTotalWeeksCurrentYear(getWeeksInYear(currentYear));

        List<MonthReportDto> monthReports = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            MonthReportDto monthReport = processMonth(matchedEntities, month, currentYear, cgs.getDefaultActualCapacity(), cgs.getDefaultMaximumCapacity());
            monthReports.add(monthReport);
        }

        yearReport.setMonthReportDto(monthReports);
        return convertToYearReport(yearReport);
    }

    // Month report processing
    private MonthReportDto processMonth(List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities,
                                        int month, int year, float capacity, float maxCapacity) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate firstDayOfMonth = yearMonth.atDay(1);
        LocalDate lastDayOfMonth = yearMonth.atEndOfMonth();

        List<WeekReportDto> weekReports = new ArrayList<>();

        // Adjust the start date to the beginning of the first week in the month
        LocalDate current = firstDayOfMonth.with(WeekFields.ISO.dayOfWeek(), 1);
        if (current.getMonthValue() != month) {
            current = current.plusWeeks(1); // Move to the next week if the first week starts in the previous month
        }

        while (!current.isAfter(lastDayOfMonth)) {
            int weekOfYear = current.get(WeekFields.ISO.weekOfWeekBasedYear());

            // Exclude the first week of the next year if it's part of December
            if (month == 12 && weekOfYear == 1 && current.getYear() == year) {
                break;
            }

            // Proceed only if the week belongs to the current year
            if (current.getYear() == year) {
                List<DemandSeriesValues> weekDemandValues = getDemandsForWeek(matchedEntities, weekOfYear);
                weekReports.add(calculateWeekDelta(weekDemandValues, weekOfYear, year, capacity, maxCapacity));
            }

            current = current.plusWeeks(1);
        }

        MonthReportDto monthReport = new MonthReportDto();
        monthReport.setMonth(yearMonth.getMonth().toString());
        monthReport.setWeekReportDto(weekReports);

        return monthReport;
    }

    private List<DemandSeriesValues> getDemandsForWeek(List<LinkedCapacityGroupMaterialDemandEntity> matchedEntities, int weekOfYear) {
        List<DemandSeriesValues> weekDemandValues = new ArrayList<>();

        for (LinkedCapacityGroupMaterialDemandEntity entity : matchedEntities) {
            Optional<MaterialDemandEntity> materialDemandOpt = materialDemandRepository.findById(entity.getMaterialDemandID());
            materialDemandOpt.ifPresent(materialDemand -> {
                for (DemandSeries demandSeries : materialDemand.getDemandSeries()) {
                    demandSeries.getDemandSeriesValues().stream()
                            .filter(dsv -> dsv.getCalendarWeek().get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear()) == weekOfYear)
                            .forEach(weekDemandValues::add);
                }
            });
        }

        return weekDemandValues;
    }


    private WeekReportDto calculateWeekDelta(List<DemandSeriesValues> weekDemandValues, int weekNumber, int year, float capacity, float maxCapacity) {
        WeekReportDto weekReport = new WeekReportDto();
        double totalDemand = weekDemandValues.stream()
                .mapToDouble(DemandSeriesValues::getDemand)
                .sum();


        // Updated delta calculation: capacity - totalDemand
        double totalDelta = capacity - totalDemand;
        if (weekDemandValues.isEmpty()){
            weekReport.setWeek(weekNumber);
            weekReport.setDelta(0);
        } else {
            DemandCategoryEntity category = weekDemandValues.get(0).getDemandSeries().getDemandCategory();
            weekReport.setDemandCatID(category.getId().toString());
            weekReport.setDemandCatName(category.getDemandCategoryName());
            weekReport.setDemandCatCode(category.getDemandCategoryCode());
            weekReport.setWeek(weekNumber);
            weekReport.setDelta(totalDelta);
        }
        weekReport.setActCapacity(capacity);
        weekReport.setMaxCapacity(maxCapacity);
        return weekReport;
    }


    private int getWeeksInYear(int year) {
        LocalDate lastDayOfYear = LocalDate.of(year, 12, 31);
        return (lastDayOfYear.getDayOfWeek() == DayOfWeek.THURSDAY ||
                (lastDayOfYear.isLeapYear() && lastDayOfYear.getDayOfWeek() == DayOfWeek.WEDNESDAY)) ? 53 : 52;
    }




}
