# testcafe-reporter-chrome-recorder
[![Build Status](https://travis-ci.org/swiniak/testcafe-reporter-chrome-recorder.svg)](https://travis-ci.org/swiniak/testcafe-reporter-chrome-recorder)

This is the **chrome-recorder** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/swiniak/testcafe-reporter-chrome-recorder/master/media/preview.png" alt="preview" />
</p>

## Install

```
npm install testcafe-reporter-chrome-recorder
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter chrome-recorder
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

## Author
Andrzej Pasterczyk 
