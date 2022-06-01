const ps = require('path');
const fs = require('fs');
const gulp = require('gulp');
const babelify = require("babelify");
const browserify = require('browserify');
const source = require("vinyl-source-stream");
const buffer = require('vinyl-buffer');
const chalk = require('chalk').default;
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const engineRoot = ps.join(__dirname, '..');

(async function bundleAdapter () {
    try {
        console.time('Bundle Adapter');
        await bundleJsbAdapter();
        await bundleMinigameAdapter();
        await bundleRuntimeAdapter();
        console.timeEnd('Bundle Adapter');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

async function bundleJsbAdapter () {
    console.log(chalk.green('\nBundling jsb adapter'));
    // bundle jsb-engine.js
    const jsbEngineEntry = normalizePath(ps.join(engineRoot, 'platforms/native/engine/index.js'));
    const jsbEngineOutput = normalizePath(ps.join(engineRoot, 'bin/adapter/native/jsb-engine.js'));
    await bundle(jsbEngineEntry, jsbEngineOutput);

    // bundle jsb-engine.js
    const jsbBuiltinEntry = normalizePath(ps.join(engineRoot, 'platforms/native/builtin/index.js'));
    const jsbBuiltinOutput = normalizePath(ps.join(engineRoot, 'bin/adapter/native/jsb-builtin.js'));
    await bundle(jsbBuiltinEntry, jsbBuiltinOutput);
}

async function bundleMinigameAdapter () {
    const platformsPath = ps.join(engineRoot, 'platforms/minigame/platforms');
    const platforms = fs.readdirSync(platformsPath);
    console.log(chalk.green(`\nBundling minigame platform adapters, including: ${platforms}`));

    for (let platform of platforms) {
        console.log(`handle platform: ${chalk.green(platform)}`);
        // bundle engine-adapter.js
        const engineEntry = normalizePath(ps.join(engineRoot, `platforms/minigame/platforms/${platform}/wrapper/engine/index.js`));
        const engineOutput = normalizePath(ps.join(engineRoot, `bin/adapter/minigame/${platform}/engine-adapter.js`));
        await bundle(engineEntry, engineOutput);

        // bundle builtin.js
        let builtinEntry = normalizePath(ps.join(engineRoot, `platforms/minigame/platforms/${platform}/wrapper/builtin/index.js`));
        if (platform === 'alipay' || platform === 'xiaomi') {
            builtinEntry = normalizePath(ps.join(engineRoot, `platforms/minigame/platforms/${platform}/wrapper/builtin.js`));
        }
        const builtinOutput = normalizePath(ps.join(engineRoot, `bin/adapter/minigame/${platform}/builtin.js`));
        await bundle(builtinEntry, builtinOutput);
    }
}

async function bundleRuntimeAdapter () {
    const platformsPath = ps.join(engineRoot, 'platforms/runtime/platforms');
    const platforms = fs.readdirSync(platformsPath);
    console.log(chalk.green(`\nBundling runtime platform adapters, including: ${platforms}`));
    for (let platform of platforms) {
        console.log(`handle platform: ${chalk.green(platform)}`);
        // bundle engine-adapter.js
        const engineEntry = normalizePath(ps.join(engineRoot, `platforms/runtime/platforms/${platform}/engine/index.js`));
        const engineOutput = normalizePath(ps.join(engineRoot, `bin/adapter/runtime/${platform}/engine-adapter.js`));
        await bundle(engineEntry, engineOutput);
    }
}


function normalizePath (path) {
    return path.replace(/\\/g, '/');
}

/**
 * Traverse and compare the modification time of source code and target file
 * @param {string} dir 
 * @param {string} targetFileMtime 
 */
function checkFileStat (dir, targetFileMtime) {
    let files = fs.readdirSync(dir);
    return files.some (file => {
        let filePath = ps.join(dir, file);
        let stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            return checkFileStat(filePath, targetFileMtime);
        }
        else if (stat.mtime.getTime() > targetFileMtime) {
            return true;
        }
    });
}

/**
 * Check whether the source code is updated
 * @param {string} src 
 * @param {string} dst 
 */
function hasChanged (src, dst) {
    if (!fs.existsSync(dst)) {
        return true;
    }
    let stat = fs.statSync(dst);
    let dir = ps.dirname(src);
    return checkFileStat(dir, stat.mtime.getTime());
}

/**
 * Create bundle task
 * @param {string} src 
 * @param {string} dst 
 * @param {boolean} uglify 
 */
function createBundleTask (src, dst) {
    let targetFileName = ps.basename(dst);
    let targetFileNameMin = ps.basename(targetFileName, '.js') + '.min.js';
    dst = ps.dirname(dst);
    let bundler =  browserify(src);
    return bundler.transform(babelify, {presets: [require('@babel/preset-env')],
        plugins: [
            require('@babel/plugin-proposal-class-properties'),
            require('@babel/plugin-proposal-export-default-from')
        ]})
        .bundle()
        .pipe(source(targetFileName))
        .pipe(buffer())
        .pipe(gulp.dest(dst))
        .pipe(rename(targetFileNameMin)).pipe(uglify()).pipe(gulp.dest(dst));
}

/**
 * Build adapters
 * @param {string} entry 
 * @param {string} output 
 */
async function bundle (entry, output) {
    await new Promise((resolve) => {
        console.log(`Generate bundle: ${chalk.green(ps.basename(output))}`);
        // if (!hasChanged(entry, output)) {
        //     console.log(chalk.yellow('Use bundle cache, skip bundling'));
        //     resolve();
        //     return;
        // }
        createBundleTask(entry, output).on('end', resolve);
    });
}
