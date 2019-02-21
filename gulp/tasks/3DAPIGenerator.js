const fs = require('fs');
const program = require('commander');
const typeDoc = require('gulp-typeDoc');
const del = require('del');
const gulp = require('gulp');
const globby = require('globby');

program
        .version('1.0.0')
        .option('-t, --target <path>', 'Creator engine path')
        .option('-d, --dest <path>', 'Creator typeDoc dir')
        .option('-e, --exclude <paths>', 'TypeDoc config exclude file path', x => x.split(','))
        .parse(process.argv);

function typeDocBuilder () {
    let option = JSON.parse(fs.readFileSync('./typedoc.json', {
        encoding: 'utf8'
    }));
        
    let targetFold = program.target;
    let destFold = program.dest;
    let excludes = program.exclude;

    if (!targetFold) {
        console.error(`${targetFold} is unavailable, please check the target path.`);
        return;
    }

    if (!destFold) {
        console.error(`${destFold} is unavailable, please check the dest path.`);
        return;
    }

    if (!option) {
        console.log("Didn't find typedoc.json in currect dir")
        option = {
            // TypeScript options (see typescript docs)
            module: "commonjs",
            target: "es5",
            includeDeclarations: true,
            // TypeDoc options (see typedoc docs)
            name: "typedoc-test",
            theme: "default",
            ignoreCompilerErrors: false,
            version: true,
            experimentalDecorators: true
        };
    }
    if (excludes && excludes.length > 0) {
        option.exclude = option.exclude.concat(excludes);
    }
    option.out = destFold;
    
    return gulp
            .src(targetFold)
            .pipe(typeDoc(option))
            .on('error', function (msg) {
                if (msg.plugin && msg.message) {
                    console.error(`Error in plugin: ${msg.plugin}`);
                    console.error(msg.__safety.stack);
                }
            });
}

function cleanAPIDoc () {
    let dest = program.dest;
    if (!fs.existsSync(dest)) {
        console.error('API Doc path is unavailable.');
        return;
    }
    // clean fold
    del.sync(`${dest}`, {force: true});
}
// This is a test method
function createModule () {
    // get the gfx fold
    let files = globby.sync('./cocos/gfx/**/*', {
        nodir: true
    });
    let str = 'export module gfx { \n';

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let result = fs.readFileSync(file, {
            encoding: 'utf8'
        });
        str += result.match(/export (.|\s)*/g);
    }
    str += '}\n';

    let testPath = './cocos/gfx.d.ts';
    if (fs.existsSync(testPath)) {
        del.sync(testPath, {force: true});
    }

    fs.writeFileSync(testPath, str, {
        encoding: 'utf8'
    });
}

module.exports = {
    builder: typeDocBuilder,
    cleanAPIDoc: cleanAPIDoc,
    createGFXModule: createModule
}