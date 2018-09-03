/* eslint-disable no-unused-expressions */
const localChrome = require('../../../node_modules/testcafe/lib/browser/provider/built-in/chrome');
// const testRunTracker = require('testcafe/lib/api/test-run-tracker');
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const interval = require('interval-promise');

// function getBrowserId () {
//     const testRun = testRunTracker.resolveContextTestRun();

//     if (testRun && testRun.browserConnection)
//         return testRun.browserConnection.id;
// }
const knownBrowsers = [];

async function enableScreencast (client, browserId) {
    return async function () {
        let counter = 100000000;

        client.Page.screencastFrame( frame =>{
            const { data, sessionId } = frame;

            fs.outputFile(`logs/screenshots/${browserId}/${counter++}.png`, data, 'base64', function () {
            //   if (err) {
            //     console.error(err);
            //   }        
            });
            client.Page.screencastFrameAck({ sessionId: sessionId });
        });
        await client.Page.startScreencast({ format: 'png', everyNthFrame: 24 });
    };
}

export default function () {
    return {
        noColors: true,
        
        reportTaskStart (/* startTime, userAgents, testCount */) {
            interval(async function startScreencastForNewBrowsers () {
                for (const browserId of Object.keys(localChrome.openedBrowsers)) {
                    if (knownBrowsers.includes(browserId))
                        continue;
                    const { client } = localChrome.openedBrowsers[browserId];
            
                    if (client && client.Page) {
                        await enableScreencast(client, browserId)();
                        knownBrowsers.push(browserId);
                    }
                }
            }, 500);
        },

        reportFixtureStart (/* name, path */) {
        },

        reportTestDone (/* name, testRunInfo */) {
            ffmpeg()
                .addInput('/path/to/frame%02d.png');
        },

        reportTaskDone (/* endTime, passed, warnings */) {
        }
    };
}
