const localChrome = require('../../../node_modules/testcafe/lib/browser/provider/built-in/chrome');
// const testRunTracker = require('testcafe/lib/api/test-run-tracker');
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const sleep = require('sleep');

// function getBrowserId () {
//     const testRun = testRunTracker.resolveContextTestRun();

//     if (testRun && testRun.browserConnection)
//         return testRun.browserConnection.id;
// }
const knownBrowsers = [];
let lock = 0;
let interval;
let shuttingDown = false;
const outputFormat = 'jpeg';
const quality = 60;
const stats = {};
let savingInProgress = 0;

function enableScreencast (client, browserId) {
    return function () {
        client.Page.screencastFrame( frame =>{
            if (!shuttingDown)
                client.Page.screencastFrameAck({ sessionId: frame.sessionId });
            ++stats[browserId].framesCaptured;
            stats[browserId].start = stats[browserId].start || frame.metadata.timestamp;
            stats[browserId].end = frame.metadata.timestamp;
            ++stats[browserId].framesSaved;
            ++savingInProgress;
            fs.outputFile(`/tmp/chrome-recorder/${browserId}/frame-${frame.metadata.timestamp*1000000}.${outputFormat}`, frame.data, 'base64', function () { // eslint-disable-line
                --savingInProgress;
            });
        });
        client.Page.startScreencast({ format: outputFormat, quality: quality, everyNthFrame: 1 });
    };
}

function disableScreencast (browserId) {
    localChrome.openedBrowsers[browserId].client.Page.stopScreencast();
}

function framesToVideo (browserId) {
    ffmpeg()
    .addInput(`/tmp/chrome-recorder/${browserId}/frame-*.${outputFormat}`)
    .inputOptions('-pattern_type glob')
    .outputFps(Math.ceil(stats[browserId].framesSaved / ( stats[browserId].end - stats[browserId].start )))
    .videoCodec('libx264')
    .on('error', function (err) {
        console.log('An error occurred: ' + err.message);
    })
    .on('end', function () {
        fs.removeSync(`/tmp/chrome-recorder/${browserId}`);
        console.log(`Saved video file to ${process.cwd()}/${browserId}.mp4`);
    })
    .save(`${browserId}.mp4`);
}

export default function () {
    return {
        noColors: true,
        
        reportTaskStart (/* startTime, userAgents, testCount */) {
        },

        reportFixtureStart (/* name, path */) {
            if (!interval) {
                interval = setInterval(function startScreencastForNewBrowsers () {
                    if (lock++ > 0)
                        return;
                    for (const browserId of Object.keys(localChrome.openedBrowsers)) {
                        if (knownBrowsers.includes(browserId))
                            continue;
                        console.log(`New browser session ${browserId}`);
                        stats[browserId] = {
                            framesCaptured: 0,
                            framesSaved:    0,
                            start:          0,
                            end:            0
                        };
                        const { client } = localChrome.openedBrowsers[browserId];
                
                        if (client && client.Page) {
                            enableScreencast(client, browserId)();
                            knownBrowsers.push(browserId);
                        }
                    }
                    lock = 0;
                }, 1000);      
            }      
        },

        reportTestDone (/* name, testRunInfo */) {

        },

        reportTaskDone (/* endTime, passed, warnings */) {
            clearInterval(interval);
            const videos = [];

            shuttingDown = true;
            for (const browserId of knownBrowsers)
                disableScreencast(browserId);
            for (let i = 0; savingInProgress && i < 30; i++)
                sleep.sleep(1);
            for (const browserId of knownBrowsers)
                videos.push(framesToVideo(browserId));
            Promise.all(videos).then(function () {
            });
        }
    };
}
