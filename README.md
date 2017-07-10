# k6-web-recorder

Web recorder for [k6](https://k6.readme.io) load testing tool using chrome.

### Pre requisites
1. Chrome browser.
2. Nodejs version 7.6+ installed . Download from [here](https://nodejs.org/en/download/releases/).
---
## Install
git clone `https://github.com/rupeshmore/k6-web-recorder.git`

or download zip.

go to the directory

```
cd k6-web-recorder
```

```
npm install
```

or if `yarn` is installed

```
yarn
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
1. `url`: This is required value for the app. This can be defined in here or passed as arguments via command line.

2. `recordThinkTime`: This will record think time between requests. Think Time greater than 3 seconds are only recorded. If `false` it will not capture think Time.

3. `assignRequestToVariable`: This will save the http requests to a variable.

  Example:
  `assignRequestToVariable = true`

  ```
  let req = http.get(https://github.com/rupeshmore);
```

  `assignRequestToVariable = false`
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

- Records Think Time for the script.

- Options to record specific headers in the scripts.

## Note
All requests with `multipart/form-data` is not recorded. As the k6 tool will not be able to playback the same request as a browser does.

## Close Recording
Close the browser to close recording or close the app.
