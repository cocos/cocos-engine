const ps = require('path');
const fs = require('fs');
const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const { magenta, green } = require('chalk');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const prefix = ''.padStart(20, '=');
console.log(magenta(`${prefix} Build adapter ${prefix}`));

const engineRoot = ps.join(__dirname, '..');

(async function bundleAdapter () {
    try {
        console.time('Bundle Adapter');
        await bundleNativeAdapter();
        await bundleMinigameAdapter();
        await bundleRuntimeAdapter();
        console.timeEnd('Bundle Adapter');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}());

function getPlatformsFromPath (path) {
    let platforms = fs.readdirSync(path);
    platforms = platforms.filter((p) => !p.startsWith('.'));
    return platforms;
}

async function bundleNativeAdapter () {
    console.log(green('\nBundling native adapter'));
    // bundle engine-adapter.js
    const engineAdapterEntry = normalizePath(ps.join(engineRoot, 'platforms/native/engine/index.js'));
    const engineAdapterOutput = normalizePath(ps.join(engineRoot, 'bin/adapter/native/engine-adapter.js'));
    await bundle(engineAdapterEntry, engineAdapterOutput, true, 'chrome 80');

    // bundle web-adapter.js
    const webAdapterEntry = normalizePath(ps.join(engineRoot, 'platforms/native/builtin/index.js'));
    const webAdapterOutput = normalizePath(ps.join(engineRoot, 'bin/adapter/native/web-adapter.js'));
    await bundle(webAdapterEntry, webAdapterOutput, true, 'chrome 80');
}

async function bundleMinigameAdapter () {
    const platformsPath = ps.join(engineRoot, 'platforms/minigame/platforms');
    const platforms = getPlatformsFromPath(platformsPath);
    console.log(green(`\nBundling minigame platform adapters, including: ${platforms}`));

    for (const platform of platforms) {
        console.log(`handle platform: ${green(platform)}`);

        const needUglify = (platform !== 'xiaomi');  // uglify conflicts with the webpack tool on xiaomi platform

        // bundle engine-adapter.js
        const engineEntry = normalizePath(ps.join(engineRoot, `platforms/minigame/platforms/${platform}/wrapper/engine/index.js`));
        const engineOutput = normalizePath(ps.join(engineRoot, `bin/adapter/minigame/${platform}/engine-adapter.js`));
        await bundle(engineEntry, engineOutput, needUglify);

        // bundle web-adapter.js
        let builtinEntry = normalizePath(ps.join(engineRoot, `platforms/minigame/platforms/${platform}/wrapper/builtin/index.js`));
        if (platform === 'alipay' || platform === 'xiaomi') {
            builtinEntry = normalizePath(ps.join(engineRoot, `platforms/minigame/platforms/${platform}/wrapper/builtin.js`));
        }
        const builtinOutput = normalizePath(ps.join(engineRoot, `bin/adapter/minigame/${platform}/web-adapter.js`));
        await bundle(builtinEntry, builtinOutput, needUglify);
    }
}

async function bundleRuntimeAdapter () {
    const platformsPath = ps.join(engineRoot, 'platforms/runtime/platforms');
    const platforms = getPlatformsFromPath(platformsPath);
    console.log(green(`\nBundling runtime platform adapters, including: ${platforms}`));
    for (const platform of platforms) {
        console.log(`handle platform: ${green(platform)}`);
        // bundle engine-adapter.js
        const engineEntry = normalizePath(ps.join(engineRoot, `platforms/runtime/platforms/${platform}/engine/index.js`));
        const engineOutput = normalizePath(ps.join(engineRoot, `bin/adapter/runtime/${platform}/engine-adapter.js`));
        await bundle(engineEntry, engineOutput, true);
    }
}

function normalizePath (path) {
    return path.replace(/\\/g, '/');
}

/**
 * Create bundle task
 * @param {string} src
 * @param {string} dst
 * @param {boolean} needUglify
 * @param {string} targets
 */
function createBundleTask (src, dst, needUglify, targets) {
    const targetFileName = ps.basename(dst);
    const targetFileNameMin = `${ps.basename(targetFileName, '.js')}.min.js`;
    dst = ps.dirname(dst);
    const bundler =  browserify(src);
    let task = bundler.transform(babelify, { presets: [
        [require('@babel/preset-env'), targets ? { targets } : undefined],
    ],
    plugins: [
        require('@babel/plugin-proposal-class-properties'),
        require('@babel/plugin-proposal-export-default-from'),
    ] })
        .bundle()
        .pipe(source(targetFileName))
        .pipe(buffer())
        .pipe(gulp.dest(dst))
        .pipe(rename(targetFileNameMin));
    // TODO: es6 module should use uglify-es
    if (needUglify && !targets) {
        task = task.pipe(uglify());
    }
    task = task.pipe(gulp.dest(dst));
    return task;
}

/**
 * Build adapters
 * @param {string} entry
 * @param {string} output
 * @param {boolean} needUglify
 * @param {string} targets
 */
async function bundle (entry, output, needUglify, targets = '') {
    await new Promise((resolve) => {
        console.log(`Generate bundle: ${green(ps.basename(output))}`);
        createBundleTask(entry, output, needUglify, targets).on('end', resolve);
    });
}
