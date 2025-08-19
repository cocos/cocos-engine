
import { CocosParams, NativePackTool } from "./default";

export type ISupportPlatform = 'mac-os' | 'mac' | 'ios' | 'android' | 'google-play' | 'ohos';
const platformPackToolMap: Record<string, () => typeof NativePackTool>  = {
    ios: () => {
        return require('../platforms/ios').IOSPackTool;
    },
    mac: () => {
        return require('../platforms/mac').MacPackTool;
    },
    windows: () => {
        return require('../platforms/windows').WindowsPackTool;
    },
    android: () => {
        return require('../platforms/android').AndroidPackTool;
    },
    'google-play': () => {
        return require('../platforms/google-play').GooglePlayPackTool;
    },
    'harmonyos-next': () => {
        return require('../platforms/harmonyos-next').HarmonyOSNextPackTool;
    },
    ohos: () => {
        return require('../platforms/ohos').OHOSPackTool;
    },
    'huawei-agc': () => {
        return require('../platforms/huawei-agc').HuaweiAGCPackTool;
    },
}
export class NativePackToolManager {
    private PackToolMap: Record<string, NativePackTool> = {};
    static platformToPackTool: Record<string, typeof NativePackTool> = {};

    static register(platform: string, tool: typeof NativePackTool) {
        NativePackToolManager.platformToPackTool[platform] = tool;
    }

    private getTool(platform: string): NativePackTool {
        const handler = this.PackToolMap[platform];
        if (handler) {
            return handler;
        }
        const PackTool = NativePackToolManager.getPackTool(platform) as new () => NativePackTool;
        this.PackToolMap[platform] = new PackTool();
        return this.PackToolMap[platform];
    }

    static getPackTool(platform: string) {
        if (NativePackToolManager.platformToPackTool[platform]) {
            return NativePackToolManager.platformToPackTool[platform];
        }
        if (!platformPackToolMap[platform]) {
            throw new Error(`No pack tool for platform ${platform}}`);
        }
        const PackTool = platformPackToolMap[platform]();
        NativePackToolManager.platformToPackTool[platform] = PackTool;
        return PackTool;
    }

    async openWithIDE(platform: string, projectPath: string, IDEDir?: string) { 
        const tool = NativePackToolManager.getPackTool(platform); 
        if (!tool.openWithIDE) { 
            return false; 
        } 
        await tool.openWithIDE(projectPath, IDEDir); 
        return true; 
    }

    init(params:any) {
        const tool = this.getTool(params.platform);
        tool.init(params);
        return tool;
    }

    async create(platform: string) {
        const tool = this.getTool(platform);
        if (!tool) {
            throw new Error(`No pack tool for platform ${platform}}`);
        }
        if (!tool.create) {
            return false;
        }
        return await tool.create();
    }

    async generate(platform: string) {
        const tool = this.getTool(platform);
        if (!tool) {
            throw new Error(`No pack tool for platform ${platform}}`);
        }
        if (!tool.generate) {
            return false;
        }
        return await tool.generate();
    }

    async make(platform: string) {
        const tool = this.getTool(platform);
        if (!tool.make) {
            return false;
        }
        await tool.make();
        return true;
    }

    async run(platform: string) {
        const tool = this.getTool(platform);
        if (!tool.run) {
            return false;
        }
        await tool.run();
        return true;
    }

}

export const nativePackToolMg = new NativePackToolManager();
