const { spawn, spawnSync } = require('child_process');
const fs = require('fs');

let program = require('commander');
    program
        .version('1.0.0')
        .option('-r --removeTags', 'Select the language tags you want to delete')
        .parse(process.argv);

const mode = 'modules';
const docsName = 'Creator-3d-Docs';
const indexPath = `${process.cwd()}/index.ts`;
const outputPath = {
    json: `${process.cwd()}/docs-3d/tempJson`,
    zh: `${process.cwd()}/docs-3d/zh`,
    en: `${process.cwd()}/docs-3d/en`
}
exports.tempJsonGenerate = function () {
    // typedoc command
    let command = [
        indexPath,
        '--mode',
        mode,
        '--generate-json',
        outputPath.json,
        '--tags',
        '--disableOutputCheck',
        '--ignoreCompilerErrors'
    ];
    let child = spawnSync('typedoc', command, {
        shell: true,
        env: process.env,
    });
    executeTypeDocCommand(child);
}

exports.docsGeneratorZH = function () {
    if (!checkJsonFileExists()) return;
    // typedoc command
    let command = [
        indexPath,
        '--mode',
        mode,
        "--generate-from-json",
        outputPath.json,
        '--out',
        outputPath.zh,
        '--name',
        docsName,
        '--tags',
        '--disableOutputCheck',
        '--ignoreCompilerErrors',
        '--choiceLanguage',
        'zh'
    ];
    let child = spawn('typedoc', command, {
        shell: true,
        env: process.env,
    });
    executeTypeDocCommand(child);
}

exports.docsGeneratorEN = function (done) {
    if (!checkJsonFileExists()) return;
    // typedoc command
    let command = [
        indexPath,
        '--mode',
        mode,
        "--generate-from-json",
        outputPath.json,
        '--out',
        outputPath.en,
        '--name',
        docsName,
        '--tags',
        '--disableOutputCheck',
        '--ignoreCompilerErrors',
        '--choiceLanguage',
        'en'
    ];
    let child = spawn('typedoc', command, {
        shell: true,
        env: process.env,
    });
    executeTypeDocCommand(child);
}

exports.docsGeneratorDefault = function () {
    this.docsGeneratorZH();
    this.docsGeneratorEN();
}

function checkJsonFileExists () {
    let existsSync = fs.accessSync || fs.existsSync;
    try {
        existsSync(outputPath.json)
    }
    catch {
        console.warn(`Rendering is short of the relied file`);
        return false;
    }
    return true;
}

function executeTypeDocCommand (child) {
    // spawnSync
    if (child.output && child.output.length > 0) {
        for(let i = 0; i < child.output.length; i++) {
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
            console.log('Temp File Generate Failed!');
            return;
        }
        console.log('Temp File Generate Success!');
    });
}
