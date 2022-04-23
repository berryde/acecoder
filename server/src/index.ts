import express from 'express';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { setupTests } from './test';
import { ServerRequest, ExerciseResults } from '~shared/types';
import { db, authenticate } from './firebase';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const jsonParser = bodyParser.json();
const port = process.env.PORT || 8080;

type JestResult = {
	numPassedTests: number;
	numTotalTests: number;
	testResults: {
		assertionResults: {
			fullName: string;
			status: 'passed' | 'failed';
			failureMessages: string[];
		}[];
		status: 'passed' | 'failed';
	}[];
};

type ServerError = {
	status: 403 | 404 | 500;
	message: string;
};

// Allow CORS
app.use(cors());

// Handle incoming submission requests
app.post('/api/submit', jsonParser, async (req, res) => {
	res = await authenticate(req, res);
	const { projectID, exerciseID, userID, chapter } = req.body as ServerRequest;
	if (res.statusCode != 200) {
		res.json({
			status: 403,
			message: 'Invalid authentication header'
		});
	} else {
		res.json(await test(projectID, exerciseID, userID, chapter));
	}
});

// Start the server on the provided port
app.listen(port, () => console.log(`Submission server listening on http://localhost:${port}\n`));

/**
 * Runs unit tests on the provided submission
 * @param id The submission ID.
 * @returns once tests have been run on the submission.
 */
const test = async (
	projectID: string,
	exerciseID: string,
	uid: string,
	chapter: number
): Promise<ExerciseResults | ServerError> => {
	const dir = 'submissions/' + uid;
	const outputPath = 'testresults.json';

	// Download the submission
	try {
		await setupTests(projectID, exerciseID, uid, dir);
	} catch (err) {
		console.error(err);
		return {
			status: 500,
			message: 'Unable to download submission'
		};
	}

	try {
		try {
			const navigate = `cd ${dir}`;
			const install = `pnpm install --prefer-offline --silent`;
			const tests =
				`pnpm --silent test -- --json --outputFile=${outputPath}` +
				` --maxWorkers=50% --silent --watchAll=false`;

			execSync(`${navigate} && ${install} && ${tests}`, { stdio: 'inherit' });
		} catch (err) {
			console.log('Some tests have failed');
		}

		// Check if the test results have been created successfully
		if (!existsSync(`${dir}/${outputPath}`)) {
			return {
				status: 500,
				message: 'Could not generate test results'
			};
		}

		// Parse the tests results
		console.log('Parsing results');
		const json = JSON.parse(readFileSync(`${dir}/${outputPath}`).toString()) as JestResult;

		// Construct the output
		const results: {
			passed: boolean;
			spec: string;
		}[] = [];

		// Format the test results
		json.testResults.forEach((tr) => {
			tr.assertionResults.forEach((ar) => {
				results.push({
					spec: ar.fullName,
					passed: ar.status == 'passed'
				});
			});
		});

		// Map the formatted test results to the output structure
		const mappedResults: Record<
			number,
			{
				passed: boolean;
				spec: string;
			}
		> = {};
		for (let i = 0; i <= Math.min(chapter, results.length - 1); i++) {
			mappedResults[i] = results[i];
		}

		// Return the results
		console.log('Returning results');
		const resultsRef = db
			.collection('projects')
			.doc(projectID)
			.collection('exercises')
			.doc(exerciseID)
			.collection('results')
			.doc(uid);
		if ((await resultsRef.get()).exists) {
			await resultsRef.update(mappedResults);
		} else {
			await resultsRef.set(mappedResults);
		}

		return mappedResults;
	} catch (err) {
		console.error(err);
		return {
			status: 500,
			message: 'Failed to run tests due to an error.'
		};
	}
};
