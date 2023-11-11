const ccbuild = require('@cocos/ccbuild');
const ps = require('path');
const fs = require('fs-extra');
const ts = require('typescript');
const del = require('del');
const { magenta, green, red } = require('chalk');

const prefix = ''.padStart(20, '=');
console.log(magenta(`${prefix} Compile native TS ${prefix}`));

let clean = true;
const argv2 = process.argv[2];
if (argv2 === '--no-clean') {
    clean = false;
}

const engineRoot = normalizePath(ps.join(__dirname, '..'));
const buildOutput = normalizePath(ps.join(__dirname, '__TS_ENGINE__'));

function normalizePath (path) {
    return path.replace(/\\/g, '/');
}

(async function main () {
    await buildTsEngine();
    await compileTsEngine();
}());

async function buildTsEngine () {
    console.log(green('building TS engine ...\n'));
    await ccbuild.buildEngine({
        // NOTE: for now only OH platform supports building TS engine
        platform: 'OPEN_HARMONY',
        preserveType: true,
        engine: engineRoot,
        // TODO: some modules still cannot be compile
        features: [
            'base',
            'gfx-webgl',
            'gfx-webgl2',
            '3d',
            'animation',
            'skeletal-animation',
            '2d',
            'ui',
            'particle',
            'particle-2d',
            'physics-framework',
            // "physics-cannon",
            // "physics-physx",
            // "physics-ammo",
            'physics-builtin',
            // "physics-2d-framework",
            // "physics-2d-box2d",
            // "physics-2d-builtin",
            'intersection-2d',
            'primitive',
            'profiler',
            // "occlusion-query",
            // "geometry-renderer",
            // "debug-renderer",
            'audio',
            'video',
            // "xr",
            // "terrain",
            'webview',
            'tween',
            // "tiled-map",
            // "spine",
            // "dragon-bones",
            // "marionette",
            'custom-pipeline',
            // "light-probe",
        ],
        mode: 'BUILD',
        flagConfig: {
            DEBUG: true,
        },
        out: buildOutput,
    });
}

async function compileTsEngine () {
    console.log(green('compiling TS engine ...\n'));
    const entryDir = normalizePath(ps.join(buildOutput, 'exports'));
    const entries = fs.readdirSync(entryDir).map((file) => normalizePath(ps.join(entryDir, file)));

    console.log(`typescript version: ${ts.version}`);
    console.log('compile source file: ', entries);

    const compilerOptions = {
        strict: true,
        noImplicitAny: false,
        experimentalDecorators: true,
        lib: ['lib.es2015.d.ts', 'lib.es2017.d.ts'],
        types: [
            './@types/editor-extends',
            './@types/globals',
            './@types/jsb',
            './@types/lib.dom',
            './@types/webGL.extras',
            './@types/webGL2.extras',

            // pal
            './@types/pal/system-info',
            './@types/pal/screen-adapter',
            './@types/pal/minigame',
            './@types/pal/audio',
            './@types/pal/input',
            './@types/pal/env',
            './@types/pal/pacer',
            './@types/pal/wasm',
        ].map((typePath) => normalizePath(ps.join(buildOutput, typePath))),
        skipLibCheck: true,
        rootDir: buildOutput,
        // outDir: normalizePath(ps.join(buildOutput, '__out__')),
        noEmit: true,
        target: 'ES2015',
        downlevelIteration: true,
    };
    console.log('compiler options: ', compilerOptions);

    const program = ts.createProgram(entries, compilerOptions);
    const emitResult = program.emit();
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    let hasError = false;
    for (const diagnostic of allDiagnostics) {
        let printer;
        switch (diagnostic.category) {
        case ts.DiagnosticCategory.Error:
            printer = console.error;
            if (!hasError) {
                printer(red('\n============= | Error | ========================\n'));
                hasError = true;
            }
            break;
        case ts.DiagnosticCategory.Warning:
            printer = console.warn;
            break;
        case ts.DiagnosticCategory.Message:
        case ts.DiagnosticCategory.Suggestion:
        default:
            printer = console.log;
            break;
        }
        if (!printer) {
            continue;
        }
        if (diagnostic.file && diagnostic.start !== undefined) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine);
            printer(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            printer(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
        }
    }

    if (clean) {
        console.log(green(`\nclean output: ${buildOutput}\n`));
        await del(buildOutput, { force: true });
    }

    if (hasError) {
        if (clean) {
            console.log(red(`\nNOTE: please run 'node ./scripts/compile-native-ts.js --no-clean' locally to locate the error !\n`));
        }
        process.exit(1);
    } else {
        console.log('compile successfully!\n');
        process.exit(0);
    }
}
