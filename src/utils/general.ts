export const capitalise = (s: string): string => {
	if (s.length == 1) return s.toUpperCase();
	return s[0].toUpperCase() + s.slice(1);
};

export const ERR_NO_AUTH = 'You need to be logged in to perform that action';

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

export const getMonthString = (month: number) => {
	return MONTHS[month]
}