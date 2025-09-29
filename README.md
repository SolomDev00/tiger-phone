# tiger-phone

A smart, performant React component for phone number input with automatic country detection, dropdown selection, search, and virtualization. Supports RTL/LTR directions, multiple languages, and extensive customization.

[![NPM Version](https://img.shields.io/npm/v/tiger-phone)](https://www.npmjs.com/package/tiger-phone)
[![License](https://img.shields.io/npm/l/tiger-phone)](https://github.com/SolomDev00/tiger-phone/blob/main/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/SolomDev00/tiger-phone)](https://github.com/SolomDev00/tiger-phone/issues)

## Features

- **Auto Country Detection**: Automatically detects the country based on phone number prefixes or dial codes.
- **Customizable**: Control label, placeholder, icon, direction, language, flag, and dial code visibility.
- **High Performance**: Uses `virtuoso` for virtualized country lists and debounced search for efficiency.
- **Accessible**: Supports disabled and loading states with clear error messaging.
- **Internationalization**: Supports Arabic and English for country names and UI text.
- **Flags**: High-quality SVG flags from [FlagCDN](https://flagcdn.com).
- **Phone Number Utilities**: Parse and format phone numbers with `parsePhoneNumber`, `isValid`, `formatInternational`, `formatNational`, `formatE164`, and `getCountryCode`.
- **TypeScript Support**: Fully typed with interfaces for props and country data.

## Installation

Install the package via npm:

```bash
npm install tiger-phone
```

Place the styles in the main css file, for example `index.css`:

```css
.phone-input-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.phone-input-label-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  width: 100%;
}

.phone-input-label {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
}

.phone-input-wrapper {
  position: relative;
}

.phone-input-field {
  display: flex;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.phone-input-field:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.phone-input-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.phone-input-country-button {
  flex-shrink: 0;
  border-right: 1px solid #d1d5db;
  background-color: #f9fafb;
  cursor: pointer;
  transition: background-color 0.2s;
  outline: none;
}

.phone-input-country-button:hover {
  background-color: #f3f4f6;
}

.phone-input-country-button:focus {
  background-color: #f3f4f6;
}

.phone-input-country-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  min-width: 75px;
}

.phone-input-flag {
  width: 28px;
  height: auto;
}

.phone-input-dial-code {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.phone-input-chevron {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.3s;
}

.phone-input-chevron-open {
  transform: rotate(180deg);
}

.phone-input-text-container {
  flex: 1;
  position: relative;
}

.phone-input-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.phone-input-loader {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  color: #6b7280;
}

.phone-input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.phone-input-icon-ltr {
  right: 12px;
}

.phone-input-icon-rtl {
  left: 12px;
}

.phone-input-text {
  width: 100%;
  padding: 12px;
  padding-left: 15px;
  padding-right: 40px;
  border: none;
  outline: none;
  color: #111827;
  font-size: 14px;
}

.phone-input-text[dir="rtl"] {
  padding-left: 40px;
  padding-right: 15px;
}

.phone-input-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  z-index: 50;
  margin-top: 4px;
}

.phone-input-search-container {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.phone-input-search-wrapper {
  position: relative;
}

.phone-input-search-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.phone-input-search-icon-ltr {
  right: 12px;
}

.phone-input-search-icon-rtl {
  left: 12px;
}

.phone-input-search {
  width: 100%;
  padding: 8px;
  padding-left: 15px;
  padding-right: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.phone-input-search:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.phone-input-search[dir="rtl"] {
  padding-left: 40px;
  padding-right: 15px;
}

.phone-input-dropdown-list {
  height: 256px;
}

.phone-input-no-results {
  padding: 16px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.phone-input-country-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.phone-input-country-item:hover {
  background-color: #f3f4f6;
}

.phone-input-country-item-ltr {
  text-align: left;
}

.phone-input-country-item-rtl {
  text-align: right;
}

.phone-input-country-flag {
  width: 28px;
  height: 20px;
  flex-shrink: 0;
}

.phone-input-country-name {
  flex: 1;
  min-width: 0;
}

.phone-input-country-primary {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.phone-input-country-dial {
  font-size: 14px;
  color: #4b5563;
  flex-shrink: 0;
}

.phone-input-error {
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

For TypeScript users, ensure you have `@types/react` installed:

```bash
npm install --save-dev @types/react
```

## Usage

### Basic Example

A simple phone input with default settings:

```tsx
import React, { useState } from "react";
import { PhoneInput } from "tiger-phone";

const App = () => {
  const [value, setValue] = useState("");

  return (
    <PhoneInput
      value={value}
      onChange={setValue}
      label="Phone Number"
      placeholder="Enter phone number"
      defaultCountryCode="US"
      language="en"
      dir="ltr"
    />
  );
};

export default App;
```

### Customized Example

A customized phone input with RTL direction, Arabic language, and a custom icon:

```tsx
import React, { useState } from "react";
import { PhoneInput } from "tiger-phone";

const App = () => {
  const [value, setValue] = useState("+966501234567");
  const [error, setError] = useState("");

  return (
    <PhoneInput
      value={value}
      onChange={(val) => {
        setValue(val);
        setError("");
      }}
      error={error}
      label="Phone Number"
      placeholder="Enter your phone number"
      defaultCountryCode="SA"
      showLabel={true}
      showFlag={false}
      showDialCode={true}
      dir="rtl"
      language="ar"
      disabled={false}
      isLoading={false}
      icon={true}
    />
  );
};

export default App;
```

### Demo Example

A complete demo with error handling and form submission:

```tsx
import React, { useState, useCallback } from "react";
import { PhoneInput } from "tiger-phone";

const App = () => {
  const [phoneValue, setPhoneValue] = useState("+966501234567");
  const [error, setError] = useState("");

  const handlePhoneChange = useCallback(
    (value: string) => {
      setPhoneValue(value);
      if (error) setError("");
    },
    [error]
  );

  const handleSubmit = useCallback(() => {
    if (!phoneValue.trim()) {
      setError("Phone number is required");
      return;
    }
    alert(`Phone number saved: ${phoneValue}`);
  }, [phoneValue]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Smart Phone Input Demo
      </h1>
      <div className="space-y-6">
        <PhoneInput
          value={phoneValue}
          onChange={handlePhoneChange}
          error={error}
          label="Phone Number"
          placeholder="Enter your phone number"
          defaultCountryCode="SA"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Save Number
        </button>
        {phoneValue && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Value:</p>
            <p className="font-mono text-sm text-gray-800">{phoneValue}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
```

## Utility Functions

The `tiger-phone` library provides robust utility functions for parsing, validating, and formatting phone numbers. These functions are lightweight, TypeScript-friendly, and highly accurate, They validate phone numbers against country-specific prefixes and length rules.

### Available Functions

| Function              | Parameters                              | Return Type           | Description                                                                                                          |
| --------------------- | --------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `parsePhoneNumber`    | `input: string, defaultCountry: string` | `PhoneNumber \| null` | Parses a phone number and returns a `PhoneNumber` object with validation and formatting methods.                     |
| `isValid`             | None                                    | `boolean`             | Checks if the parsed phone number matches the country-specific prefixes and length (called on `PhoneNumber` object). |
| `formatInternational` | None                                    | `string`              | Returns the phone number in international format (e.g., `+201014348488`).                                            |
| `formatNational`      | None                                    | `string`              | Returns the phone number in national format (e.g., `01014348488`).                                                   |
| `formatE164`          | None                                    | `string`              | Returns the phone number in E.164 standard format (e.g., `+201014348488`).                                           |
| `getCountryCode`      | None                                    | `string`              | Returns the ISO country code (e.g., `EG`).                                                                           |

### The `PhoneNumber` Object

The `parsePhoneNumber` function returns a `PhoneNumber` object with the following properties and methods:

- **Properties**:

  - `countryCode: string` - ISO country code (e.g., `"EG"`).
  - `nationalNumber: string` - National phone number (e.g., `"01014348488"`).
  - `dialCode: string` - Dial code (e.g., `"+20"`).
  - `error?: string` - Error message if the number is invalid (e.g., `"Invalid phone number length for Egypt: expected 10 digits"`).

- **Methods**:
  - `isValid(): boolean` - Validates the phone number against the country's prefixes and length rules.
  - `formatInternational(): string` - Formats the number with the dial code (e.g., `+201014348488`).
  - `formatNational(): string` - Formats the number without the dial code (e.g., `01014348488`).
  - `formatE164(): string` - Formats the number in E.164 standard (e.g., `+201014348488`).
  - `getCountryCode(): string` - Returns the ISO country code (e.g., `"EG"`).

### Example Usage

#### Basic Phone Number Parsing

```tsx
import { parsePhoneNumber } from "tiger-phone";

const App = () => {
  const phone = parsePhoneNumber("01014348488", "EG");

  if (phone && phone.isValid()) {
    console.log("Valid:", phone.isValid()); // true
    console.log("International:", phone.formatInternational()); // "+201014348488"
    console.log("National:", phone.formatNational()); // "01014348488"
    console.log("E.164:", phone.formatE164()); // "+201014348488"
    console.log("Country Code:", phone.getCountryCode()); // "EG"
    console.log("Dial Code:", phone.dialCode); // "+20"
  } else {
    console.log("Error:", phone?.error || "Invalid phone number");
  }

  return <div>Check console for parsed phone number details</div>;
};

export default App;
```

#### Handling Different Input Formats

The `parsePhoneNumber` function supports various input formats (e.g., with spaces, dashes, or dial codes):

```tsx
import { parsePhoneNumber } from "tiger-phone";

const App = () => {
  const inputs = [
    "01014348488",
    "+201014348488",
    "010-1434-8488",
    "+20 101 434 8488",
    "501234567", // Invalid for Egypt
  ];

  return (
    <div>
      {inputs.map((input, index) => {
        const phone = parsePhoneNumber(input, "EG");
        return (
          <div key={index}>
            <p>Input: {input}</p>
            <p>Valid: {phone?.isValid() ? "Yes" : "No"}</p>
            <p>International: {phone?.formatInternational() || "N/A"}</p>
            <p>E.164: {phone?.formatE164() || "N/A"}</p>
            <p>Country Code: {phone?.getCountryCode() || "N/A"}</p>
            {phone?.error && <p>Error: {phone.error}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default App;
```

#### Integration with PhoneInput

Combine `parsePhoneNumber` with `<PhoneInput />` for real-time validation and formatting:

```tsx
import React, { useState } from "react";
import { PhoneInput, parsePhoneNumber } from "tiger-phone";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (val: string) => {
    setValue(val);
    const phone = parsePhoneNumber(val, "EG");
    setError(phone?.error || (phone?.isValid() ? "" : "Invalid phone number"));
  };

  return (
    <div>
      <PhoneInput
        value={value}
        onChange={handleChange}
        error={error}
        defaultCountryCode="EG"
        label="Phone Number"
        placeholder="Enter your phone number"
      />
      {value && (
        <div>
          <p>
            International:{" "}
            {parsePhoneNumber(value, "EG")?.formatInternational() || "N/A"}
          </p>
          <p>
            National: {parsePhoneNumber(value, "EG")?.formatNational() || "N/A"}
          </p>
          <p>E.164: {parsePhoneNumber(value, "EG")?.formatE164() || "N/A"}</p>
          <p>
            Country Code:{" "}
            {parsePhoneNumber(value, "EG")?.getCountryCode() || "N/A"}
          </p>
          <p>
            Valid: {parsePhoneNumber(value, "EG")?.isValid() ? "Yes" : "No"}
          </p>
          {error && <p>Error: {error}</p>}
        </div>
      )}
    </div>
  );
};

export default App;
```

## Props

| Prop                 | Type                      | Default                | Description                                      |
| -------------------- | ------------------------- | ---------------------- | ------------------------------------------------ |
| `value`              | `string`                  | `undefined`            | Current phone number value.                      |
| `onChange`           | `(value: string) => void` | `undefined`            | Callback for value changes.                      |
| `error`              | `string`                  | `undefined`            | Error message to display.                        |
| `label`              | `string`                  | `"Phone Number"`       | Label text.                                      |
| `placeholder`        | `string`                  | `"Enter phone number"` | Placeholder text.                                |
| `defaultCountryCode` | `string`                  | `"EG"`                 | Default country ISO code (e.g., `"US"`, `"SA"`). |
| `showLabel`          | `boolean`                 | `true`                 | Show/hide label.                                 |
| `showFlag`           | `boolean`                 | `true`                 | Show/hide country flag.                          |
| `showDialCode`       | `boolean`                 | `true`                 | Show/hide dial code.                             |
| `dir`                | `'ltr' \| 'rtl'`          | `"ltr"`                | Text direction.                                  |
| `language`           | `'ar' \| 'en'`            | `"ar"`                 | Language for country names and UI.               |
| `disabled`           | `boolean`                 | `false`                | Disable input and dropdown.                      |
| `isLoading`          | `boolean`                 | `false`                | Show loading spinner.                            |
| `icon`               | `boolean`                 | `true`                 | Icon for the input field.                        |

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the project's coding standards and includes tests.

## License

[MIT](https://github.com/SolomDev00/tiger-phone/blob/main/LICENSE)

## Contact

For questions or feedback, open an issue on [GitHub](https://github.com/SolomDev00/tiger-phone/issues) or contact [SolomDev00](mailto:solomdev0@gmail.com).
