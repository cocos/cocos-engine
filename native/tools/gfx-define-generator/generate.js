const ps = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const options = {
    engineRoot: '',
    clear: false,
    nonVerbatimCopy: false,
    debug: false,
};
const argc = process.argv.length;
for (let i = 2; i < argc; i++) {
    const arg = process.argv[i];
    if (arg === '--engine' && i < argc - 1) {
        options.engineRoot = ps.resolve(process.argv[++i]);
    } else if (arg === '--default-engine') {
        options.engineRoot = 'default';
    } else if (arg === '--clear') {
        options.clear = true;
    } else if (arg === '--non-verbatim-copy') {
        options.nonVerbatimCopy = true;
    } else if (arg === '--debug') {
        options.debug = true;
    }
}

const defaultEngineRoot = ps.join(__dirname, '../../../engine');
const cacheFile = ps.join(__dirname, 'engine_root_cache.txt');
if (options.engineRoot) {
    if (options.engineRoot === 'default') { options.engineRoot = defaultEngineRoot; }
    if (fs.existsSync(options.engineRoot)) { fs.writeFileSync(cacheFile, options.engineRoot); }
} else {
    if (fs.existsSync(cacheFile)) { options.engineRoot = fs.readFileSync(cacheFile); }
    if (!options.engineRoot) { options.engineRoot = defaultEngineRoot; }
}

// TODO: remove this after state info refactor
const ignoreList = { PipelineStateInfo: true, BlendTarget: true, BlendState: true, DepthStencilState: true, RasterizerState: true };

let header = fs.readFileSync(ps.join(__dirname, '/../../cocos/renderer/gfx-base/GFXDef-common.h')).toString();
header = header.replace(/\r\n/g, '\n');

const enumRE = /enum\s+class\s+(\w+).*?{\s*?\n(.+?)};/gs;
const enumValueRE = /(\w+).*?(?:=\s*(.*?))?,/g;
const enumMap = {};
let enumCap = enumRE.exec(header);
while (enumCap) {
    const e = enumMap[enumCap[1]] = {};
    e.keys = {};

    if (options.nonVerbatimCopy) {
        let values = enumCap[2].replace(/\s*\/\/.*$/gm, '');
        let valueCap = enumValueRE.exec(values);
        let val = -1;
        while (valueCap) {
            if (valueCap[2]) {
                val = Number.parseInt(valueCap[2]);
                if (Number.isNaN(val)) { val = valueCap[2]; }
                else { val = `0x${val.toString(16)}`; }
                e.customKey = true;
            } else {
                val++;
            }
            e.keys[valueCap[1]] = val;

            valueCap = enumValueRE.exec(values);
        }
    } else {
        e.fullContent = enumCap[2];
    }

    enumCap = enumRE.exec(header);
}

