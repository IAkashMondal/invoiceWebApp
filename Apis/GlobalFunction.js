/**
 * Function to get the dynamic financial year range
 * @returns {string} Financial year in YY-YY format
 */
export const getDynamicYearRange = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const month = currentDate.getMonth();

  let startYear = currentYear;
  let endYear = currentYear + 1;

  // If the current month is before April (January, February, March)
  if (month < 3) {
    startYear = currentYear - 1;
    endYear = currentYear;
  }

  return `${startYear.toString().slice(-2)}-${endYear.toString().slice(-2)}`;
};

/**
 * Function to get the current date and time in DDMMYYHHMMSS format
 * @returns {string} Formatted date-time string
 */
export const getDynamicDateTime = () => {
  const currentDate = new Date();

  // Compact format: DDMMYYHHMMSS
  const compactFormat = `${String(currentDate.getDate()).padStart(
    2,
    "0"
  )}${String(currentDate.getMonth() + 1).padStart(2, "0")}${String(
    currentDate.getFullYear()
  ).slice(-2)}${String(currentDate.getHours()).padStart(2, "0")}${String(
    currentDate.getMinutes()
  ).padStart(2, "0")}${String(currentDate.getSeconds()).padStart(2, "0")}`;

  // Formatted date-time: DD/MM/YYYY hh:mm AM/PM
  let hours = currentDate.getHours();
  let minutes = String(currentDate.getMinutes()).padStart(2, "0");
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  const formattedDateTime = `${String(currentDate.getDate()).padStart(
    2,
    "0"
  )}/${String(currentDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${currentDate.getFullYear()} ${String(hours).padStart(
    2,
    "0"
  )}:${minutes} ${ampm}`;

  return { compactFormat, formattedDateTime };
};
// Function to parse generated timestamp and return formatted dates
// Function to generate timestamps based on the current date-time
export const generateTimeObject = () => {
  const now = new Date();

  // Extract date components
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2); // Last two digits of the year

  // Extract time components
  let hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = String(hours % 12 || 12).padStart(2, "0");

  // Generated Time: "MM/DD/YYYY HH:MM AM/PM"
  const generatedOn = `${month}/${day}/20${year} ${formattedHours}:${minutes} ${ampm}`;

  // Issue Date: "DD/MM/YYYY HH:MM AM/PM"
  const issueDate = `${day}/${month}/20${year} ${formattedHours}:${minutes} ${ampm}`;

  // Unique Generated Timestamp: "DDMMYYHHMMSS"
  const generatedTime = `${day}${month}${year}${hours}${minutes}${seconds}`;
  const ChallandT = `${day}${month}${year}${minutes}${seconds}`;
  return { generatedTime, generatedOn, issueDate, ChallandT };
};
// Function to add hours and minutes to generated timestamp
export const addTimeToGeneratedTime = (generatedTime, additionalTime) => {
  if (!generatedTime || generatedTime.toString().length !== 12) return null;

  // Convert generatedTime to string for proper slicing
  const timeStr = generatedTime.toString().padStart(12, "0");

  // Extract date and time components
  const day = parseInt(timeStr.slice(0, 2), 10);
  const month = parseInt(timeStr.slice(2, 4), 10);
  const year = parseInt(`20${timeStr.slice(4, 6)}`, 10);
  let hours = parseInt(timeStr.slice(6, 8), 10);
  let minutes = parseInt(timeStr.slice(8, 10), 10);
  let seconds = parseInt(timeStr.slice(10, 12), 10);

  // Convert additionalTime to string for parsing
  let addHours = 0;
  let addMinutes = 0;

  const additionalTimeStr = additionalTime.toString();

  if (additionalTimeStr.includes(".")) {
    const [hourPart, minutePart] = additionalTimeStr.split(".");
    addHours = parseInt(hourPart, 10) || 0;
    addMinutes = minutePart ? parseInt(minutePart.padEnd(2, "0"), 10) : 0; // Ensure two-digit minutes
  } else {
    addHours = parseInt(additionalTimeStr, 10);
  }

  // Ensure minutes stay within 59 range
  addMinutes = Math.min(addMinutes, 59);

  // Create Date object and add time
  const newDate = new Date(year, month - 1, day, hours, minutes, seconds);
  newDate.setHours(newDate.getHours() + addHours);
  newDate.setMinutes(newDate.getMinutes() + addMinutes);

  // Extract updated date and time
  const newDay = String(newDate.getDate()).padStart(2, "0");
  const newMonth = String(newDate.getMonth() + 1).padStart(2, "0");
  const newYear = String(newDate.getFullYear()).slice(-2); // Last two digits of the year
  const newHours = String(newDate.getHours()).padStart(2, "0"); // 24-hour format
  const newMinutes = String(newDate.getMinutes()).padStart(2, "0");
  const newSeconds = String(newDate.getSeconds()).padStart(2, "0");

  // 12-hour format for validityTime display
  const ampm = newDate.getHours() >= 12 ? "PM" : "AM";
  const formattedHours = String(newDate.getHours() % 12 || 12).padStart(2, "0");

  // Final formatted outputs
  const validityTime = `${newDay}/${newMonth}/20${newYear} ${formattedHours}:${newMinutes} ${ampm}`;
  const VerefyChallanNum = Number(
    `${newDay}${newMonth}${newYear}${newHours}${newMinutes}${newSeconds}`
  );

  return { validityTime, VerefyChallanNum };
};

export function numberToWords(num) {
  if (num === null || num === undefined || isNaN(num)) return "Invalid number";

  const belowTwenty = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertHundreds(n) {
    if (n < 20) return belowTwenty[n];
    if (n < 100)
      return (
        tens[Math.floor(n / 10)] +
        (n % 10 !== 0 ? " " + belowTwenty[n % 10] : "")
      );
    return (
      belowTwenty[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 !== 0 ? " " + convertHundreds(n % 100) : "")
    );
  }

  // Convert the whole number part
  let [wholePart] = num.toFixed(2).split("."); // Ignore decimal part
  wholePart = parseInt(wholePart, 10);

  return wholePart === 0 ? "Zero" : convertHundreds(wholePart);
}

// Function to generate a new Challan ID
export const generateNewChallanID = (prevChallanID) => {
  if (!prevChallanID) return null;

  // Generate a single random number between 1 and 999
  const randomNum = Math.floor(Math.random() * 999) + 1;

  // Compute the new Challan ID
  const newChallanNumber = `${Number(prevChallanID) + randomNum}`;

  return newChallanNumber;
};
