import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { ChevronDown, Phone, Search, Loader2 } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { countries, ICountry } from "./data/countries";
import { parsePhoneNumber, PhoneNumber } from "./utils/phoneUtils";
import "./style.css";

// SSR-safe check
const isClient = typeof window !== "undefined";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface IPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  defaultCountryCode?: string;
  showLabel?: boolean;
  showFlag?: boolean;
  showDialCode?: boolean;
  dir?: "ltr" | "rtl";
  language?: "ar" | "en";
  disabled?: boolean;
  isLoading?: boolean;
  icon?: boolean;
}

/**
 * Tiger Phone Input component with auto country detection.
 *
 * @param {IPhoneInputProps} props - The props for the PhoneInput component.
 * @param {string} [props.value] - The current value of the phone input.
 * @param {(value: string) => void} [props.onChange] - Callback function when the value changes.
 * @param {string} [props.error] - Error message to display.
 * @param {string} [props.label="Phone Number"] - Label text.
 * @param {string} [props.placeholder="Enter your phone number"] - Placeholder text.
 * @param {string} [props.defaultCountryCode="EG"] - Default country ISO code.
 * @param {boolean} [props.showLabel=true] - Whether to show the label.
 * @param {boolean} [props.showFlag=true] - Whether to show the flag.
 * @param {boolean} [props.showDialCode=true] - Whether to show the dial code.
 * @param {'ltr' | 'rtl'} [props.dir="ltr"] - Direction of the input.
 * @param {'ar' | 'en'} [props.language="ar"] - Language for display.
 * @param {boolean} [props.disabled=false] - Whether the input is disabled.
 * @param {boolean} [props.isLoading=false] - Whether the input is loading.
 * @param {boolean} [props.icon] - Icon for the input.
 */

