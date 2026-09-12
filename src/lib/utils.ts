/**
 * One date format for the whole site: "Jun 7, 2025".
 *
 * Parsed as UTC on purpose. `new Date("2025-06-07")` is midnight UTC, so
 * formatting it in a timezone behind UTC renders the previous day — which is
 * why the build machine and a US reader could disagree about a post's date.
 */
const displayDateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
});

export function formatDisplayDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    if (!year || !month || !day) return date;
    return displayDateFormatter.format(new Date(Date.UTC(year, month - 1, day)));
}

/**
 * "Jul 14" — the same format as above with the year dropped, for lists that
 * are already grouped under a year heading.
 */
const monthDayFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
});

export function formatMonthDay(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    if (!year || !month || !day) return date;
    return monthDayFormatter.format(new Date(Date.UTC(year, month - 1, day)));
}
