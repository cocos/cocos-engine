
export type IBuildTimeConstantValue = string | number | boolean;

export type IBuildTimeConstants = Record<string, IBuildTimeConstantValue>;

export function setupBuildTimeConstants ({
    mode,
    platform,
    flags,
}: {
    mode?: string;
    platform: string;
    flags: Record<string, IBuildTimeConstantValue>;
}) {
    const buildModeConstantNames = getBuildModeConstantNames();
    const platformConstantNames = getPlatformConstantNames();

    // setup default value
    flags.UI_GPU_DRIVEN ??= false;

    const result: Record<string, string | number | boolean> = {};
    platformConstantNames.forEach(name => result[name] = false);
    buildModeConstantNames.forEach(name => result[name] = false);

    if (mode) {
        if (!buildModeConstantNames.includes(mode)) {
            console.warn(`Unknown build mode constant: ${mode}`);
        }
        result[mode] = true;
    }

    if (!platformConstantNames.includes(platform)) {
        console.warn(`Unknown platform constant: ${platform}`);
    }
    result[platform] = true;

    Object.assign(result, flags);

    result.DEV = result.EDITOR || result.PREVIEW || result.TEST;
    result.DEBUG = result.DEBUG || result.DEV;
    result.RUNTIME_BASED = result.OPPO || result.VIVO || result.HUAWEI || result.COCOSPLAY || result.LINKSURE || result.QTT;
    result.MINIGAME = result.WECHAT || result.ALIPAY || result.XIAOMI || result.BYTEDANCE || result.BAIDU;
    result.JSB = result.NATIVE;
    result.SUPPORT_JIT = !(result.MINIGAME || result.RUNTIME_BASED);
    return result;
}

export function getPlatformConstantNames () {
    return ['HTML5', 'WECHAT', 'ALIPAY', 'BAIDU', 'XIAOMI', 'BYTEDANCE', 'OPPO', 'VIVO', 'HUAWEI', 'NATIVE', 'COCOSPLAY', 'LINKSURE', 'QTT'];
}

export function getBuildModeConstantNames () {
    return ['EDITOR', 'PREVIEW', 'BUILD', 'TEST'];
}