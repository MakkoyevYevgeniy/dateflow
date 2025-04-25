"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFlow = void 0;
class DateFlow {
    /**
     * Initializes a new DateFlow instance.
     * @param {object} [options={}] - Configuration options.
     * @param {Date|number|string} [options.date=new Date()] - Initial date value. Defaults to now.
     * @param {DateFormatType} [options.dateFormat] - Default format string.
     * @param {LocaleType} [options.locale] - Default locale identifier.
     * @throws {Error} If the provided date value is invalid.
     */
    constructor({ date = new Date(), dateFormat, locale, } = {}) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date provided");
        }
        this._date = date;
        this._locale = locale;
        this._dateFormat = dateFormat;
    }
    // --- Getters ---
    /**
     * Gets the day of the month (1-31).
     * @returns {number} The day.
     */
    get day() {
        return this._date.getDate();
    }
    /**
     * Gets the month of the year (1-12).
     * @returns {number} The month (1 for January, 12 for December).
     */
    get month() {
        return this._date.getMonth() + 1;
    }
    /**
     * Gets the full year (e.g., 2024).
     * @returns {number} The year.
     */
    get year() {
        return this._date.getFullYear();
    }
    /**
     * Gets the hour of the day (0-23).
     * @returns {number} The hour.
     */
    get hour() {
        return this._date.getHours();
    }
    /**
     * Gets the minute of the hour (0-59).
     * @returns {number} The minute.
     */
    get minute() {
        return this._date.getMinutes();
    }
    /**
     * Gets the second of the minute (0-59).
     * @returns {number} The second.
     */
    get second() {
        return this._date.getSeconds();
    }
    /**
     * Gets the millisecond of the second (0-999).
     * @returns {number} The millisecond.
     */
    get millisecond() {
        return this._date.getMilliseconds();
    }
    /**
     * Returns a new DateFlow instance with the specified amount of time added.
     * @param {number} amount - The quantity of the unit to add.
     * @param {UnitType} unit - The unit of time to add.
     * @returns {DateFlow} A new DateFlow instance representing the resulting date.
     */
    add(amount, unit) {
        return this._modifyDate(amount, unit);
    }
    /**
     * Returns a new DateFlow instance with the specified amount of time subtracted.
     * @param {number} amount - The quantity of the unit to subtract.
     * @param {UnitType} unit - The unit of time to subtract.
     * @returns {DateFlow} A new DateFlow instance representing the resulting date.
     */
    subtract(amount, unit) {
        // Pass negative amount to the modifier
        return this._modifyDate(-amount, unit);
    }
    /**
     * Private helper to modify the date by a given amount and unit.
     * Handles date calculations and timezone adjustments.
     * @param {number} amount - The amount to add (can be negative).
     * @param {UnitType} unit - The unit of time.
     * @returns {DateFlow} A new DateFlow instance with the modified date.
     */
    _modifyDate(amount, unit) {
        const newDate = new Date(this._date);
        switch (unit) {
            case 'year':
                newDate.setFullYear(newDate.getFullYear() + amount);
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + amount);
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + (amount * 7));
                break;
            case 'day':
                newDate.setDate(newDate.getDate() + amount);
                break;
            case 'hour':
                newDate.setHours(newDate.getHours() + amount);
                break;
            case 'minute':
                newDate.setMinutes(newDate.getMinutes() + amount);
                break;
            case 'second':
                newDate.setSeconds(newDate.getSeconds() + amount);
                break;
            case 'millisecond':
                newDate.setMilliseconds(newDate.getMilliseconds() + amount);
                break;
        }
        // Adjust for potential DST changes if locale implies timezone handling
        if (this._locale) {
            const originalOffset = this._date.getTimezoneOffset();
            const newOffset = newDate.getTimezoneOffset();
            if (originalOffset !== newOffset) {
                const diffMinutes = newOffset - originalOffset;
                newDate.setMinutes(newDate.getMinutes() - diffMinutes);
            }
        }
        return new DateFlow({ date: newDate, dateFormat: this._dateFormat, locale: this._locale });
    }
    format(param) {
        let dateFormat;
        let locale;
        if (typeof param === 'string') {
            dateFormat = param;
        }
        else if (typeof param === 'object' && param !== null) {
            dateFormat = param.dateFormat;
            locale = param.locale;
        }
        // Prioritize provided params, then instance defaults
        dateFormat = dateFormat || this._dateFormat;
        const effectiveLocale = locale || this._locale;
        // Use Intl.DateTimeFormat if a locale is involved
        if (effectiveLocale) {
            const options = {
                timeZone: this.getTimeZoneFromLocale(effectiveLocale)
            };
            // Attempt to map DateFormatType to Intl options if provided
            if (dateFormat) {
                options.year = 'numeric';
                // Basic mapping based on common patterns in DateFormatType
                options.month = dateFormat.includes('/') ? 'numeric' : '2-digit';
                options.day = dateFormat.includes('/') ? 'numeric' : '2-digit';
                if (dateFormat.includes('HH:mm:ss')) {
                    options.hour = 'numeric';
                    options.minute = 'numeric';
                    options.second = 'numeric';
                    options.hour12 = false;
                }
                else if (dateFormat.includes('HH:mm')) {
                    options.hour = 'numeric';
                    options.minute = 'numeric';
                    options.hour12 = false;
                }
                else if (dateFormat.includes('HH')) {
                    options.hour = 'numeric';
                    options.hour12 = false;
                }
            }
            else {
                // Default Intl options if no specific format string but locale is present
                options.year = 'numeric';
                options.month = '2-digit';
                options.day = '2-digit';
                options.hour = 'numeric';
                options.minute = 'numeric';
                options.second = 'numeric';
                options.hour12 = false;
            }
            const formatter = new Intl.DateTimeFormat(effectiveLocale, options);
            return formatter.format(this._date);
        }
        // Fallback to manual formatting or ISO string if no locale
        if (!dateFormat) {
            return this._date.toISOString();
        }
        // Manual string replacement based on DateFormatType tokens
        const year = this.year.toString();
        const month = this.month.toString().padStart(2, '0');
        const day = this.day.toString().padStart(2, '0');
        const hour = this.hour.toString().padStart(2, '0');
        const minute = this.minute.toString().padStart(2, '0');
        const second = this.second.toString().padStart(2, '0');
        let result = dateFormat;
        result = result.replace('YYYY', year);
        result = result.replace('MM', month);
        result = result.replace('DD', day);
        // Only replace time parts if they exist in the format string
        if (result.includes('HH')) {
            result = result.replace('HH', hour);
        }
        if (result.includes('mm')) {
            result = result.replace('mm', minute);
        }
        if (result.includes('ss')) {
            result = result.replace('ss', second);
        }
        return result;
    }
    /**
     * Maps a known locale identifier to a corresponding IANA time zone string.
     * @param {LocaleType} locale - The locale identifier.
     * @returns {string} The mapped IANA time zone string or a default.
     */
    getTimeZoneFromLocale(locale) {
        switch (locale) {
            case 'it-IT': return 'Europe/Rome';
            case 'fr-FR': return 'Europe/Paris';
            case 'es-ES': return 'Europe/Madrid';
            case 'de-DE': return 'Europe/Berlin';
            case 'pt-BR': return 'America/Sao_Paulo';
            case 'ja-JP': return 'Asia/Tokyo';
            case 'zh-CN': return 'Asia/Shanghai';
            case 'ru-RU': return 'Europe/Moscow';
            case 'en-EN': return 'Europe/London';
            case 'en-US':
            default: return 'America/New_York';
        }
    }
    /**
     * Private helper to get the timestamp from a Date or DateFlow instance.
     * @param {Date | DateFlow} date - The input date.
     * @returns {number} The timestamp in milliseconds.
     */
    _getOtherTime(date) {
        return date instanceof DateFlow ? date._date.getTime() : date.getTime();
    }
    /**
     * Determines if the current instance represents a moment before the specified date.
     * @param {Date|DateFlow} date - The date to compare against.
     * @returns {boolean} True if the instance's date is strictly earlier.
     */
    isBefore(date) {
        return this._date.getTime() < this._getOtherTime(date);
    }
    /**
     * Determines if the current instance represents a moment after the specified date.
     * @param {Date|DateFlow} date - The date to compare against.
     * @returns {boolean} True if the instance's date is strictly later.
     */
    isAfter(date) {
        return this._date.getTime() > this._getOtherTime(date);
    }
    /**
     * Compares this instance with another date for equality.
     * @param {Date|DateFlow} date - The date to compare against.
     * @param {'short'|'strict'} [mode='strict'] - Comparison mode ('strict' or 'short').
     * @returns {boolean} True if the dates are considered equal based on the mode.
     */
    equal(date, mode = 'strict') {
        if (mode === 'strict') {
            return this._date.getTime() === this._getOtherTime(date);
        }
        else {
            // Compare year, month, day
            const thisYear = this.year;
            const thisMonth = this.month;
            const thisDay = this.day;
            let otherYear;
            let otherMonth;
            let otherDay;
            if (date instanceof DateFlow) {
                otherYear = date.year;
                otherMonth = date.month;
                otherDay = date.day;
            }
            else {
                // Extract from native Date object
                otherYear = date.getFullYear();
                otherMonth = date.getMonth() + 1; // Adjust native month index
                otherDay = date.getDate();
            }
            return thisYear === otherYear && thisMonth === otherMonth && thisDay === otherDay;
        }
    }
    /**
     * Calculates the difference between this instance and another date.
     * @param {Date|DateFlow} otherDate - The date to calculate the difference from.
     * @param {UnitType} unit - The unit for the difference calculation.
     * @returns {number} The difference in the specified unit.
     */
    diff(otherDate, unit) {
        const otherTime = otherDate instanceof DateFlow ? otherDate._date.getTime() : otherDate.getTime();
        const thisTime = this._date.getTime();
        const diffMs = thisTime - otherTime;
        switch (unit) {
            case 'millisecond': return diffMs;
            case 'second': return Math.floor(diffMs / 1000);
            case 'minute': return Math.floor(diffMs / (1000 * 60));
            case 'hour': return Math.floor(diffMs / (1000 * 60 * 60));
            case 'day': return Math.floor(diffMs / (1000 * 60 * 60 * 24));
            case 'week': return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
            case 'month':
                // Calendar month difference
                const thisYear = this._date.getFullYear();
                const thisMonth = this._date.getMonth(); // Use 0-indexed for calculation consistency
                const otherInstanceDate = otherDate instanceof DateFlow ? otherDate._date : otherDate;
                const otherYear = otherInstanceDate.getFullYear();
                const otherMonth = otherInstanceDate.getMonth(); // Use 0-indexed for calculation consistency
                return (thisYear - otherYear) * 12 + (thisMonth - otherMonth);
            case 'year':
                // Calendar year difference
                const otherInstanceYearDate = otherDate instanceof DateFlow ? otherDate._date : otherDate;
                return this._date.getFullYear() - otherInstanceYearDate.getFullYear();
            default:
                // Should not happen with UnitType, but return ms as fallback
                return diffMs;
        }
    }
    /**
     * Returns a new instance set to the beginning of the specified unit of time.
     * @param {UnitType} unit - The unit to set the start of.
     * @returns {DateFlow} A new DateFlow instance representing the start of the unit.
     */
    startOf(unit) {
        const newDate = new Date(this._date);
        switch (unit) {
            case 'year':
                newDate.setMonth(0, 1); // Jan 1st
                newDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                newDate.setDate(1);
                newDate.setHours(0, 0, 0, 0);
                break;
            case 'week': // Assumes week starts on Sunday
                const dayOfWeek = newDate.getDay(); // 0 = Sunday
                newDate.setDate(newDate.getDate() - dayOfWeek);
                newDate.setHours(0, 0, 0, 0);
                break;
            case 'day':
                newDate.setHours(0, 0, 0, 0);
                break;
            case 'hour':
                newDate.setMinutes(0, 0, 0);
                break;
            case 'minute':
                newDate.setSeconds(0, 0);
                break;
            case 'second':
                newDate.setMilliseconds(0);
                break;
            // 'millisecond' requires no change
        }
        return new DateFlow({ date: newDate, dateFormat: this._dateFormat, locale: this._locale });
    }
    /**
     * Returns a new instance set to the end of the specified unit of time.
     * @param {UnitType} unit - The unit to set the end of.
     * @returns {DateFlow} A new DateFlow instance representing the end of the unit.
     */
    endOf(unit) {
        const newDate = new Date(this._date);
        switch (unit) {
            case 'year':
                newDate.setMonth(11, 31); // Dec 31st
                newDate.setHours(23, 59, 59, 999);
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + 1, 0); // Go to last day of current month
                newDate.setHours(23, 59, 59, 999);
                break;
            case 'week': // Assumes week ends on Saturday
                const dayOfWeek = newDate.getDay(); // 6 = Saturday
                newDate.setDate(newDate.getDate() + (6 - dayOfWeek));
                newDate.setHours(23, 59, 59, 999);
                break;
            case 'day':
                newDate.setHours(23, 59, 59, 999);
                break;
            case 'hour':
                newDate.setMinutes(59, 59, 999);
                break;
            case 'minute':
                newDate.setSeconds(59, 999);
                break;
            case 'second':
                newDate.setMilliseconds(999);
                break;
            // 'millisecond' requires no change
        }
        return new DateFlow({ date: newDate, dateFormat: this._dateFormat, locale: this._locale });
    }
    /**
     * Creates a new instance with the same date value and configuration.
     * @returns {DateFlow} A distinct DateFlow instance representing the same moment.
     */
    clone() {
        return new DateFlow({
            date: new Date(this._date), // Clone internal date object
            dateFormat: this._dateFormat,
            locale: this._locale
        });
    }
    /**
     * Returns the primitive value (timestamp) of the date instance.
     * @returns {number} Milliseconds since the Unix Epoch.
     */
    valueOf() {
        return this._date.getTime();
    }
    /**
     * Returns the date formatted as an ISO 8601 string in UTC.
     * @returns {string} The ISO 8601 formatted string.
     */
    toISOString() {
        return this._date.toISOString();
    }
}
exports.DateFlow = DateFlow;
