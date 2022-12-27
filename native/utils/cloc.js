
// @ts-check

const child_process = require('child_process');
const path = require('path');
const fs = require('fs');

const flags = {
    EXCLUDED: "external",
    THIRD_PARTY: "3rd_party",
    COCOS: "cocos",
};

const external_dirs = `
external/sources/android-gamesdk
external/sources/boost ${flags.EXCLUDED}
external/sources/boost-source ${flags.EXCLUDED}
external/sources/concurrentqueue
external/sources/ConvertUTF
external/sources/edtaa3func
external/sources/EGL
external/sources/enoki
external/sources/glslang
external/sources/json
external/sources/khronos
external/sources/PhysX
external/sources/pvmp3dec
external/sources/rapidjson
external/sources/rtm
external/sources/SocketRocket
external/sources/Swappy
external/sources/taskflow
external/sources/tbb
external/sources/tinydir
external/sources/tinyxml2
external/sources/tommyds
external/sources/tremolo
external/sources/unzip
external/sources/xxhash
external/sources/xxtea
`;

const engine_dirs = `
cmake
cocos
extensions
tests
tools
utils
cocos/editor-support/spine ${flags.THIRD_PARTY}
cocos/editor-support/dragonbones ${flags.THIRD_PARTY}
`

const DIR_3rd = [];
const DIR_3rd_ignore = [];
const DIR_cocos = [];
const DIR_cocos_exclude = [];

external_dirs.split('\n').map(x => x.trim()).filter(x => x.length > 0).forEach((line) => {
    let parts = line.split(/\s+/).map(x => x.trim()).filter(x => x.length > 0);
    if (parts.length == 1) {
        DIR_3rd.push(parts[0]);
    }
    if (parts.length == 2) {
        let flag = parts[1];
        if (flag == flags.EXCLUDED) {
            DIR_3rd_ignore.push(parts[0]);
        } else {
            console.error(`Unhandled flag ${flag} in "${line}"`);
        }
    }
});

engine_dirs.split('\n').map(x => x.trim()).filter(x => x.length > 0).forEach((line) => {
    let parts = line.split(/\s+/).map(x => x.trim()).filter(x => x.length > 0);
    if (parts.length == 1) {
        DIR_cocos.push(parts[0]);
    }
    if (parts.length == 2) {
        let flag = parts[1];
        if (flag == flags.THIRD_PARTY) {
            DIR_3rd.push(parts[0]);
            DIR_cocos_exclude.push(parts[0]);
        } else {
            console.error(`Unhandled flag ${flag} in "${line}"`);
        }
    }
});

function clocDir(dir) {
    console.log(`Running cloc in ${dir} ... `);
    const cacheResult = path.join(__dirname, '.cloc', '.result-' + dir.replace(/\//g, '_'));
    if (fs.existsSync(cacheResult)) {
        console.log(`  Cached!`);
        return JSON.parse(fs.readFileSync(cacheResult).toString('utf8'));
    }
    const full_dir = path.normalize(path.join(__dirname, '..', dir));
    let cp = child_process.execSync(`cloc --include-lang="C/C++ Header,C,C++,Objective C,Objective C++,Java,CMake,JavaScript,TypeScript,Python,SWIG" --json ${full_dir}`, {
        cwd: path.join(__dirname, '..'),
    });
    console.log(`  Done!`);
    const text = cp.toString("utf8").trim();
    if (text.length == 0) {
        return null;
    }
    const ret = JSON.parse(text);
    ret.info = { path: dir };
    if (!fs.existsSync(path.join(__dirname, '.cloc'))) {
        fs.mkdirSync(path.join(__dirname, '.cloc'));
    }
    fs.writeFileSync(cacheResult, JSON.stringify(ret, null, 2));
    return ret;
}

const DIR_cocos_r = DIR_cocos.map(clocDir).filter(x => x);
const DIR_cocos_exclude_r = DIR_cocos_exclude.map(clocDir).filter(x => x);

const DIR_3rd_r = DIR_3rd.map(clocDir).filter(x => x);
const DIR_3rd_ignore_r = DIR_3rd_ignore.map(clocDir).filter(x => x);

function getKeys(o1, o2) {
    let list1 = Object.keys(o1);
    let list2 = Object.keys(o2);
    for (let e of list2) {
        if (list1.indexOf(e) < 0) {
            list1.push(e);
        }
    }
    return list1;
}

function resultAdd(r1, r2) {
    let ret = {};
    let KL0 = getKeys(r1, r2);
    for (let k of KL0) {
        let row = ret[k] = {};
        if (r1[k] === undefined) {
            Object.assign(row, r2[k]);
            continue;
        }
        if (r2[k] === undefined) {
            Object.assign(row, r1[k]);
            continue;
        }

        // assign by KL2 fields
        const f1 = r1[k];
        const f2 = r2[k];
        for (let attr in f1) {
            if (k === 'info' && attr === 'path') {
                row[attr] = map2array(f1[attr]).concat(map2array(f2[attr]));
            } else if (typeof f1[attr] === 'number') {
                row[attr] = f1[attr] + f2[attr];
            } else {
                row[attr] = f1[attr];
            }
        }
    }
    return ret;
}

function map2array(v) {
    return (v instanceof Array) ? v : [v];
}

function negFields(obj) {
    let ret = {};
    for (let k in obj) {
        if (typeof obj[k] === 'number') {
            ret[k] = -obj[k];
        } else {
            ret[k] = obj[k];
        }
    }
    return ret;
}

function resultSub(r1, r2) {
    let ret = {};
    let KL0 = getKeys(r1, r2);
    for (let k of KL0) {
        let row = ret[k] = {};
        if (r1[k] === undefined) {
            Object.assign(row, negFields(r2[k]));
            continue;
        }
        if (r2[k] === undefined) {
            Object.assign(row, r1[k]);
            continue;
        }

        // assign by KL2 fields
        const f1 = r1[k];
        const f2 = r2[k];
        for (let attr in f1) {
            if (k === 'info' && attr === 'path') {
                row[attr] = map2array(f1[attr]).concat(map2array(f2[attr]).map(x=>`!${x}`));
            } else if (typeof f1[attr] === 'number') {
                row[attr] = f1[attr] - f2[attr];
            } else {
                row[attr] = f1[attr];
            }
        }
    }
    return ret;
}

console.log(` ... `);

const getLOC = (attr, lang) => {
    return attr?.[lang]?.code ?? 0
}

const lines = [['目录', 'C/C++', 'Java', 'CMake', 'JS/TS', 'Python', 'SWIG']];
DIR_cocos_r.concat(DIR_3rd_r).concat(DIR_3rd_ignore_r).forEach(itm=> {
    lines.push([itm.info.path, 
        getLOC(itm, 'C') + getLOC(itm, 'C++') +  getLOC(itm, 'C/C++ Header'),
        getLOC(itm, 'Java'),
        getLOC(itm, 'CMake'),
        getLOC(itm, 'TypeScript') + getLOC(itm, 'JavaScript'),  
        getLOC(itm, 'Python'),
        getLOC(itm, 'SWIG'),
    ]);
})

fs.writeFileSync(path.join(__dirname, '.cloc', 'inspect.csv'), lines.map(line => 
    line.join(', ')        
).join('\n'));