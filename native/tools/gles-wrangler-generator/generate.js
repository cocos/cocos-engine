const fs = require('fs');
const parser = require('fast-xml-parser');
const axios = require('axios');

const eglRegistry = { local: `${__dirname}/specs/egl.xml`, remote: 'https://www.khronos.org/registry/EGL/api/egl.xml' };
const glRegistry = { local: `${__dirname}/specs/gl.xml`, remote: 'https://www.khronos.org/registry/OpenGL/xml/gl.xml' };

async function downloadSpec(specInfo) {
    if (fs.existsSync(specInfo.local)) return;
    fs.writeFileSync(specInfo.local, (await axios.get(specInfo.remote)).data);
}

(async () => {
    if (!fs.existsSync('specs')) fs.mkdirSync('specs');
    await downloadSpec(eglRegistry);
    await downloadSpec(glRegistry);
    const parseOpt = {
        attributeNamePrefix : "",
        ignoreAttributes : false,
        ignoreNameSpace : false,
        allowBooleanAttributes : true,
        parseNodeValue : true,
        parseAttributeValue : true,
        trimValues: true,
        parseTrueNumberOnly: false,
        arrayMode: true,
    };

    const glSpec = parser.parse(fs.readFileSync(glRegistry.local).toString(), parseOpt).registry[0];
    const eglSpec = parser.parse(fs.readFileSync(eglRegistry.local).toString(), parseOpt).registry[0];

    function generate(spec, featureNames, moduleName, bootstraps = []) {
        const nameRecord = new Set();
        let headerDecl = '';
        let implDef = '';
        let implLoad = '';
        const writeCommand = (name) => {
            headerDecl += `extern PFN${name.toUpperCase()}PROC ${name};\n`;
            implDef += `PFN${name.toUpperCase()}PROC ${name};\n`;
            implLoad += `    ${name} = (PFN${name.toUpperCase()}PROC)${moduleName}Load("${name}");\n`;
            nameRecord.add(name);
        };
        const append = (content) => {
            headerDecl += content;
            implDef += content;
            implLoad += content;
        };
        for (const bootstrap of bootstraps) {
            writeCommand(bootstrap);
            append(`\n`);
        }
        for (const featureName of featureNames) {
            headerDecl += `/* ${featureName} */\n`;
            implDef += `/* ${featureName} */\n`;
            implLoad += `    /* ${featureName} */\n`;
            const feature = spec.feature.find((f) => f.name === featureName);
            for (const manifest of feature.require) {
                if (!manifest.command) continue;
                for (const command of manifest.command) {
                    if (nameRecord.has(command.name)) continue;
                    writeCommand(command.name);
                }
                append(`\n`);
            }
            append(`\n`);
        }
        const featureAPI = spec.feature.find((f) => f.name === featureNames[0]).api;
        for (const extension of spec.extensions[0].extension) {
            if (!extension.supported.includes(featureAPI) || !extension.require) continue;
            let needDeclare = false;
            for (const require of extension.require) {
                if (require.api && !require.api.includes(featureAPI) ||
                !require.command || !require.command.length ||
                require.command.every((cmd) => nameRecord.has(cmd.name))) continue;
                if (!needDeclare) {
                    append(`#if defined(${extension.name})\n`);
                    needDeclare = true;
                } else {
                    append(`\n`);
                }
                for (const command of require.command) {
                    if (nameRecord.has(command.name)) continue;
                    writeCommand(command.name);
                }
            }
            if (needDeclare) {
                append(`#endif /* defined(${extension.name}) */\n\n`);
            }
        }
        if (!fs.existsSync('output')) fs.mkdirSync('output');
        fs.writeFileSync(`${__dirname}/output/${moduleName}_auto.h`, `#pragma once\n\nvoid ${moduleName}LoadProcs();\n\n${headerDecl}`);
        fs.writeFileSync(`${__dirname}/output/${moduleName}_auto.cpp`, `#include "${moduleName}.h"\n\n${implDef}void ${moduleName}LoadProcs() {\n${implLoad}}\n`);
    }

    generate(eglSpec, ['EGL_VERSION_1_0', 'EGL_VERSION_1_1', 'EGL_VERSION_1_2', 'EGL_VERSION_1_3', 'EGL_VERSION_1_4', 'EGL_VERSION_1_5'], 'eglw', ['eglGetProcAddress']);
    generate(glSpec, ['GL_ES_VERSION_2_0'], 'gles2w');
    generate(glSpec, ['GL_ES_VERSION_2_0', 'GL_ES_VERSION_3_0', 'GL_ES_VERSION_3_1', 'GL_ES_VERSION_3_2'], 'gles3w');

    fs.createReadStream(`${__dirname}/output/eglw_auto.h`).pipe(fs.createWriteStream(`${__dirname}/../../cocos/renderer/gfx-gles2/eglw_auto.h`));
    fs.createReadStream(`${__dirname}/output/eglw_auto.cpp`).pipe(fs.createWriteStream(`${__dirname}/../../cocos/renderer/gfx-gles2/eglw_auto.cpp`));
    fs.createReadStream(`${__dirname}/output/gles2w_auto.h`).pipe(fs.createWriteStream(`${__dirname}/../../cocos/renderer/gfx-gles2/gles2w_auto.h`));
    fs.createReadStream(`${__dirname}/output/gles2w_auto.cpp`).pipe(fs.createWriteStream(`${__dirname}/../../cocos/renderer/gfx-gles2/gles2w_auto.cpp`));

    fs.createReadStream(`${__dirname}/output/eglw_auto.h`).pipe(fs.createWriteStream(`${__dirname}/../../cocos/renderer/gfx-gles3/eglw_auto.h`));
    fs.createReadStream(`${__dirname}/output/eglw_auto.cpp`).pipe(fs.createWriteStream(`${__dirname}/../../cocos/renderer/gfx-gles3/eglw_auto.cpp`));
    fs.createReadStream(`${__dirname}/output/gles3w_auto.h`).pipe(fs.createWriteStream(`${__dirname}/../../cocos/renderer/gfx-gles3/gles3w_auto.h`));
    fs.createReadStream(`${__dirname}/output/gles3w_auto.cpp`).pipe(fs.createWriteStream(`${__dirname}/../../cocos/renderer/gfx-gles3/gles3w_auto.cpp`));
})();
