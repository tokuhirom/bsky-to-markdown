import { describe, it, expect, vi } from 'vitest';
import * as core from '@actions/core';
import { run } from '../src/main';

vi.mock('@actions/core');

describe('Greet Action', () => {
  it('should greet the user', async () => {
    process.env['INPUT_WHO-TO-GREET'] = 'TestUser';

    const setOutputMock = vi.spyOn(core, 'setOutput');

    await run();

    expect(setOutputMock).toHaveBeenCalledWith('time', expect.any(String));
  });
});
