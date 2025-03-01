export const getOptionDateString = (
  day: number,
  month?: number,
  year?: number,
): string => {
  const now = new Date();
  const yearString = (year ?? now.getFullYear()).toString().slice(-2);
  const monthString = (month ?? now.getMonth()).toString().padStart(2, '0'); // JavaScript months are 0-indexed, so add 1
  const dayString = day.toString().padStart(2, '0'); // Format day as 2 digits
  return `${yearString}${monthString}${dayString}`; // Format as "YYMMDD"
};

export const getNextThirdFriday = (): Date => {
  const now = new Date();
  let nextMonth = now.getMonth() + 1; // Next month
  let nextMonthYear = now.getFullYear();

  // If the current month is December, set next month to January of the next year
  if (nextMonth > 11) {
    nextMonth = 0;
    nextMonthYear++;
  }

  // Get the first day of the next month
  const firstDayOfNextMonth = new Date(nextMonthYear, nextMonth, 1);

  // Find the first Friday of next month
  const firstFriday = new Date(firstDayOfNextMonth);
  firstFriday.setDate(
    firstFriday.getDate() + ((5 - firstFriday.getDay() + 7) % 7),
  ); // Adjust to the first Friday

  // Get the third Friday (add 14 days to the first Friday)
  const thirdFriday = new Date(firstFriday);
  thirdFriday.setDate(firstFriday.getDate() + 14); // Move to third Friday

  return thirdFriday;
};
