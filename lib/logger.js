const moment = require('moment');

const fs = require('fs');
const qs = require('qs');

const config = require('../config.json');
const getDomain = require('./getDomain');

const recordThinkTime = config.recordThinkTime || false;
const recordHeaders = config.recordHeaders || false;
const assignRequestToVariable = config.assignRequestToVariable || false;

let file;
let wstream;
let thinkStartTime, thinkEndTime;
let counter = 0, count = 0;

let logger = module.exports;

logger.logInit = function (path) {
  let folder = path || './scripts';
  checkDirectorySync(folder);
  file = folder + '/k6-web-recorder_' + moment().format('DD-MM-YYYY_hh-mm-ss') + '.js';
  wstream = fs.createWriteStream(file);
  wstream.write('import http from "k6/http";\n\nexport default function() {};')
}

logger.calculateThinkTime = async function () {
  return new Promise(resolve => {
    if (thinkStartTime !== undefined) {
      thinkEndTime = Date.now();
  		let thinkTime = Math.round((thinkEndTime - thinkStartTime)/1000);

      thinkStartTime = Date.now();
      return resolve(thinkTime);
  	}
  	thinkStartTime = Date.now();
    return resolve(null);
  });
}

logger.logRequestObject = async function (req, url) {
  let hasHeaders;
  let varDeclaration = 'let';

  // TODO make ignoreContentType as array
  let ignoreContentType = 'multipart/form-data';
  let ignoreRequest = req.headers && 'Content-Type' in req.headers && req.headers['Content-Type'].includes(ignoreContentType);

  // filter request based on domain and ignoreContentType
  if(getDomain(req.url) === getDomain(url) && !ignoreRequest) {
    let captureRequest = '';
    counter++;

    let method = req.method.toLowerCase();

    if (assignRequestToVariable) {
      count = counter;
      varDeclaration = 'let';
    }

    if (req.postData) {
      if (count !== counter) {
        count++;
      };
      captureRequest += '' + varDeclaration + ' url_'+ count +' = "'+ req.url + '";\n\t';
      let formData = qs.parse(req.postData);
      let payload = JSON.stringify(formData, undefined, 4).slice(0, -1) + '\t}';
      captureRequest += '' + varDeclaration + ' payload_'+ count +' = ' + payload + ';\n\t';
    }

    if (Object.keys(req.headers).length > 0 && recordHeaders.length > 0) {
      let headers = await filterHeaders(req.headers, recordHeaders);
      if (Object.keys(headers).length ) {
        hasHeaders = true;
      }

      if (hasHeaders) {
        if (count !== counter && !req.postData) count++;
        captureRequest += '' + varDeclaration + ' headers_'+ count +' = ' + JSON.stringify(headers) + ';\n\t';
      }
    };

    if (assignRequestToVariable) {
      captureRequest += 'let res_' + counter + ' = ';
    }

    if (req.postData) { // if the request has no postData
      // if the request has headers matching to the config add them else send the payload only.
      if (hasHeaders) {
        captureRequest += 'http.' + method + '(url_'+ count +', payload_'+ count +', { headers: headers_'+ count +' });';
      } else {
        captureRequest += 'http.' + method + '(url_'+ count +', payload_'+ count +');';
      }
    } else { // if the request has no postData
      // if the request has headers
      if (hasHeaders) {
        captureRequest += 'http.' + method + '("' + req.url + '", {headers: headers_'+ count +'});';
      } else { // if the request has no headers
        captureRequest += 'http.' + method + '("' + req.url + '");';
      }
    }

    const rstream = fs.createReadStream(file);
    let data = '';
    rstream.setEncoding('utf8');
    rstream.on('data', chunk => {
        data+=chunk;
    });
    rstream.on('end', async () => {
        // write only if data.
        if(data) {
          // clear the data and create new write stream;
          if (wstream) {
            wstream = fs.createWriteStream(file);
          }
          data = data.slice(0, -2);
          if (recordThinkTime) {
            let thinkTime = await logger.calculateThinkTime();
            if (thinkTime > 1) {
              data = data + '\n\tsleep(' + thinkTime + ');\n';
            }
          }
          wstream.write(data + '\n\t' + captureRequest + '\n};');
        }
    });
  }
}

async function filterHeaders(mainObject, filterArray) {
  return Object.keys(mainObject)
  .filter(key => filterArray.includes(key))
  .reduce((obj, key) => {
    obj[key] = mainObject[key];
    return obj;
  }, {});
};

function checkDirectorySync(directory) {
  try {
    fs.statSync(directory);
  } catch(e) {
    fs.mkdirSync(directory);
  }
}
