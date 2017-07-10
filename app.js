/** Pre requisites
1) Nodejs version 7+ installed
2) Use yarn to install dependencies:
  `yarn`
  or use npm if you do not have yarn
  `npm install`

 * USAGE:
 * `node app.js --url=https://github.com/rupeshmore/k6-web-recorder`
 * `node app.js` (setup config.json)
 */

/* Dependencies */
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

/** ARGUMENTS AND CONFIGUIRATION
 * expects arguments to be
 * --url string (url)
 */
const argv = require('minimist')(process.argv.slice(2));

const config = require('./config.json');

const checkConfig = require('./lib/checkConfig');

const url = argv.url || config.url;

if (!config.url) {
  config.url = url;
}

if(!checkConfig(config)) return null;

const {logInit, logRequestObject} = require('./lib/logger');
let {ribbon, analytics, gaInit} = require('./lib/addons');
// to add additional chrome flags.
const launchConfig = {
  logLevel: 'error',
  chromeFlags: [
      //add chrome config,
  ]
}

/**
 * Launches a debugging instance of Chrome.
 *     False launches a full version of Chrome.
 * @return {Promise<ChromeLauncher>}
 */
async function launchChrome(headless = true) {
  return await chromeLauncher.launch(launchConfig);
}

/**
 * Starts chrome.
 *  connects to the chrome instance.
 *  launches page with the url.
 */
(async function k6WebRecorder(url) {
  const chrome = await launchChrome();
  const protocol = await CDP({port: chrome.port});
  const {Page, Network, Runtime} = protocol;

  Network.requestWillBeSent((params) => {
    logRequestObject(params.request, url);
  });

  await Promise.all([Page.enable(), Network.enable(), Runtime.enable()]);
  logInit();
  Page.navigate({url});
  Page.domContentEventFired(async () => {
    let expression = ribbon;
    if (!gaInit) {
      gaInit = true;
      expression += analytics;
    }
    await Runtime.evaluate({expression});
  });
})(url);
