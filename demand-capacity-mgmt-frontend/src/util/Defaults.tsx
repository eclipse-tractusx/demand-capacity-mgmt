import { addWeeks, formatISO, startOfDay, subWeeks } from "date-fns";

export const currentDate = startOfDay(new Date());
export const defaultStartDateString = formatISO(subWeeks(currentDate, 8), { representation: 'date' });
export const defaultEndDateString = formatISO(addWeeks(currentDate, 53), { representation: 'date' });