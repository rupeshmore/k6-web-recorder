const chalk = require('chalk');

function checkConfig(config) {
  if (!config.url) {
    console.log(
      chalk.red.bold('`url` is required for k6-web-recorder'),'\n',
      chalk.green('usage:'),'\n  ',
      chalk.cyan(`node app.js --url=https://github.com/rupeshmore/k6-web-recorder`),'\n  ',
      chalk.cyan('node app.js (define `url` and other options in `config.json`)')
    );
    return null;
  }

  if(config.recordThinkTime !== undefined && typeof config.recordThinkTime !== 'boolean') {
    console.log(
      chalk.red.bold('`recordThinkTime` in config.json can take only `true` or false'),'\n'
    );
    return null;
  }

  if(config.assignRequestToVariable !== undefined && typeof config.assignRequestToVariable !== 'boolean') {
    console.log(
      chalk.red.bold('`assignRequestToVariable` in config.json can take only `true` or false'),'\n'
    );
    return null;
  }

  if(config.recordHeaders == null || (config.recordHeaders !== undefined && config.recordHeaders.constructor !== Array)) {
    console.log(
      chalk.red.bold('`recordHeaders` in config.json must be an array'),'\n'
    );
    return null;
  }
  return true;
}

module.exports = checkConfig;
