import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { dirname } from 'path';

export const write = (path: string, value: string): boolean => {
	try {
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, value);
	} catch (e) {
		console.error(e);
		return false;
	}
	return true;
};

export const reset = (dirname: string): void => {
	if (existsSync(dirname)) {
		rmSync(dirname, { recursive: true });
	}
	mkdirSync(dirname, { recursive: true });
	// Instruction to ignore parent node_modules
	writeFileSync(dirname + '/.env', 'SKIP_PREFLIGHT_CHECK=true');
};
