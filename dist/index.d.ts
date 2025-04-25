export type DateFormatType = 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH' | 'YYYY-MM-DD' | 'YYYY/MM/DD HH:mm:ss' | 'YYYY/MM/DD HH:mm' | 'YYYY/MM/DD HH' | 'YYYY/MM/DD' | 'DD/MM/YYYY HH:mm:ss' | 'DD/MM/YYYY HH:mm' | 'DD/MM/YYYY HH' | 'DD/MM/YYYY' | 'DD-MM-YYYY HH:mm:ss' | 'DD-MM-YYYY HH:mm' | 'DD-MM-YYYY HH' | 'DD-MM-YYYY';
export type UnitType = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export type LocaleType = 'it-IT' | 'en-EN' | 'fr-FR' | 'en-US' | 'es-ES' | 'de-DE' | 'pt-BR' | 'ja-JP' | 'zh-CN' | 'ru-RU';
export declare class DateFlow {
    private readonly _date;
    private readonly _dateFormat;
    private readonly _locale;
    /**
     * Initializes a new DateFlow instance.
     * @param {object} [options={}] - Configuration options.
     * @param {Date|number|string} [options.date=new Date()] - Initial date value. Defaults to now.
     * @param {DateFormatType} [options.dateFormat] - Default format string.
     * @param {LocaleType} [options.locale] - Default locale identifier.
     * @throws {Error} If the provided date value is invalid.
     */
    constructor({ date, dateFormat, locale, }?: {
        date?: Date | number | string;
        dateFormat?: DateFormatType;
        locale?: LocaleType;
    });
    /**
     * Gets the day of the month (1-31).
     * @returns {number} The day.
     */
    get day(): number;
    /**
     * Gets the month of the year (1-12).
     * @returns {number} The month (1 for January, 12 for December).
     */
    get month(): number;
    /**
     * Gets the full year (e.g., 2024).
     * @returns {number} The year.
     */
    get year(): number;
    /**
     * Gets the hour of the day (0-23).
     * @returns {number} The hour.
     */
    get hour(): number;
    /**
     * Gets the minute of the hour (0-59).
     * @returns {number} The minute.
     */
    get minute(): number;
    /**
     * Gets the second of the minute (0-59).
     * @returns {number} The second.
     */
    get second(): number;
    /**
     * Gets the millisecond of the second (0-999).
     * @returns {number} The millisecond.
     */
    get millisecond(): number;
    /**
     * Returns a new DateFlow instance with the specified amount of time added.
     * @param {number} amount - The quantity of the unit to add.
     * @param {UnitType} unit - The unit of time to add.
     * @returns {DateFlow} A new DateFlow instance representing the resulting date.
     */
    add(amount: number, unit: UnitType): DateFlow;
    /**
     * Returns a new DateFlow instance with the specified amount of time subtracted.
     * @param {number} amount - The quantity of the unit to subtract.
     * @param {UnitType} unit - The unit of time to subtract.
     * @returns {DateFlow} A new DateFlow instance representing the resulting date.
     */
    subtract(amount: number, unit: UnitType): DateFlow;
    /**
     * Private helper to modify the date by a given amount and unit.
     * Handles date calculations and timezone adjustments.
     * @param {number} amount - The amount to add (can be negative).
     * @param {UnitType} unit - The unit of time.
     * @returns {DateFlow} A new DateFlow instance with the modified date.
     */
    private _modifyDate;
    /**
     * Formats the date instance into a string.
     * @param {DateFormatType | { dateFormat?: DateFormatType, locale?: LocaleType }} [param] - Optional formatting string or options object.
     * @returns {string} The formatted date string.
     */
    format(): string;
    format(dateFormat: DateFormatType): string;
    format(options: {
        dateFormat?: DateFormatType;
        locale?: LocaleType;
    }): string;
    /**
     * Maps a known locale identifier to a corresponding IANA time zone string.
     * @param {LocaleType} locale - The locale identifier.
     * @returns {string} The mapped IANA time zone string or a default.
     */
    private getTimeZoneFromLocale;
    /**
     * Private helper to get the timestamp from a Date or DateFlow instance.
     * @param {Date | DateFlow} date - The input date.
     * @returns {number} The timestamp in milliseconds.
     */
    private _getOtherTime;
    /**
     * Determines if the current instance represents a moment before the specified date.
     * @param {Date|DateFlow} date - The date to compare against.
     * @returns {boolean} True if the instance's date is strictly earlier.
     */
    isBefore(date: Date | DateFlow): boolean;
    /**
     * Determines if the current instance represents a moment after the specified date.
     * @param {Date|DateFlow} date - The date to compare against.
     * @returns {boolean} True if the instance's date is strictly later.
     */
    isAfter(date: Date | DateFlow): boolean;
    /**
     * Compares this instance with another date for equality.
     * @param {Date|DateFlow} date - The date to compare against.
     * @param {'short'|'strict'} [mode='strict'] - Comparison mode ('strict' or 'short').
     * @returns {boolean} True if the dates are considered equal based on the mode.
     */
    equal(date: Date | DateFlow, mode?: 'short' | 'strict'): boolean;
    /**
     * Calculates the difference between this instance and another date.
     * @param {Date|DateFlow} otherDate - The date to calculate the difference from.
     * @param {UnitType} unit - The unit for the difference calculation.
     * @returns {number} The difference in the specified unit.
     */
    diff(otherDate: Date | DateFlow, unit: UnitType): number;
    /**
     * Returns a new instance set to the beginning of the specified unit of time.
     * @param {UnitType} unit - The unit to set the start of.
     * @returns {DateFlow} A new DateFlow instance representing the start of the unit.
     */
    startOf(unit: UnitType): DateFlow;
    /**
     * Returns a new instance set to the end of the specified unit of time.
     * @param {UnitType} unit - The unit to set the end of.
     * @returns {DateFlow} A new DateFlow instance representing the end of the unit.
     */
    endOf(unit: UnitType): DateFlow;
    /**
     * Creates a new instance with the same date value and configuration.
     * @returns {DateFlow} A distinct DateFlow instance representing the same moment.
     */
    clone(): DateFlow;
    /**
     * Returns the primitive value (timestamp) of the date instance.
     * @returns {number} Milliseconds since the Unix Epoch.
     */
    valueOf(): number;
    /**
     * Returns the date formatted as an ISO 8601 string in UTC.
     * @returns {string} The ISO 8601 formatted string.
     */
    toISOString(): string;
}