// save & strip block comments
const blockComments = [];
const blockCommentsRE = /(\/\*\*.*?\*\/)\s*(.+?\n)/gs;
header = header.replace(blockCommentsRE, (_, comments, succeeding) => {
    blockComments.push({ succeeding, source: comments });
    return succeeding;
});
// discard preprocessors
header = header.replace(/\s*#(if|else|elif|end).*/gm, '');
// replace vector<x>
header = header.replace(/(?:\w*::)?vector<(.+?)>/g, (_, type) => {
    return `${type.replace(/[*\s]+/g, '')}[]`;
});

const typedefRE = /^\s*using\s+(.+?)\s*=\s*(.+?);/gsm;
const typedefMap = { lists: {}, others: [] };
let typedefCap = typedefRE.exec(header);
while (typedefCap) {
    const alias = typedefCap[1];
    const source = typedefCap[2];
    if (source.endsWith('[]')) {
        typedefMap.lists[alias] = source;
    } else {
        typedefMap.others.push({ alias, source });
    }
    typedefCap = typedefRE.exec(header);
}

const getMemberList = (() => {
    const getMatchingPair = (string, startIdx, begSymbol, endSymbol) => {
        if (string[startIdx] !== begSymbol) { return startIdx; }
        let depth = 1;
        let i = startIdx + 1;
        for (; i < string.length; i++) {
            if (string[i] === begSymbol) { depth++; }
            if (string[i] === endSymbol) { depth--; }
            if (depth === 0) { break; }
        }
        return i;
    };
    return (string, startIdx) => {
        let begIdx = startIdx;
        let endIdx = string.length;
        let scopeReady = false;
        for (let i = startIdx; i < endIdx; ++i) {
            if (string[i] === '/' && string[i + 1] === '/') { // skip comments
                i = string.indexOf('\n', i);
            } else if (!scopeReady && string[i] === '{') {
                begIdx = i + 1;
                endIdx = getMatchingPair(string, i, '{', '}') - 1;
                scopeReady = true;
            } else if (string[i] === '(') { // end with any function declarations // TODO: fragile dependency on parenthesis
                endIdx = i;
            }
        }
        return string.slice(begIdx, endIdx);
    };
})();

const structRE = /(struct\s+(?:\w+\(\w+\)\s+)?(\w+).*?){\s*.+?\s*};/gs;
const structMemberRE = /^\s*(const\w*\s*)?([\w[\]]+)\s+?(\w+)(?:\s*[={]?\s*(.*?)\s*}*\s*)?;(?:\s*\/\/\s*@ts-(.*?)$)?/gm;
const structMap = {};
const replaceConstants = (() => {
    const strMap = {
        nullptr: 'null!',
        '::': '.',
    };
    const constexprRE = /constexpr\s+\w+\s+(\w+)\s*=\s*(.*);/g;
    let constexprCap = constexprRE.exec(header);
    while (constexprCap) {
        let val = constexprCap[2];
        if (val.endsWith('U')) { val = val.slice(0, -1); }
        val = val.replace('~0', '-1');
        strMap[constexprCap[1]] = val;
        constexprCap = constexprRE.exec(header);
    }
    const constantsRE = new RegExp(Object.keys(strMap).reduce((acc, cur) => `${acc}|${cur}`, '').slice(1), 'g');
    return (str) => str.replace(constantsRE, (match) => strMap[match]);
})();
const getArrayValue = (decayedType, value) => {
    const count = Number.parseInt(value);
    if (Number.isNaN(count)) { return `[${value}]`; }
    const ctorStr = `new ${decayedType}(), `;
    return `[${ctorStr.repeat(count).slice(0, -2)}]`;
};
let structCap = structRE.exec(header);
while (structCap) {
    const struct = structMap[structCap[2]] = {};
    struct.comments = blockComments.find((c) => structCap[0].startsWith(c.succeeding))?.source;

    struct.member = {};
    // structRE can not reliably extract the correct member declaration range
    let memberList = getMemberList(header, structCap.index + structCap[1].length);
    // discard pointer signs
    memberList = memberList.replace(/\*/g, '');

    let memberCap = structMemberRE.exec(memberList);
    while (memberCap) {
        if (!memberCap[3].startsWith('_')) {
            let type = memberCap[2];
            let readonly = false;
            if (typedefMap.lists[type]) {
                type = typedefMap.lists[type];
            } else {
                type = type.replace(/(\b)(void)(\b)/, '$1number$1');
                type = type.replace(/(\b)(?:uint\w+?_t|int\w+?_t|float)(\b)/, '$1number$1');
                type = type.replace(/(\b)(?:bool)(\b)/, '$1boolean$2');
                type = type.replace(/(\b)(?:String)(\b)/, '$1string$2');
            }
            if (memberCap[1]) { readonly = true; }
            const isArray = type.endsWith('[]');
            const decayedType = isArray ? type.slice(0, -2) : type;

            let value = memberCap[4];
            let n = Number.parseInt(value);
            if (!Number.isNaN(n)) {
                if (!value.startsWith('0x')) { value = n; } // keep hexadecimal numbers
                if (isArray) { value = `[${value}]`; }
            } else if (value) {
                value = replaceConstants(value);
                if (isArray) { value = getArrayValue(decayedType, value); }
            } else {
                if (isArray) { value = '[]'; }
                else if (type === 'string') { value = '\'\''; }
                else { value = `new ${type}()`; }
            }

            const info = struct.member[memberCap[3]] = {
                // all the overridable values
                readonly, type, value, isArray, decayedType,
            };

            const directives = memberCap[5];
            if (directives) {
                if (directives.startsWith('nullable')) {
                    info.type += ' | null';
                    info.value = 'null';
                } else if (directives.startsWith('overrides')) {
                    let overrides = {};
                    try { overrides = yaml.load(memberCap[5].slice(9)); }
                    catch (e) { console.warn(e); }
                    Object.assign(info, overrides);
                }
            }

            if (info.type === 'number' && info.value === 'null!') { info.value = 0; }
        }

        memberCap = structMemberRE.exec(memberList);
    }

    structCap = structRE.exec(header);
}

let output = '';

for (const name of Object.keys(enumMap)) {
    const e = enumMap[name];
    output += `export enum ${name} {\n`;

    if (options.nonVerbatimCopy) {
        for (const key in e.keys) {
            if (e.customKey) {
                output += `    ${key} = ${e.keys[key]},\n`;
            } else {
                output += `    ${key},\n`;
            }
        }
    } else {
        output += e.fullContent;
    }

    output += `}\n\n`;
}

for (const typedef of typedefMap.others) {
    output += `export type ${typedef.alias} = ${typedef.source};\n`;
}
output += `\n`;

for (const name of Object.keys(structMap)) {
    if (name in ignoreList) { continue; }
    const struct = structMap[name];

    if (struct.comments) { output += struct.comments + '\n'; }
    output += `export class ${name} {\n    declare private _token: never; `;
    output += `// to make sure all usages must be an instance of this exact class, not assembled from plain object`;
    output += `\n\n    constructor (\n`;

    for (const key in struct.member) {
        const { readonly, type, value } = struct.member[key];
        const decl = readonly ? `readonly ${key}` : key;
        if (value || value === 0) {
            output += `        public ${decl}: ${type} = ${value},\n`;
        } else {
            output += `        public ${decl}: ${type},\n`;
        }
    }

    output += `    ) {}\n`;

    if (!Object.keys(struct.member).some((k) => struct.member[k].readonly)) {
        output += `\n    public copy (info: Readonly<${name}>) {\n`;
        for (const key in struct.member) {
            const { decayedType, isArray } = struct.member[key];
            if (isArray) {
                if (structMap[decayedType]) { // nested object
                    output += `        deepCopy(this.${key}, info.${key}, ${decayedType});\n`;
                } else {
                    output += `        this.${key} = info.${key}.slice();\n`;
                }
            } else if (structMap[decayedType]) { // nested object
                output += `        this.${key}.copy(info.${key});\n`;
            } else {
                output += `        this.${key} = info.${key};\n`;
            }
        }
        output += `        return this;\n`;
        output += `    }\n`;
    }

    output += `}\n\n`;
}

if (options.clear) { output = ''; }

const outputFile = options.debug ? `${__dirname}/define.ts` : ps.join(options.engineRoot, 'cocos/core/gfx/base/define.ts');
let source = fs.readFileSync(outputFile).toString();

const begGuardRE = /![A-Z ]+!\s*=+\s*\*\//;
const begGuardCap = source.match(begGuardRE);
const begIdx = begGuardCap ? begGuardCap.index + begGuardCap[0].length : undefined;

const endGuardRE = /\/\*\*\s*\*\s*=+\s*![A-Z ]+!/g;
let endGuardCap = endGuardRE.exec(source);
if (endGuardCap) { endGuardCap = endGuardRE.exec(source); }
const endIdx = endGuardCap ? endGuardCap.index : undefined;

fs.writeFileSync(outputFile, `${source.slice(0, begIdx)}\n\n${output}${source.slice(endIdx)}`);
