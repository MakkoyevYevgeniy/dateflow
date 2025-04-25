# DateFlow

A flexible and powerful date manipulation library for JavaScript and TypeScript, designed with immutability and a clear API.

## Key Concepts

*   **Immutability:** All manipulation methods (`add`, `subtract`, `startOf`, `endOf`) return a *new* `DateFlow` instance, leaving the original instance unchanged. This prevents side effects and makes state management predictable.
*   **Locale Awareness:** Formatting can leverage the `Intl.DateTimeFormat` API when a `locale` is provided (either during construction or in the `format` method). This provides basic internationalization for date representation.
*   **Timezone Handling:**
    *   When a `locale` is used for formatting, the library attempts to map the locale to a common IANA timezone (e.g., `en-US` -> `America/New_York`). This mapping is basic and not exhaustive.
    *   Manipulation methods (`add`, `subtract`) include logic to adjust for potential Daylight Saving Time (DST) shifts when a locale is set, aiming to preserve the intended local time across transitions.
    *   For precise timezone control beyond the basic locale mapping, consider handling timezone conversions externally or using the standard `toISOString()` and `valueOf()` methods which operate in UTC or based on timestamps.

## Installation

```bash
npm install dateflow
# or
yarn add dateflow
```

## Usage Examples

```typescript
import { DateFlow, DateFormatType, LocaleType } from 'dateflow';

// --- Instantiation ---

// Current date and time
const now = new DateFlow();

// From various inputs
const fromString = new DateFlow({ date: '2024-08-15T10:30:00.123Z' });
const fromTimestamp = new DateFlow({ date: 1678886400000 }); // ms since epoch
const fromDateObject = new DateFlow({ date: new Date(2025, 0, 1, 12) }); // Jan 1, 2025, 12:00 local

// With defaults for formatting and locale
const italianChristmas = new DateFlow({
  date: '2024-12-25',
  dateFormat: 'DD/MM/YYYY', // Default format for this instance
  locale: 'it-IT'          // Default locale for this instance
});

// --- Accessors (Getters) ---
console.log(`Year: ${now.year}, Month: ${now.month}, Day: ${now.day}`);
// Example Output (assuming today is 2025-04-25): Year: 2025, Month: 4, Day: 25

// --- Immutability & Manipulation ---
const tomorrow = now.add(1, 'day');
const nextMonthSameDay = now.add(1, 'month');
const startOfLastYear = now.subtract(1, 'year').startOf('year');

console.log('Now:', now.format('YYYY-MM-DD')); // e.g., 2025-04-25
console.log('Tomorrow:', tomorrow.format('YYYY-MM-DD')); // e.g., 2025-04-26
console.log('Start of Last Year:', startOfLastYear.format('YYYY-MM-DD HH:mm:ss')); // e.g., 2024-01-01 00:00:00

// Chaining (possible due to immutability)
const complexDate = now.add(3, 'month').subtract(5, 'day').endOf('day');
console.log('Complex Date:', complexDate.format('YYYY-MM-DD HH:mm:ss.SSS')); // e.g., 2025-07-20 23:59:59.999

// --- Formatting ---
// ISO 8601 (UTC) - Always reliable
console.log('ISO:', now.toISOString()); // e.g., 2025-04-25TXX:XX:XX.XXXZ

// Default format (falls back to ISO if no locale/dateFormat set)
console.log('Default:', now.format()); // e.g., 2025-04-25TXX:XX:XX.XXXZ

// Using instance defaults (dateFormat and locale)
console.log('Italian Christmas:', italianChristmas.format()); // Output: 25/12/2024

// Overriding format and locale
console.log('US Format:', now.format({ dateFormat: 'YYYY-MM-DD HH:mm', locale: 'en-US' })); // e.g., 2025-04-25 10:00 (Time depends on NY time)
console.log('Specific Format:', now.format('DD-MM-YYYY')); // e.g., 25-04-2025

// --- Comparison ---
const dateA = new DateFlow({ date: '2024-01-01T00:00:00.000Z' });
const dateB = new DateFlow({ date: '2024-01-01T12:00:00.000Z' });
const dateC = new DateFlow({ date: '2024-01-15T00:00:00.000Z' });

console.log('A before C?', dateA.isBefore(dateC));   // Output: true
console.log('C after B?', dateC.isAfter(dateB));     // Output: true
console.log('A equals B (strict)?', dateA.equal(dateB, 'strict')); // Output: false
console.log('A equals B (short)?', dateA.equal(dateB, 'short'));   // Output: true (same day)

// --- Difference ---
const startDate = new DateFlow({ date: '2024-02-10' });
const endDate = new DateFlow({ date: '2024-04-05' });

console.log('Days between:', endDate.diff(startDate, 'day'));     // Output: 55
console.log('Months between:', endDate.diff(startDate, 'month')); // Output: 2 (April - February)

// --- Utilities ---
const original = new DateFlow();
const clone = original.clone();
const timestamp = original.valueOf(); // Milliseconds since epoch

console.log('Is clone same object?', original === clone); // Output: false
console.log('Is clone equal value?', original.equal(clone)); // Output: true
console.log('Timestamp:', timestamp); // e.g., 1745565600000
```