const PhoneInput: React.FC<IPhoneInputProps> = ({
  value,
  onChange,
  error,
  label = "Phone Number",
  placeholder = "Enter your phone number",
  defaultCountryCode = "EG",
  showLabel = true,
  showFlag = true,
  showDialCode = true,
  dir = "ltr",
  language = "ar",
  disabled = false,
  isLoading = false,
  icon,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(
    countries.find(
      (c) => c.code.toUpperCase() === defaultCountryCode.toUpperCase()
    ) ||
      countries[0] ||
      null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const filteredCountries = useMemo(() => {
    if (!debouncedSearchTerm) return countries;

    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.includes(debouncedSearchTerm) ||
        country.nameEn.toLowerCase().includes(lowerSearch) ||
        country.dialCode.includes(debouncedSearchTerm)
    );
  }, [debouncedSearchTerm]);

  const detectCountryFromNumber = useCallback(
    (number: string): ICountry | null => {
      const cleanNumber = number.replace(/[^\d]/g, "");

      // First, try to match by dial code
      for (const country of countries) {
        const dialCodeDigits = country.dialCode.replace("+", "");
        if (cleanNumber.startsWith(dialCodeDigits)) {
          return country;
        }
      }

      // If no dial code match, try to match using phonePattern
      if (cleanNumber.length >= 2) {
        for (const country of countries) {
          const pattern = new RegExp(country.phonePattern);
          if (pattern.test(cleanNumber)) {
            return country;
          }
        }
      }

      return null;
    },
    []
  );

  const removeCountryCode = useCallback(
    (number: string, country: ICountry | null) => {
      if (!country || !number) return number;

      const cleanNumber = number.replace(/[^\d]/g, "");
      const dialCodeDigits = country.dialCode.replace("+", "");

      if (cleanNumber.startsWith(dialCodeDigits)) {
        return cleanNumber.substring(dialCodeDigits.length);
      }

      return number;
    },
    []
  );

  // Get minLength and maxLength from parsePhoneNumber
  const getLengthConstraints = useCallback(() => {
    if (!selectedCountry) {
      return { minLength: 7, maxLength: 15 }; // Fallback
    }
    const parsed = parsePhoneNumber(phoneNumber, selectedCountry.code);
    return parsed
      ? { minLength: parsed.minLength, maxLength: parsed.maxLength }
      : { minLength: 7, maxLength: 15 }; // Fallback
  }, [selectedCountry, phoneNumber]);

  const { minLength, maxLength } = getLengthConstraints();

  useEffect(() => {
    if (value && !phoneNumber) {
      let detected = null;

      if (value.startsWith("+")) {
        detected = detectCountryFromNumber(value);
      } else {
        detected = detectCountryFromNumber(value);
      }

      if (detected) {
        setSelectedCountry(detected);
        setPhoneNumber(removeCountryCode(value, detected));
      } else {
        const defaultCountry =
          countries.find(
            (c) => c.code.toUpperCase() === defaultCountryCode.toUpperCase()
          ) ||
          countries[0] ||
          null;
        setSelectedCountry(defaultCountry);
        setPhoneNumber(value);
      }
    }
  }, [
    value,
    detectCountryFromNumber,
    removeCountryCode,
    defaultCountryCode,
    phoneNumber,
  ]);

  useEffect(() => {
    if (!selectedCountry && countries.length > 0) {
      const defaultCountry =
        countries.find(
          (c) => c.code.toUpperCase() === defaultCountryCode.toUpperCase()
        ) || countries[0];
      setSelectedCountry(defaultCountry);
    }
  }, [selectedCountry, defaultCountryCode]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[^\d]/g, "");

      if (!inputValue) {
        setPhoneNumber("");
        const defaultCountry =
          countries.find(
            (c) => c.code.toUpperCase() === defaultCountryCode.toUpperCase()
          ) ||
          countries[0] ||
          null;
        setSelectedCountry(defaultCountry);
        if (onChange) onChange("");
        return;
      }

      setPhoneNumber(inputValue);

      const startsWithPlus = e.target.value.startsWith("+");
      const detectedCountry = detectCountryFromNumber(
        startsWithPlus ? `+${inputValue}` : inputValue
      );

      if (
        detectedCountry &&
        (!selectedCountry || startsWithPlus) &&
        (startsWithPlus || inputValue.length >= 2)
      ) {
        setSelectedCountry(detectedCountry);
        const adjustedNumber = removeCountryCode(inputValue, detectedCountry);
        setPhoneNumber(adjustedNumber);
        if (onChange) onChange(`${detectedCountry.dialCode} ${adjustedNumber}`);
        return;
      }

      if (onChange) {
        const fullNumber = selectedCountry
          ? `${selectedCountry.dialCode} ${inputValue}`
          : inputValue;
        onChange(fullNumber);
      }
    },
    [
      selectedCountry,
      detectCountryFromNumber,
      removeCountryCode,
      onChange,
      defaultCountryCode,
    ]
  );

  const selectCountry = useCallback(
    (country: ICountry) => {
      setSelectedCountry(country);
      setIsDropdownOpen(false);
      setSearchTerm("");

      if (phoneNumber) {
        const newFullNumber = `${country.dialCode} ${phoneNumber}`;
        if (onChange) onChange(newFullNumber);
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [phoneNumber, onChange]
  );

  useEffect(() => {
    if (!isClient) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && !isLoading) {
        setIsDropdownOpen(!isDropdownOpen);
      }
    },
    [isDropdownOpen, disabled, isLoading]
  );

  const getCountryDisplayName = (country: ICountry) =>
    language === "en" ? country.nameEn : country.name;

  return (
    <div style={{ direction: dir }} className="phone-input-container">
      {showLabel && (
        <div className="phone-input-label-container">
          <label htmlFor="phone-input" className="phone-input-label">
            {label}
          </label>
        </div>
      )}

      <div className="phone-input-wrapper" ref={dropdownRef}>
        <div
          className={`phone-input-field ${
            disabled ? "phone-input-disabled" : ""
          }`}
        >
          <button
            type="button"
            className="phone-input-country-button"
            onClick={toggleDropdown}
            disabled={disabled || isLoading}
            aria-expanded={isDropdownOpen}
            aria-controls="country-dropdown"
          >
            <div className="phone-input-country-content">
              {showFlag && selectedCountry && (
                <img
                  src={`https://flagcdn.com/${selectedCountry.code.toLowerCase()}.svg`}
                  alt={`${getCountryDisplayName(selectedCountry)} flag`}
                  className="phone-input-flag"
                  loading="lazy"
                />
              )}
              {showDialCode && selectedCountry && (
                <span className="phone-input-dial-code">
                  {selectedCountry.dialCode}
                </span>
              )}
              <ChevronDown
                className={`phone-input-chevron ${
                  isDropdownOpen ? "phone-input-chevron-open" : ""
                }`}
              />
            </div>
          </button>

          <div className="phone-input-text-container">
            {isLoading ? (
              <div className="phone-input-loading">
                <Loader2 className="phone-input-loader" />
              </div>
            ) : (
              <>
                {icon && (
                  <Phone
                    className={`absolute ${
                      dir === "rtl" ? "left-3" : "right-3"
                    } top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                  />
                )}
                <input
                  id="phone-input"
                  ref={inputRef}
                  type="tel"
                  value={phoneNumber}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className="phone-input-text"
                  dir={dir}
                  disabled={disabled}
                  aria-invalid={!!error}
                  aria-describedby={error ? "phone-error" : undefined}
                  pattern="[0-9]*"
                  minLength={minLength}
                  maxLength={maxLength}
                  inputMode="numeric"
                />
              </>
            )}
          </div>
        </div>

        {isDropdownOpen && (
          <div id="country-dropdown" className="phone-input-dropdown">
            <div className="phone-input-search-container">
              <div className="phone-input-search-wrapper">
                <Search
                  className={`phone-input-search-icon ${
                    dir === "rtl"
                      ? "phone-input-search-icon-rtl"
                      : "phone-input-search-icon-ltr"
                  }`}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "ابحث عن دولة..."
                      : "Search for a country..."
                  }
                  className="phone-input-search"
                  dir={dir}
                />
              </div>
            </div>

            <div className="phone-input-dropdown-list">
              {filteredCountries.length === 0 ? (
                <div className="phone-input-no-results">
                  {language === "ar" ? "لا توجد نتائج" : "No results"}
                </div>
              ) : (
                <Virtuoso
                  data={filteredCountries}
                  itemContent={(_, country) => (
                    <button
                      key={country.code}
                      type="button"
                      className={`phone-input-country-item ${
                        dir === "rtl"
                          ? "phone-input-country-item-rtl"
                          : "phone-input-country-item-ltr"
                      }`}
                      onClick={() => selectCountry(country)}
                    >
                      {showFlag && (
                        <img
                          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                          alt={`${getCountryDisplayName(country)} flag`}
                          className="phone-input-country-flag"
                          loading="lazy"
                        />
                      )}
                      <div className="phone-input-country-name">
                        <div className="phone-input-country-primary">
                          {getCountryDisplayName(country)}
                        </div>
                      </div>
                      {showDialCode && (
                        <span className="phone-input-country-dial">
                          {country.dialCode}
                        </span>
                      )}
                    </button>
                  )}
                />
              )}
            </div>
          </div>
        )}

        {error && (
          <p id="phone-error" className="phone-input-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;
