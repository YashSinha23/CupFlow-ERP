export function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMonthDates(year, month) {
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: count }, (_, index) => new Date(year, month, index + 1));
}

export function getMonthWeeks(year, month) {
  const dates = getMonthDates(year, month);
  const firstDayOffset = (dates[0].getDay() + 6) % 7;
  const calendarCells = [...Array(firstDayOffset).fill(null), ...dates];
  const weeks = [];

  for (let index = 0; index < calendarCells.length; index += 7) {
    weeks.push(calendarCells.slice(index, index + 7).filter(Boolean));
  }

  return weeks;
}
