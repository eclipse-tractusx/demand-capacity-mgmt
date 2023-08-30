import React from 'react';
import {useContext} from 'react';
import './WeeklyView.css'; 
import { DemandCategoryContext } from '../contexts/DemandCategoryProvider';
import { DemandCategory, DemandProp } from '../interfaces/demand_interfaces';


const WeeklyView: React.FC = () => { 
  const { demandcategories } = useContext(DemandCategoryContext) || {};
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const nextYear = currentYear + 1;

  // Function to get the number of weeks in a month for a given year and month index
  function getWeeksInMonth(year: number, monthIndex: number): number {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const daysRemaining = daysInMonth - (7 - firstDayOfWeek);
    return Math.ceil((daysRemaining + 1) / 7);
  }

  const monthsPreviousYear = [
    { name: 'Dec', year: previousYear, weeks: Array.from({ length: getWeeksInMonth(previousYear, 11) }, (_, index) => index + 48) },
  ];
  
  const monthsCurrentYear = [
  { name: 'Jan', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 0) }, (_, index) => index + 1) },
  { name: 'Feb', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 1) }, (_, index) => index + 5) },
  { name: 'Mar', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 2) }, (_, index) => index + 9) },
  { name: 'Apr', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 3) }, (_, index) => index + 13) },
  { name: 'May', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 4) }, (_, index) => index + 18) },
  { name: 'Jun', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 5) }, (_, index) => index + 22) },
  { name: 'Jul', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 6) }, (_, index) => index + 26) },
  { name: 'Aug', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 7) }, (_, index) => index + 31) },
  { name: 'Sep', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 8) }, (_, index) => index + 35) },
  { name: 'Oct', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 9) }, (_, index) => index + 40) },
  { name: 'Nov', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 10) }, (_, index) => index + 44) },
  { name: 'Dec', year: currentYear, weeks: Array.from({ length: getWeeksInMonth(currentYear, 11) }, (_, index) => index + 48) },
  ];
  
  const monthsNextYear = [
    { name: 'Jan', year: nextYear, weeks: Array.from({ length: getWeeksInMonth(nextYear, 0) }, (_, index) => index + 1) },
  ];
  

  const totalWeeksPreviousYear = monthsPreviousYear.reduce((total, month) => total + month.weeks.length, 0);
  const totalWeeksCurrentYear = monthsCurrentYear.reduce((total, month) => total + month.weeks.length, 0);
  const totalWeeksNextYear = monthsNextYear.reduce((total, month) => total + month.weeks.length, 0);
      

  const generateRandomDemandValues = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const demandSeriesValues = [];
  
    // Generate demand values for each week between start and end dates
    while (start <= end) {
      const weekStartDate = new Date(start);
      const weekEndDate = new Date(start);
      weekEndDate.setDate(weekEndDate.getDate() + 6); // Calculate week end date
  
      const weekDemand = Math.floor(Math.random() * 100) +1; // Generate a random demand value
  
      demandSeriesValues.push({
        calendarWeek: weekStartDate.toISOString(),
        demand: weekDemand,
      });
  
      start.setDate(start.getDate() + 7); // Move to the next week
    }
  
    return demandSeriesValues;
  };
  
  const exampleData: DemandProp = {
    id: "0a281cdc-050c-40db-a57f-7483c44391ad",
    materialDescriptionCustomer: "Texthere",
    materialNumberCustomer: "RT78856",
    materialNumberSupplier: "0X225588",
    customer: {
      id: "5d210fb8-260d-4190-9578-f62f9c459703",
      bpn: "BPN01",
      companyName: "CGI",
      street: "Test",
      number: "Test",
      zipCode: "Test",
      country: "Test",
      myCompany: "Test"
    },
    supplier: {
      id: "5d210fb8-260d-4190-9578-f62f9c459703",
      bpn: "BPN01",
      companyName: "CGI",
      street: "Test",
      number: "Test",
      zipCode: "Test",
      country: "Test",
      myCompany: "Test"
    },
    unitMeasureId: {
      id: "a8ebe2f8-2af8-4573-9dd4-d7f33e682792",
      codeValue: "un",
      displayValue: "Unit"
    },
    changedAt: "2023-08-04T16:13:40.581402",
    demandSeries: [
      {
        customerLocation: {
          id: "5d210fb8-260d-4190-9578-f62f9c459703",
          bpn: "BPN01",
          companyName: "CGI",
          street: "Test",
          number: "Test",
          zipCode: "Test",
          country: "Test",
          myCompany: "Test"
        },
        expectedSupplierLocation: [
          {
            id: "5d210fb8-260d-4190-9578-f62f9c459703",
            bpn: "BPN01",
            companyName: "CGI",
            street: "Test",
            number: "Test",
            zipCode: "Test",
            country: "Test",
            myCompany: "Test"
          }
        ],
        demandCategory: {
          id: "1622ea81-f454-4800-a15f-16253ae1c93d",
          demandCategoryCode: "DC006",
          demandCategoryName: "Default"
        },
        demandSeriesValues: generateRandomDemandValues('2022-12-01', '2024-01-01'),
      }
    ]
  };

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
  
  const idToNumericIdMap: Record<string, number> = {};

  if (demandcategories) {
    demandcategories.forEach((category, index) => {
      idToNumericIdMap[category.id] = index;
    });
  }

  // Populate the demandValuesMap using demandSeriesValues
  exampleData.demandSeries?.forEach((series) => {
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
  
    return (
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
                  month.weeks.map((week, index) =>
                    <th key={month.name + week} className="header-cell week-header-cell">
                      {week}
                    </th>
                  )
                )}
                {monthsCurrentYear.map((month) =>
                  month.weeks.map((week, index) =>
                    <th key={month.name + week} className="header-cell week-header-cell">
                      {week}
                    </th>
                  )
                )}
                {monthsNextYear.map((month) =>
                  month.weeks.map((week, index) =>
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
  );
};

  
  export default WeeklyView;