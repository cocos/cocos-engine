const { spawn, spawnSync } = require('child_process');
const fs = require('fs');

let program = require('commander');
program
    .version('1.0.0')
    .option('-i --index <s>', 'Entrance file which is  needed when generating API docs.')
    .option('-j --jsonFiles <s>', 'JSON files that are needed when generating API docs.')
    .option('-r --removeLanguage <s>', 'Select the language you don\'t wants to generate.')
    .option('-o --output <s>', 'API docs output fold')
    .parse(process.argv);

const mode = 'modules';
const docsName = 'Creator-3d-API';

exports.generateJson = function () {
    const index = program.index;
    const output = program.output;

    // typedoc command
    let commands = [
        index,
        '--mode',
        mode,
        '--generate-json',
        output,
        '--tags',
        '--disableOutputCheck',
        '--ignoreCompilerErrors'
    ];
    let child = spawnSync('typedoc', commands, {
        shell: process.platform === 'win32'
    });
    debugOutput(child);
}

exports.generateAPIZH = function (indexPath, jsonFiles, outputPath) {
    if (!checkJsonFileExists(jsonFiles)) return;
    // typedoc command
    let commands = [
        indexPath,
        '--mode',
        mode,
        "--generate-from-json",
        jsonFiles,
        '--out',
        outputPath,
        '--name',
        docsName,
        '--tags',
        '--disableOutputCheck',
        '--ignoreCompilerErrors',
        '--localize',
        'zh'
    ];
    let child = spawn('typedoc', commands, {
        shell: process.platform === 'win32'
    });
    debugOutput(child);
}

exports.generateAPIEN = function (indexPath, jsonFiles, outputPath) {
    if (!checkJsonFileExists(jsonFiles)) return;
    // typedoc command
    let commands = [
        indexPath,
        '--mode',
        mode,
        "--generate-from-json",
        jsonFiles,
        '--out',
        outputPath,
        '--name',
        docsName,
        '--tags',
        '--disableOutputCheck',
        '--ignoreCompilerErrors',
        '--localize',
        'en'
    ];
    let child = spawn('typedoc', commands, {
        shell: process.platform === 'win32'
    });
    debugOutput(child);
}

exports.generateHTML = function () {
    const index = program.index;
    const output = program.output;
    // typedoc command
    let commands = [
        index,
        '--mode',
        mode,
        '--out',
        output,
        '--name',
        docsName,
        '--disableOutputCheck',
        '--ignoreCompilerErrors',
    ];
    let child = spawn('typedoc', commands, {
        shell: process.platform === 'win32'
    });
    debugOutput(child);
}

exports.generateHTMLWithLocalization = function () {
    const index = program.index;
    const output = program.output;
    const jsonFiles = program.jsonFiles;
    const removeLanguage = program.removeLanguage;

    removeLanguage != "zh" && this.generateAPIZH(index, jsonFiles, `${output}/zh`);
    removeLanguage != "en" && this.generateAPIEN(index, jsonFiles, `${output}/en`);
}

function checkJsonFileExists (jsonFils) {
    let existsSync = fs.accessSync || fs.existsSync;
    try {
        existsSync(jsonFils)
    }
    catch (e) {
        console.warn(`Rendering is short of the dependent json files`);
        return false;
    }
    return true;
}

function outputDebug (child) {
    // spawnSync
    if (child.output && child.output.length > 0) {
        for (let i = 0; i < child.output.length; i++) {
            child.output[i] && console.log(child.output[i].toString());
        }
        console.log(`Json Generator Finished!`);
        return;
    }

    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    child.stderr.on('data', function (data) {
        console.error(`${data}`);
    });
    child.on('close', (code) => {
        if (code !== 0) {
            console.log('API Docs Generate Failed!');
            return;
        }
        console.log('API Docs Generate Success!');
    });
}
