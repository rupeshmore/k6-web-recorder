# k6-web-recorder

Web recorder for [k6](https://k6.readme.io) load testing tool using chrome.

### Pre requisites
1. Chrome browser.
2. Nodejs version 7.6+ installed. Download from [here](https://nodejs.org/en/download/releases/).

  or use [nvm](https://github.com/creationix/nvm) to install and manage multiple node version.

3. yarn (optional). Fast package manager for node.
---

## Install

Make sure you have git installed. Go to command prompt and do
```
git clone https://github.com/rupeshmore/k6-web-recorder.git
```
or download zip.

Go inside the directory

```
cd k6-web-recorder
```

#### Inside the directory

if `yarn` is installed

  ```
yarn
  ```

  or
  ```
npm install
  ```


## Usage
`node app.js --url=https://github.com/rupeshmore`

or

`npm start --url=https://github.com/rupeshmore`

`url` is required parameter. Specify it in command line or in `config.json`;

This will start an instance of chrome.

## Configuration
edit `config.json` to record added data.
```
{
  "url": "https://github.com/rupeshmore",
  "recordThinkTime": true,
  "assignRequestToVariable": false,
  "recordHeaders": [
    "Content-Type"
  ]
}
```
1. `url`: is required for the app. This can be defined in `config.json` or passed as an argument via command line.

2. `recordThinkTime`: This will record think time between requests. Think time greater than 1 seconds are only recorded. If `false` it will not capture think time. Default value `true`.

3. `assignRequestToVariable`: This will assign the http requests to a variable.

  Example:
  `assignRequestToVariable: true`

  ```
  let req = http.get(https://github.com/rupeshmore);
```

  `assignRequestToVariable: false`
  ```
  http.get(https://github.com/rupeshmore);
  ```

4. `recordHeaders`: This is an array of values to be recoded for headers.
  values it can take to match the http headers.
  https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields


## Scripts
All scripts are recorded under the `scripts` folder.

## Features
- Records all http traffic and convert them to k6 load testing tool.

- Filters out the request based on the domain of url to be recorded.

- Records think-time for the script.

- Options to record specific headers in the scripts.

## Note
All requests with `multipart/form-data` are not recorded. As the k6 tool will not be able to playback the same request as a browser does.

## Close Recording
Close the browser to close recording or close the app.
