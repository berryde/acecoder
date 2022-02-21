/**
 * Convert the first character of s to upper case.
 *
 * @param s The string to capitalise
 * @returns A capitalised version of s
 */
export const capitalise = (s: string): string => {
	if (s.length == 1) return s.toUpperCase();
	return s[0].toUpperCase() + s.slice(1);
};

/**
 * Thrown when the current user object from firebase auth is not defined.
 */
export const ERR_NO_AUTH = 'You need to be logged in to perform that action';

/**
 * The months of the year
 */
const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

/**
 * Get the word representation of a month of the year from its index.
 */
export const getMonthString = (month: number): string => {
	if (month < 0 || month > 11) throw new Error('Month index must be between 0 and 11');
	return MONTHS[month];
};
