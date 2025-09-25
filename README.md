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
- **TypeScript Support**: Fully typed with interfaces for props and country data.

## Installation

Install the package via npm:

```bash
npm install tiger-phone
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
import PhoneInput from "tiger-phone";

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
import { Phone } from "lucide-react";
import PhoneInput from "tiger-phone";

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
import PhoneInput from "tiger-phone";

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
