import * as core from '@actions/core';
import tablemark from 'tablemark';
import { readFileSync, existsSync } from 'fs';

async function run(): Promise<void> {
  try {
    const json: string = core.getInput('json');
    const jsonFilePath: string = core.getInput('json_file_path');
    let jsonArray: any[] = [];

    core.debug(`json: ${json}`);
    core.debug(`json_file_path: ${jsonFilePath}`);

    // check if json or json_file_path is provided
    if (!json && !jsonFilePath) {
      return core.setFailed('Input json or json_file_path is required. If both are provided, json_file_path will be used.');
    }

    if (jsonFilePath) {
      core.debug(`Received json file path ${jsonFilePath}...`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

      if (!existsSync(jsonFilePath)) {
        return core.setFailed(`File ${jsonFilePath} not found.`);
      } else {
        const jsonFile = readFileSync(jsonFilePath, 'utf8');
        core.debug(`Read json file ${jsonFilePath}...`);
        jsonArray = JSON.parse(jsonFile);
        core.debug(`Parsed json file from ${jsonFilePath}...`);
      }
    }

    if (!jsonFilePath && json) {
      core.debug(`Received json string ${json}...`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

      jsonArray = JSON.parse(json);
      core.debug(`Parsed json string...`);
    }


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
