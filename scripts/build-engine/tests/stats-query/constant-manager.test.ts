import { ConstantManager } from '../../src/constant-manager';

const cm = new ConstantManager(__dirname);

test('generateInternalConstants', () => {
    expect(cm.generateInternalConstants()).toMatchSnapshot();
});

test('generateCCEnv', () => {
    expect(cm.generateCCEnv()).toMatchSnapshot();
});

test('exportStaticConstants', () => {
    expect(cm.exportStaticConstants({
        mode: 'PREVIEW',
        platform: 'WECHAT',
        flags: { DEBUG: false, SERVER_MODE: true },
    })).toMatchSnapshot();
});

test('exportDynamicConstants', () => {
    expect(cm.exportDynamicConstants({
        mode: 'BUILD',
        platform: 'WECHAT',
        flags: { DEBUG: true, },
    })).toMatchSnapshot();
});

test('genBuildTimeConstants', () => {
    const result = cm.genBuildTimeConstants({
        mode: 'TEST',
        platform: 'NATIVE',
        flags: { DEBUG: false, SERVER_MODE: true },
    });
    expect(result).toMatchInlineSnapshot(`
        Object {
          "ALIPAY": false,
          "BAIDU": false,
          "BUILD": false,
          "BYTEDANCE": false,
          "COCOSPLAY": false,
          "DEBUG": false,
          "DEV": true,
          "EDITOR": false,
          "HTML5": false,
          "HUAWEI": false,
          "JSB": true,
          "LINKSURE": false,
          "MINIGAME": false,
          "NATIVE": true,
          "OPPO": false,
          "PREVIEW": false,
          "QTT": false,
          "RUNTIME_BASED": false,
          "SERVER_MODE": true,
          "SUPPORT_JIT": true,
          "TEST": true,
          "VIVO": false,
          "WECHAT": false,
          "XIAOMI": false,
        }
    `);
});
