import * as core from '@actions/core';
import tablemark from 'tablemark';

async function run(): Promise<void> {
  try {
    const json: string = core.getInput('json');
    core.debug(`Received json string ${json}...`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    const jsonArray = JSON.parse(json);
    core.debug(`Parsed json string...`);

    if (!Array.isArray(jsonArray)) {
      return core.setFailed('Input json is not an array.');
    }

    const table = tablemark(jsonArray);

    core.debug(`Table: ${table}`);
    core.setOutput('table', table);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
