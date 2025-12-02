export const addThousandsSeparator = (num) => {
  // If the input is null or not a number, return an empty string
  if (num == null || isNaN(num)) return "";

  // Split the number into two parts: before and after the decimal
  const [integerPart, fractionalPart] = num.toString().split(".");

  // Add commas to the integer part (e.g., 1234567 -> 1,234,567)
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // If there's a fractional part, add it back with a dot
  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};
