import test from 'ava';

//require testable components;
const fs = require('fs');
const qs = require('qs');
const getDomain = require('./lib/getDomain');
const {logInit, logRequestObject, calculateThinkTime} = require('./lib/logger');

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
   end = new Date().getTime();
  }
}

let thinkStartTime, thinkEndTime;

test('#qs parse querystring to object', t => {
	let postData = 'a=b&c=d&e=f';
	let expected = { "a": "b", "c": "d", "e": "f"};
	let result = qs.parse(postData);
	t.deepEqual(result, expected);
});

test('#qs parse object to object', t => {
	let postData = { "a": "b", "c": "d", "e": "f"};
	let expected = { "a": "b", "c": "d", "e": "f"};
	let result = qs.parse(postData);
	t.deepEqual(result, expected);
});

test('#getDomain extracts domain from url', t => {
	let testDomain = 'http://todomvc.com';
	let expected = 'todomvc.com';
	let result = getDomain(testDomain);
	t.deepEqual(result, expected);
});

test('#getDomain extracts domain from complex url', t => {
	let testDomain = 'https://assets-images.todomvc.com';
	let expected = 'todomvc.com';
	let result = getDomain(testDomain);
	t.deepEqual(result, expected);
});


test('#logInit creates a directory if does not exits', t => {
	let folderName = 'newFolder';
	logInit(folderName);
  fs.readdirSync(folderName).forEach(file => {
    t.regex(file, /^k6-web-recorder_/);
  });
	deleteFolderRecursive(folderName);
});

test('#logInit writes to existing folder is exists', t => {
  let folderName = 'existingFolder';
  fs.mkdirSync(folderName);
  logInit(folderName);
  fs.readdirSync(folderName).forEach(file => {
    t.regex(file, /^k6-web-recorder_/);
  });
  deleteFolderRecursive(folderName);
});

test('#calculateThinkTime return the nearest rounded delayed time between calls', async t => {
  // this is required to initialise the start thinktime.
  let getTime = await calculateThinkTime();
  wait(1800);
  let newTime = await calculateThinkTime();
  t.is(newTime, 2);
});

test('#skip headers for multipart/form-data', t => {
  let req = { headers: {'Content-Type': 'multipart/form-data'}};
  let ignoreContentType = 'multipart/form-data'; // TODO
  let ignoreRequest = req.headers && 'Content-Type' in req.headers && req.headers['Content-Type'].includes(ignoreContentType);
  if (!ignoreRequest) {
    t.fail();
  } else {
    t.pass();
  }
});
