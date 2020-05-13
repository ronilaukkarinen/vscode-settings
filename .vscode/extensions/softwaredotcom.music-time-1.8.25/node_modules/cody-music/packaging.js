#!/usr/bin/env node
const { exec } = require("child_process");

// copy the scripts data to dist/scripts
async function packageScripts() {
    await runCommand(
        "mkdir dist/lib/scripts",
        "creating the dist/lib/scripts directory if it doesn't exist"
    );
    await runCommand(
        "cp lib/scripts/* dist/lib/scripts/.",
        "copy the contents of scripts to dist/sripts"
    );
}

async function runCommand(
    cmd,
    execMsg,
    goToDirAfterExec = null,
    allowError = true
) {
    var execResult = await wrapExecPromise(cmd);
    if (goToDirAfterExec && goToDirAfterExec.length > 0) {
        cd(goToDirAfterExec);
    }

    allowError =
        allowError !== undefined && allowError !== null ? allowError : false;

    if (execResult && execResult.code !== 0 && !allowError) {
        /* error happened */
        debug(
            "Failed to " +
                execMsg +
                ", code: " +
                execResult.code +
                ", reason: " +
                execResult.stderr
        );
        process.exit(1);
    } else {
        debug("Completed task to " + execMsg + ".");
    }
}

async function wrapExecPromise(cmd, dir) {
    let result = null;
    try {
        let opts = dir !== undefined && dir !== null ? { cwd: dir } : {};
        result = await execPromise(cmd, opts);
    } catch (e) {
        result = null;
    }
    return result;
}

function execPromise(command, opts) {
    return new Promise(function(resolve, reject) {
        exec(command, opts, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(stdout.trim());
        });
    });
}

function debug(message) {
    console.log("#### " + message);
}

packageScripts();
