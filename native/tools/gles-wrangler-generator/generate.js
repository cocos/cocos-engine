const fs = require('fs');
const parser = require('fast-xml-parser');
const axios = require('axios');

const eglRegistry = { local: `${__dirname}/specs/egl.xml`, remote: 'https://www.khronos.org/registry/EGL/api/egl.xml' };
const glRegistry = { local: `${__dirname}/specs/gl.xml`, remote: 'https://www.khronos.org/registry/OpenGL/xml/gl.xml' };

const downloadSpec = async (specInfo) => {
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

    const generate = (spec, featureNames, moduleName, bootstraps = []) => {
        const nameRecord = new Set();
        let headerDecl = '';
        let sourceDef = '';
        let sourceLoad = '';
        const writeCommand = (name) => {
            headerDecl += `extern PFN${name.toUpperCase()}PROC ${name};\n`;
            sourceDef += `PFN${name.toUpperCase()}PROC ${name};\n`;
            sourceLoad += `    ${name} = (PFN${name.toUpperCase()}PROC)${moduleName}Load("${name}");\n`;
            nameRecord.add(name);
        };
        const append = (content) => {
            headerDecl += content;
            sourceDef += content;
            sourceLoad += content;
        };
        for (const bootstrap of bootstraps) {
            writeCommand(bootstrap);
            append(`\n`);
        }
        for (const featureName of featureNames) {
            headerDecl += `/* ${featureName} */\n`;
            sourceDef += `/* ${featureName} */\n`;
            sourceLoad += `    /* ${featureName} */\n`;
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
        return { headerDecl, sourceDef, sourceLoad };
    }

    const eglSrc = generate(eglSpec, ['EGL_VERSION_1_0', 'EGL_VERSION_1_1', 'EGL_VERSION_1_2', 'EGL_VERSION_1_3', 'EGL_VERSION_1_4', 'EGL_VERSION_1_5'], 'eglw', ['eglGetProcAddress']);
    const es2Src = generate(glSpec, ['GL_ES_VERSION_2_0'], 'gles2w');
    const es3Src = generate(glSpec, ['GL_ES_VERSION_2_0', 'GL_ES_VERSION_3_0', 'GL_ES_VERSION_3_1', 'GL_ES_VERSION_3_2'], 'gles3w');

    const update = (path, moduleName, generatedSrc) => {
        let header = fs.readFileSync(`${path}.h`);
        let source = fs.readFileSync(`${path}.cpp`);
        let sourceOC = fs.readFileSync(`${path}.mm`);

        let flag = `/\* ${moduleName.toUpperCase()}_GENERATE_DECLARATION *\/`;
        header = header.slice(0, header.indexOf(flag) + flag.length);
        header += `\n\n${eglSrc.headerDecl}\n${generatedSrc.headerDecl}\n`;

        flag = `/\* ${moduleName.toUpperCase()}_GENERATE_IMPLEMENTATION *\/`;
        const eglLoad = eglSrc.sourceLoad.replace(/eglwLoad/g, `${moduleName}Load`);
        const generatedSource = `\n\n${eglSrc.sourceDef}\n${generatedSrc.sourceDef}\n` +
            `static void ${moduleName}LoadProcs() {\n${eglLoad}\n${generatedSrc.sourceLoad}}\n`;

        source = source.slice(0, source.indexOf(flag) + flag.length) + generatedSource;
        sourceOC = sourceOC.slice(0, sourceOC.indexOf(flag) + flag.length) + generatedSource;

        fs.writeFileSync(`${path}.h`, header);
        fs.writeFileSync(`${path}.cpp`, source);
        fs.writeFileSync(`${path}.mm`, sourceOC);
    };

    update(`${__dirname}/../../cocos/renderer/gfx-gles2/gles2w`, 'gles2w', es2Src);
    update(`${__dirname}/../../cocos/renderer/gfx-gles3/gles3w`, 'gles3w', es3Src);
})();