## API Reference

### `DateFlow` Class

#### Constructor

`new DateFlow(options?: { date?: Date | number | string, dateFormat?: DateFormatType, locale?: LocaleType })`

Initializes a new immutable `DateFlow` instance.

*   `options.date`: The initial date/time. Accepts `Date` objects, millisecond timestamps, or parseable date strings (ISO 8601 format recommended for strings). Defaults to `new Date()`.
*   `options.dateFormat`: A `DateFormatType` string used as the default format when `format()` is called without arguments on this instance (and no `locale` is specified).
*   `options.locale`: A `LocaleType` string (e.g., 'en-US', 'fr-FR'). Enables locale-aware formatting via `Intl.DateTimeFormat` and influences timezone/DST adjustments in manipulation methods.

#### Getters

Provide direct access to date components based on the instance's internal date value.

*   `day: number`: Day of the month (1-31).
*   `month: number`: Month of the year (1-12).
*   `year: number`: Full year (e.g., 2024).
*   `hour: number`: Hour (0-23).
*   `minute: number`: Minute (0-59).
*   `second: number`: Second (0-59).
*   `millisecond: number`: Millisecond (0-999).

#### Manipulation Methods

These methods return a *new* `DateFlow` instance and do not modify the original.

*   `add(amount: number, unit: UnitType): DateFlow`: Returns a new instance with the specified amount of time added.
*   `subtract(amount: number, unit: UnitType): DateFlow`: Returns a new instance with the specified amount of time subtracted.
*   `startOf(unit: UnitType): DateFlow`: Returns a new instance set to the beginning of the specified unit (e.g., 'day' sets time to 00:00:00.000).
*   `endOf(unit: UnitType): DateFlow`: Returns a new instance set to the end of the specified unit (e.g., 'day' sets time to 23:59:59.999).

#### Query Methods

*   `isBefore(date: Date | DateFlow): boolean`: Checks if the instance's time is strictly before the specified date.
*   `isAfter(date: Date | DateFlow): boolean`: Checks if the instance's time is strictly after the specified date.
*   `equal(date: Date | DateFlow, mode: 'short' | 'strict' = 'strict'): boolean`: Checks for equality. 'strict' compares timestamps; 'short' compares only year, month, and day.
*   `diff(otherDate: Date | DateFlow, unit: UnitType): number`: Calculates the difference between the instance and `otherDate` in the specified `unit`. Note: 'month' and 'year' differences are calendar-based.

#### Formatting & Utility Methods

*   `format(): string`
*   `format(dateFormat: DateFormatType): string`
*   `format(options: { dateFormat?: DateFormatType, locale?: LocaleType }): string`: Formats the date. Uses provided options, instance defaults (`dateFormat`, `locale`), or falls back to `toISOString()`. Locale-aware formatting uses `Intl.DateTimeFormat`. Non-locale formatting uses manual string replacement based on `DateFormatType`.
*   `clone(): DateFlow`: Returns a new `DateFlow` instance with the same date value and configuration.
*   `valueOf(): number`: Returns the number of milliseconds since the Unix Epoch (UTC). Useful for numeric comparisons.
*   `toISOString(): string`: Returns the date as an ISO 8601 string in UTC (e.g., "2023-10-27T10:30:00.000Z").

## Limitations

*   **Timezone Mapping:** The internal mapping from `LocaleType` to IANA timezones in `getTimeZoneFromLocale` is basic and covers only common cases. For precise timezone control, manage timezones externally or rely on UTC/timestamps.
*   **Formatting Tokens:** The manual `format()` logic (used when no `locale` is specified) only supports the specific tokens defined in `DateFormatType` (`YYYY`, `MM`, `DD`, `HH`, `mm`, `ss`). It does not support more complex tokens found in libraries like Moment.js or date-fns.
*   **Week Definition:** `startOf('week')` and `endOf('week')` assume the week starts on Sunday (like JavaScript's `Date.getDay()`). This may not align with all locale conventions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.