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
testcafe chrome 'path/to/test/file.js' --reporter spec,chrome-recorder:null
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

## Known issues

This is just a draft so expect many issues :)

1. Performance impact on test execution
2. Frames are a bit out of sync

## Author
Andrzej Pasterczyk 
