const fs = require('fs');
const parser = require('fast-xml-parser');
const axios = require('axios');

const specDir = `${__dirname}/specs`;
const eglRegistry = { local: `${specDir}/egl.xml`, remote: 'https://www.khronos.org/registry/EGL/api/egl.xml' };
const glRegistry = { local: `${specDir}/gl.xml`, remote: 'https://www.khronos.org/registry/OpenGL/xml/gl.xml' };

const downloadSpec = async (specInfo) => {
    if (fs.existsSync(specInfo.local)) return;
    fs.writeFileSync(specInfo.local, (await axios.get(specInfo.remote)).data);
}

const options = {
    clear: false,
};
const argc = process.argv.length;
for (let i = 2; i < argc; i++) {
    const arg = process.argv[i];
    if (arg === '--clear') {
        options.clear = true;
    }
}

(async () => {
    if (!fs.existsSync(specDir)) fs.mkdirSync(specDir);
    await downloadSpec(eglRegistry);
    await downloadSpec(glRegistry);

    const parseOpt = {
        attributeNamePrefix : '',
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

    const generate = (spec, featureNames, moduleName, bootstraps = [], noExtension = false) => {
        const nameRecord = new Set();
        let headerDecl = '';
        let sourceDef = '';
        let sourceLoad = '';
        const writeCommand = (name) => {
            const nolint = name.includes('_') ? ' // NOLINT(readability-identifier-naming)' : '';
            headerDecl += `extern PFN${name.toUpperCase()}PROC ${name};${nolint}\n`;
            sourceDef += `PFN${name.toUpperCase()}PROC ${name};\n`;
            sourceLoad += `    ${name} = reinterpret_cast<PFN${name.toUpperCase()}PROC>(${moduleName}Load("${name}"));\n`;
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
            sourceLoad += `    `;
            append(`/* ${featureName} */\n`);
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
        if (!noExtension) {
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
        }
        return { headerDecl, sourceDef, sourceLoad };
    }

    const eglSrc = generate(eglSpec, ['EGL_VERSION_1_0', 'EGL_VERSION_1_1', 'EGL_VERSION_1_2', 'EGL_VERSION_1_3', 'EGL_VERSION_1_4', 'EGL_VERSION_1_5'], 'eglw', ['eglGetProcAddress']);
    const es2Src = generate(glSpec, ['GL_ES_VERSION_2_0'], 'gles2w');
    const es3Src = generate(glSpec, ['GL_ES_VERSION_3_0', 'GL_ES_VERSION_3_1', 'GL_ES_VERSION_3_2'], 'gles3w', [], true);

    const updateBlock = (source, moduleName, keyword, content, indentEnd) => {
        const flag = `/\\* ${moduleName.toUpperCase()}_GENERATE_${keyword} \\*/\n`;
        const flagRE = new RegExp(flag, 'g');
        const indices = [];
        while (flagRE.exec(source)) indices.push(flagRE.lastIndex);
        if (indices.length !== 2) return source;
        indices[1] -= flag.length - 2; // two escape characters
        if (options.clear) content = '';
        if (indentEnd) content += '    ';
        return source.slice(0, indices[0]) + content + source.slice(indices[1]);
    };

    const update = (path, moduleName, generatedSrc) => {
        let header = fs.readFileSync(`${path}.h`);
        let source = fs.readFileSync(`${path}.cpp`);

        header = updateBlock(header, moduleName, 'EGL_DECLARATION', eglSrc.headerDecl);
        header = updateBlock(header, moduleName, 'GLES_DECLARATION', generatedSrc.headerDecl);

        source = updateBlock(source, moduleName, 'EGL_DEFINITION', eglSrc.sourceDef);
        source = updateBlock(source, moduleName, 'GLES_DEFINITION', generatedSrc.sourceDef);
        source = updateBlock(source, moduleName, 'EGL_LOAD', eglSrc.sourceLoad.replace(/eglwLoad/g, `${moduleName}Load`), true);
        source = updateBlock(source, moduleName, 'GLES_LOAD', generatedSrc.sourceLoad, true);

        fs.writeFileSync(`${path}.h`, header);
        fs.writeFileSync(`${path}.cpp`, source);
    };

    update(`${__dirname}/../../cocos/renderer/gfx-gles-common/eglw`, 'eglw', eglSrc);
    update(`${__dirname}/../../cocos/renderer/gfx-gles-common/gles2w`, 'gles2w', es2Src);
    update(`${__dirname}/../../cocos/renderer/gfx-gles-common/gles3w`, 'gles3w', es3Src);
})();
