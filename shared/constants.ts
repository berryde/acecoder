/**
 * The firebase region
 */
export const REGION = 'europe-west2';

/**
 * An error code for when a firebase functions precondition fails
 */
export const FAILED_PRECONDITION = 'failed-precondition';

/**
 * An error to show when a firebase function is called without authentication
 */
export const REQUIRE_AUTH = 'The function must be called while authenticated.';

/**
 * The default tab size to use
 */
export const EDITOR_TAB_SIZE = 2;

/**
 * The default font size to use
 */
export const EDITOR_FONT_SIZE = '1rem';

/**
 * Submission messages to show while a submission is pending
 */
export const SUBMISSION_MESSAGES = [
	'🛰️ Contacting the server',
	'💾 Downloading submission',
	'🗄️ Installing dependencies',
	'🧪 Running tests',
	'📝 Parsing results',
	'🧮 Returning scores',
	'🧹 Tidying up',
	'🏁 Finalising submission',
	'⏲️ Listening for results'
];

/**
 * Languages supported by the application
 */
export const LANGUAGES: string[] = ['react', 'svelte'];

/**
 * LinkedIn organisation ID for certificates
 */
export const ORGANISATION_ID = 79117149;

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
