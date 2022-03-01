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
	console.log(`Received submission for exercise ${projectID}[${exerciseID}] from ${uid}`);
	const dir = 'submissions/' + uid;

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
			execSync(
				`cd ${dir} && echo "Installing dependencies" && pnpm install --prefer-offline --silent && echo "Running tests" && pnpm --silent test -- --json --outputFile=testresults.json --maxWorkers=50% --silent --watchAll=false`,
				{ stdio: 'inherit' }
			);
		} catch (err) {
			// execSync throws if any tests failed so this error should be caught and ingored
		}

		// Check if the test results have been created successfully
		if (!existsSync(`${dir}/testresults.json`)) {
			return {
				status: 500,
				message: 'Could not generate test results'
			};
		}

		// Parse the tests results
		console.log('Parsing results');

		const json = JSON.parse(readFileSync(`${dir}/testresults.json`).toString()) as JestResult;

		// Construct the output
		const results: {
			passed: boolean;
			spec: string;
		}[] = [];

		json.testResults.forEach((tr) => {
			tr.assertionResults.forEach((ar) => {
				results.push({
					spec: ar.fullName,
					passed: ar.status == 'passed'
				});
			});
		});

		const mappedResults: Record<
			number,
			{
				passed: boolean;
				spec: string;
			}
		> = {};

		console.log('Returning results');

		for (let i = 0; i <= Math.min(chapter, results.length - 1); i++) {
			mappedResults[i] = results[i];
		}

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
