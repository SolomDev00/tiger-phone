import { countries, ICountry } from "../data/countries";

interface PhoneNumber {
  countryCode: string; // ISO country code (e.g., "EG")
  nationalNumber: string; // National number (e.g., "01014348488")
  dialCode: string; // Dial code (e.g., "+20")
  isValid: () => boolean; // Validates the phone number against country-specific pattern
  formatInternational: () => string; // Formats number in international format (e.g., "+201014348488")
  formatNational: () => string; // Formats number in national format (e.g., "01014348488")
  formatE164: () => string; // Formats number in E.164 standard (e.g., "+201014348488")
  error?: string; // Optional error message if number is invalid
}

/**
 * Parses a phone number based on input and default country
 * @param input Phone number string (e.g., "01014348488", "+201014348488", "010-1434-8488")
 * @param defaultCountry ISO country code (e.g., "EG")
 * @returns PhoneNumber object or null if invalid
 */
export function parsePhoneNumber(
  input: string,
  defaultCountry: string = "EG"
): PhoneNumber | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  // Clean input by removing non-digit characters except '+'
  const cleanNumber = input.replace(/[^\d+]/g, "");

  // Find country based on defaultCountry or fallback to first country
  let selectedCountry: ICountry | undefined =
    countries.find(
      (c) => c.code.toUpperCase() === defaultCountry.toUpperCase()
    ) || countries[0];

  // If input starts with a dial code, try to detect country
  if (cleanNumber.startsWith("+")) {
    const country = countries.find((c) =>
      cleanNumber.startsWith(c.dialCode.replace("+", ""))
    );
    if (country) {
      selectedCountry = country;
    }
  }

  if (!selectedCountry) {
    return null;
  }

  // Extract national number
  const dialCodeDigits = selectedCountry.dialCode.replace("+", "");
  let nationalNumber = cleanNumber.startsWith(dialCodeDigits)
    ? cleanNumber.substring(dialCodeDigits.length)
    : cleanNumber.startsWith("+")
    ? cleanNumber.substring(1)
    : cleanNumber;

  // Validate phone number against country-specific pattern
  const isValid = () => {
    if (!nationalNumber || !/^\d+$/.test(nationalNumber)) {
      return false;
    }
    // phonePattern is a string, so use RegExp constructor
    return new RegExp(selectedCountry!.phonePattern).test(nationalNumber);
  };

  // Format as international number
  const formatInternational = () => {
    return isValid() ? `+${dialCodeDigits}${nationalNumber}` : "";
  };

  // Format as national number
  const formatNational = () => {
    return isValid() ? nationalNumber : "";
  };

  // Format as E.164 standard
  const formatE164 = () => {
    return isValid() ? `+${dialCodeDigits}${nationalNumber}` : "";
  };

  // Determine error message if invalid
  const valid = isValid();
  const error = valid
    ? undefined
    : `Invalid phone number for ${selectedCountry.nameEn}. Expected format: ${selectedCountry.phonePattern}`;

  // Return PhoneNumber object
  return {
    countryCode: selectedCountry.code,
    nationalNumber,
    dialCode: selectedCountry.dialCode,
    isValid,
    formatInternational,
    formatNational,
    formatE164,
    error,
  };
}

// Ensure file is recognized as a module
export {};
