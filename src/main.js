const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const nameToGreet = core.getInput('who-to-greet');
    const time = new Date().toTimeString();
    console.log(`Hello ${nameToGreet}! The current time is ${time}.`);

    // Set outputs for use in subsequent steps
    core.setOutput('time', time);

    // Access GitHub context (e.g., event payload)
    const payload = JSON.stringify(github.context.payload, null, 2);
    console.log(`Event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
