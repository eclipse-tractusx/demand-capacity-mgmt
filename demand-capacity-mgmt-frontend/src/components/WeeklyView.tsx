import React from 'react';
import { useContext, useState } from 'react';
import { format } from 'date-fns';
import './WeeklyView.css';
import { DemandCategoryContext } from '../contexts/DemandCategoryProvider';
import { DemandCategory, DemandProp } from '../interfaces/demand_interfaces';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';


interface WeeklyViewProps {
  demandData: DemandProp;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ demandData }) => {
  const { demandcategories } = useContext(DemandCategoryContext) || {};
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const nextYear = currentYear + 1;

  const [editMode, setEditMode] = useState(false);
  const [savedChanges, setSavedChanges] = useState(false);


  const monthsCurrentYear = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthStart = new Date(currentYear, monthIndex, 1);
    const monthName = format(monthStart, 'MMM');

    let weeks = [];

    if (monthIndex === 0) {
      // For January, generate week numbers 1 to getWeeksInMonth
      weeks = Array.from({ length: getWeeksInMonth(currentYear, monthIndex) }, (_, weekIndex) => weekIndex + 1);
    } else {
      // For other months, calculate ISO week numbers
      weeks = Array.from({ length: getWeeksInMonth(currentYear, monthIndex) }, (_, weekIndex) =>
        getISOWeekNumber(new Date(currentYear, monthIndex, weekIndex * 7 + 1))
      );
    }

    return {
      name: monthName,
      year: currentYear,
      weeks: weeks,
    };
  });

  const monthsPreviousYear = [
    { name: 'Dec', year: previousYear, weeks: Array.from({ length: getWeeksInMonth(previousYear, 11) }, (_, index) => index + 48) },
  ];

  const monthsNextYear = [
    { name: 'Jan', year: nextYear, weeks: Array.from({ length: getWeeksInMonth(nextYear, 0) }, (_, index) => index + 1) },
  ];


  const totalWeeksPreviousYear = monthsPreviousYear.reduce((total, month) => total + month.weeks.length, 0);
  const totalWeeksCurrentYear = monthsCurrentYear.reduce((total, month) => total + month.weeks.length, 0);
  const totalWeeksNextYear = monthsNextYear.reduce((total, month) => total + month.weeks.length, 0);
  // Function to get the number of weeks in a month for a given year and month index
  function getWeeksInMonth(year: number, monthIndex: number): number {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const daysRemaining = daysInMonth - (7 - firstDayOfWeek);
    return Math.ceil((daysRemaining + 1) / 7);
  }

  // Object to store the demand values based on year, month, and week
  const demandValuesMap: Record<string, Record<number, Record<string, number>>> = {};

  function getISOWeekNumber(date: Date): number {
    const newDate = new Date(date);
    const dayOfWeek = newDate.getUTCDay();
    newDate.setUTCDate(newDate.getUTCDate() + 4 - (dayOfWeek || 7));
    const yearStart = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate()) - +yearStart) / 86400000 + 1) / 7);

    // Ensure there are only 52 weeks in a year
    return weekNumber === 0 ? 52 : weekNumber;
  }

  //Mapping of categories
  const idToNumericIdMap: Record<string, number> = {};

  if (demandcategories) {
    demandcategories.forEach((category, index) => {
      idToNumericIdMap[category.id] = index;
    });
  }

  // Populate the demandValuesMap using demandSeriesValues
  demandData.demandSeries?.forEach((series) => {
    const categoryId = series.demandCategory.id;

    series.demandSeriesValues.forEach((value) => {
      const date = new Date(value.calendarWeek);
      const year = date.getFullYear();
      const month = date.getMonth();
      const week = getISOWeekNumber(date).toString();

      if (!demandValuesMap[categoryId]) {
        demandValuesMap[categoryId] = {};
      }
      if (!demandValuesMap[categoryId][year]) {
        demandValuesMap[categoryId][year] = {};
      }
      demandValuesMap[categoryId][year][week] = value.demand;
      console.log(`Category: ${categoryId}, Year: ${year}, Month: ${month}, Week: ${week}, Demand: ${value.demand}`);
    });
  });

  const handleSave = () => {
    // Perform save operation here
    setEditMode(false);
    setSavedChanges(true);
    console.log(savedChanges);// todo clean
  };

  const handleRevert = () => {
    // Revert changes here
    setEditMode(false);
    setSavedChanges(false);
  };

  return (
    <div className='container'>
      <div className="row">
        <div className="col"></div>
        <div className="col-6 border d-flex align-items-center justify-content-center">
          {demandData.id} - {demandData.materialDescriptionCustomer}
        </div>
        <div className="col d-flex justify-content-end">
          <br />
          <ButtonGroup className="mb-2 align-middle">
            <ToggleButton
              id="toggle-edit"
              type="checkbox"
              variant="secondary"
              name="edit"
              value="0"
              checked={editMode}
              onChange={() => setEditMode(!editMode)}
            >
              Edit
            </ToggleButton>
            <Button variant="secondary" name="save" onClick={handleSave}>
              Save
            </Button>
            <Button variant="secondary" name="revert" onClick={handleRevert}>
              Revert Changes
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <br />
      <div className="table-container">

        <div className="container">
          <table className="vertical-table">
            <thead>
              <tr>
                <th className="empty-header-cell"></th>
                <th colSpan={totalWeeksPreviousYear} className="header-cell">
                  {previousYear}
                </th>
                <th colSpan={totalWeeksCurrentYear} className="header-cell">
                  {currentYear}
                </th>
                <th colSpan={totalWeeksNextYear} className="header-cell">
                  {nextYear}
                </th>
              </tr>
              <tr>
                <th className="empty-header-cell"></th>
                {monthsPreviousYear.map((month) =>
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                )}
                {monthsCurrentYear.map((month) =>
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                )}
                {monthsNextYear.map((month) =>
                  <th key={month.name + month.year} colSpan={month.weeks.length} className="header-cell">
                    {month.name}
                  </th>
                )}
              </tr>
              <tr>
                <th className="empty-header-cell"></th>
                {monthsPreviousYear.map((month) =>
                  month.weeks.map((week) =>
                    <th key={month.name + week} className="header-cell week-header-cell">
                      {week}
                    </th>
                  )
                )}
                {monthsCurrentYear.map((month) =>
                  month.weeks.map((week) =>
                    <th key={month.name + week} className="header-cell week-header-cell">
                      {week}
                    </th>
                  )
                )}
                {monthsNextYear.map((month) =>
                  month.weeks.map((week) =>
                    <th key={month.name + week} className="header-cell week-header-cell">
                      {week}
                    </th>
                  )
                )}
              </tr>
              {demandcategories &&
                demandcategories
                  .sort((a, b) => a.id.localeCompare(b.id)) // Sort by category ID
                  .map((category: DemandCategory) => (
                    <tr key={category.id}>
                      <th className="sticky-header-cell">
                        <div className="sticky-header-content">{category.demandCategoryName}</div>
                      </th>
                      {monthsPreviousYear.concat(monthsCurrentYear, monthsNextYear).map((month) => (
                        <React.Fragment key={`${category.id}-${month.name}-${month.year}`}>
                          {month.weeks.map((week: number) => (
                            <td key={`${category.id}-${month.name}-${week}`} className="data-cell">
                              <input
                                className='table-data-input'
                                type="text"
                                defaultValue={demandValuesMap[category.id]?.[month.year]?.[week.toString()] || ''}
                              />
                            </td>
                          ))}
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
            </thead>
          </table>
        </div>
      </div>
    </div>

  );
};


export default WeeklyView;