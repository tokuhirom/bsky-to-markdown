import { describe, it, expect, vi } from 'vitest';
import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { run, parseFile } from '../src/main';

vi.mock('@actions/core');

describe('Greet Action', () => {
	it('should greet the user', async () => {
		process.env['INPUT_RSS_URL'] = 'https://blog.64p.org/feed';

		const setOutputMock = vi.spyOn(core, 'setOutput');

		// Create a new temporary directory for testing
		const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rss-entries-test-'));
		process.env['INPUT_FILE_TEMPLATE'] = path.join(tempDir, 'logs/%Y%m/%Y%m%d.md');

		await run();

		// expect(setOutputMock).toHaveBeenCalledWith('time', expect.any(String));

		// Clean up the temporary directory after the test
		fs.rmdirSync(tempDir, { recursive: true });
	});
});
