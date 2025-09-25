import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { ChevronDown, Phone, Search, Loader2 } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { countries } from "./data/countries";

const isClient = typeof window !== "undefined";

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

interface ICountry {
  code: string;
  name: string;
  nameEn: string;
  dialCode: string;
  flag: string;
  prefixes: string[];
}

/**
 * Tiger Phone Input component with auto country detection.
 *
 * @param {PhoneInputProps} props - The props for the PhoneInput component.
 * @param {string} [props.value] - The current value of the phone input.
 * @param {(value: string) => void} [props.onChange] - Callback function when the value changes.
 * @param {string} [props.error] - Error message to display.
 * @param {string} [props.label="PhoneNumber"] - Label text.
 * @param {string} [props.placeholder="PhoneNumber"] - Placeholder text.
 * @param {string} [props.defaultCountryCode="EG"] - Default country code.
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
  label = "Phonenumber",
  placeholder = "Enter your Phonenumber ...",
  defaultCountryCode = "EG",
  showLabel = true,
  showFlag = true,
  showDialCode = true,
  dir = "ltr",
  language = "ar",
  disabled = false,
  isLoading = false,
  icon = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(
    countries.find(
      (c) => c.code.toUpperCase() === defaultCountryCode.toUpperCase()
    ) || countries[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

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

  const detectCountryFromNumber = useCallback((number: string) => {
    const cleanNumber = number.replace(/[^\d]/g, "");

    for (const country of countries) {
      const dialCodeDigits = country.dialCode.replace("+", "");
      if (cleanNumber.startsWith(dialCodeDigits)) {
        return country;
      }
    }

    if (cleanNumber.length >= 2) {
      const prefix2 = cleanNumber.substring(0, 2);
      const prefix3 =
        cleanNumber.length >= 3 ? cleanNumber.substring(0, 3) : null;

      for (const country of countries) {
        if (
          country.prefixes &&
          (country.prefixes.indexOf(prefix2) !== -1 ||
            (prefix3 && country.prefixes.indexOf(prefix3) !== -1))
        ) {
          return country;
        }
      }
    }

    return null;
  }, []);

  const removeCountryCode = useCallback((number: string, country: ICountry) => {
    if (!country || !number) return number;

    const cleanNumber = number.replace(/[^\d]/g, "");
    const dialCodeDigits = country.dialCode.replace("+", "");

    if (cleanNumber.startsWith(dialCodeDigits)) {
      return cleanNumber.substring(dialCodeDigits.length);
    }

    return number;
  }, []);

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
          countries.find((c) => c.code === defaultCountryCode.toLowerCase()) ||
          countries[0];
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
    if (!selectedCountry) {
      const defaultCountry =
        countries.find((c) => c.code === defaultCountryCode.toLowerCase()) ||
        countries[0];
      setSelectedCountry(defaultCountry);
    }
  }, [selectedCountry, defaultCountryCode]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[^\d]/g, "");

      if (!inputValue) {
        setPhoneNumber("");
        const defaultCountry =
          countries.find((c) => c.code === defaultCountryCode.toLowerCase()) ||
          countries[0];
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

      if (
        inputRef.current &&
        typeof (inputRef.current as HTMLInputElement).focus === "function"
      ) {
        (inputRef.current as HTMLInputElement).focus();
      }
    },
    [phoneNumber, onChange]
  );

  useEffect(() => {
    if (!isClient) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLInputElement).contains(
          event.target as Node
        )
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
    <div className="flex flex-col gap-1" dir={dir}>
      {showLabel && (
        <div className="w-full flex items-center justify-between px-2">
          <label
            htmlFor="phone-input"
            className="text-black/85 font-medium text-base"
          >
            {label}
          </label>
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <div
          className={`flex w-full border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <button
            type="button"
            className="flex-shrink-0 border-r cursor-pointer transition-colors focus:outline-none"
            onClick={toggleDropdown}
            disabled={disabled || isLoading}
            aria-expanded={isDropdownOpen}
            aria-controls="country-dropdown"
          >
            <div className="flex items-center gap-2 px-3 py-3 min-w-[75px]">
              {showFlag && selectedCountry && (
                <img
                  src={`https://flagcdn.com/${selectedCountry.code.toLowerCase()}.svg`}
                  alt={`${getCountryDisplayName(selectedCountry)} flag`}
                  className="w-7 h-auto"
                  loading="lazy"
                />
              )}
              {showDialCode && selectedCountry && (
                <span className="text-sm font-medium text-gray-700">
                  {selectedCountry.dialCode}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          <div className="flex-1 relative">
            {isLoading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
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
                  ref={inputRef}
                  type="tel"
                  value={phoneNumber}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className={`w-full py-3 border-none outline-none text-gray-900`}
                  dir={dir}
                  style={{
                    paddingLeft: dir === "rtl" ? "0px" : "15px",
                    paddingRight: "0px",
                  }}
                  disabled={disabled}
                  aria-invalid={!!error}
                  aria-describedby={error ? "phone-error" : undefined}
                />
              </>
            )}
          </div>
        </div>

        {isDropdownOpen && (
          <div
            id="country-dropdown"
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1"
          >
            <div className="p-3 border-b">
              <div className="relative">
                <Search
                  className={`absolute ${
                    dir === "rtl" ? "left-3" : "right-3"
                  } top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "ابحث عن دولة..."
                      : "Search for the country"
                  }
                  className={`w-full py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                  dir={dir}
                  style={{
                    paddingLeft: dir === "rtl" ? "40px" : "15px",
                    paddingRight: dir === "rtl" ? "15px" : "40px",
                  }}
                />
              </div>
            </div>

            <div className="h-64">
              {filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {language === "ar"
                    ? "لا توجد نتائج"
                    : "There are no results."}
                </div>
              ) : (
                <Virtuoso
                  data={filteredCountries}
                  itemContent={(_, country) => (
                    <button
                      key={country.code}
                      type="button"
                      className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                        dir === "rtl" ? "text-right" : "text-left"
                      }`}
                      onClick={() => selectCountry(country)}
                    >
                      {showFlag && (
                        <img
                          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                          alt={`${getCountryDisplayName(country)} flag`}
                          className="w-7 h-5 flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {getCountryDisplayName(country)}
                        </div>
                      </div>
                      {showDialCode && (
                        <span className="text-sm text-gray-600 flex-shrink-0">
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
          <p id="phone-error" className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;
