const { ConstantManager } = require('../../dist/constant-manager/index');
const fs = require('fs');
const ps = require('path');

const cm = new ConstantManager(__dirname);

// The different OS handle escape like `\n` and `\t` differently, so we need to smooth this difference.
function handleEscape(str) {
    str = str.replace(/\s/g, '');
    return str;
}

test('generateInternalConstants', () => {
    const result = handleEscape( cm.generateInternalConstants() );
    const targetContent = handleEscape( fs.readFileSync(ps.join(__dirname, 'internal-constants.txt'), 'utf8') );
    expect(result).toBe(targetContent);
});

test('generateCCEnv', () => {
    const result = handleEscape( cm.generateCCEnv() );
    const targetContent = handleEscape( fs.readFileSync(ps.join(__dirname, 'ccEnv.txt'), 'utf8') );
    expect(result).toBe(targetContent);
});

test('exportStaticConstants', () => {
    const result = handleEscape( cm.exportStaticConstants({
        mode: 'BUILD',
        platform: 'WECHAT',
        flags: { DEBUG: true, },
    }) );
    const targetContent = handleEscape( fs.readFileSync(ps.join(__dirname, 'static-constants.txt'), 'utf8') );
    expect(result).toBe(targetContent);
});

test('exportDynamicConstants', () => {
    const result = handleEscape( cm.exportDynamicConstants({
        mode: 'BUILD',
        platform: 'WECHAT',
        flags: { DEBUG: true, },
    }) );
    const targetContent = handleEscape( fs.readFileSync(ps.join(__dirname, 'dynamic-constants.txt'), 'utf8') );
    expect(result).toBe(targetContent);
});

test('genBuildTimeConstants', () => {
    const result = cm.genBuildTimeConstants({
        mode: 'TEST',
        platform: 'NATIVE',
        flags: { DEBUG: false, SERVER_MODE: true },
    });
    expect(result).toStrictEqual({
        HTML5: false,
        NATIVE: true,
        WECHAT: false,
        BAIDU: false,
        XIAOMI: false,
        ALIPAY: false,
        BYTEDANCE: false,
        OPPO: false,
        VIVO: false,
        HUAWEI: false,
        COCOSPLAY: false,
        QTT: false,
        LINKSURE: false,
        EDITOR: false,
        PREVIEW: false,
        BUILD: false,
        TEST: true,
        DEBUG: false,
        SERVER_MODE: true,
        DEV: true,
        MINIGAME: false,
        RUNTIME_BASED: false,
        SUPPORT_JIT: true,
        JSB: true
      });
});