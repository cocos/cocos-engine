import type { KnownBuildMode } from './build-mode';
import { knownBuildMode } from './build-mode';
import type { KnownPlatform } from './platform';
import { knownPlatforms } from './platform';

export function generateBuildTimeConstants ({
    mode,
    platform,
    debug,
}: {
    /**
     * Build mod. Shall be on of the known mode.
     */
    mode?: string;
    /**
     * The platform. Shall be one of the known platform.
     */
    platform?: string;
    /**
     * Is debug build?
     */
    debug?: boolean;
}) {
    const constants: Record<string, boolean> = {};

    constants.DEBUG = debug ?? false;

    knownBuildMode.forEach((name) => constants[name] = false);
    if (mode) {
        if (knownBuildMode.includes(mode as KnownBuildMode)) {
            constants[mode] = true;
        } else {
            console.warn(`Unknown build mode constant: ${mode}`);
        }
    }

    knownPlatforms.forEach((name) => constants[name] = false);
    if (platform) {
        if (knownPlatforms.includes(platform as KnownPlatform)) {
            console.warn(`Unknown platform constant: ${platform}`);
        } else {
            console.warn(`Unknown platform constant: ${platform}`);
        }
    }

    constants.DEV = constants.EDITOR || constants.PREVIEW || constants.TEST;
    constants.DEBUG = constants.DEBUG || constants.DEV;
    constants.RUNTIME_BASED = constants.OPPO || constants.VIVO || constants.HUAWEI || constants.COCOSPLAY;
    constants.MINIGAME = constants.WECHAT || constants.ALIPAY || constants.XIAOMI || constants.BYTEDANCE || constants.BAIDU;
    constants.JSB = constants.NATIVE;
    constants.SUPPORT_JIT = !(constants.MINIGAME || constants.RUNTIME_BASED);
    return constants;
}
