# testcafe-reporter-chrome-recorder
[![Build Status](https://travis-ci.org/swiniak/testcafe-reporter-chrome-recorder.svg)](https://travis-ci.org/swiniak/testcafe-reporter-chrome-recorder)

This is the **chrome-recorder** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).
Its purpose is to record video of the test run in Chrome browser (including headless mode).

Note that it has severe performance impact so it's not recommended to run in concurrent mode.

## Install

Install `ffmpeg` and make sure it's available in `PATH`

```
npm install testcafe-reporter-chrome-recorder
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter spec,chrome-recorder:/dev/null
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('chrome-recorder') // <-
    .run();
```

### Options

Environmental variables that allow you to change reporter behaviour:

* `CHROME_RECORDER_TMP_DIR`\
Temporary directory where images with single frames will be stored. They will be removed after the conversion to mp4.\
Default: `/tmp/chrome-recorder`
* `CHROME_RECORDER_OUTPUT_DIR`\
Output directory for video file\
Default: `process.cwd()`
* `CHROME_RECORDER_FRAME_FORMAT`\
Output format for captured frames. Either `jpeg` or `png`.
Default: `jpeg`

## Known issues

This is just a draft so expect many issues :)

1. Performance impact on test execution
2. Frames are a bit out of sync

## Author
Andrzej Pasterczyk 
