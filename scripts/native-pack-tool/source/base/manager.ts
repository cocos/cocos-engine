// 使用方式：1. const tool = new NativePackTool(); 2. tool.create(); 3. tool.compile();  4. tool.run();
// build = NativeBuild.query(platform); 查询某个平台当前的构建工具
// build.init(param) 传入参数初始化 create/compile/run 之前都需要先 init 才有效

import { Paths } from "../utils";
import { CocosParams, NativePackTool } from "./default";

export type ISupportPlatform = 'mac-os' | 'mac' | 'ios' | 'android' | 'ohos';

// NativeBuild.register(platform, options) 静态方法动态注册新的原生平台，已有的原生平台通过类似的方式注册进来作为参考。

export class NativePackToolManager {
    static Paths: Paths;

    private PackToolMap: Record<string, NativePackTool> = {};

    private getPackTool(platform: ISupportPlatform): NativePackTool | null {
        const handler = this.PackToolMap[platform];
        if (!handler) {
            return null;
        }
        return handler;
    }

    register(platform: ISupportPlatform, tool: NativePackTool) {
        this.PackToolMap[platform] = tool;
    }

    async init(platform: ISupportPlatform, params: CocosParams<Object>) {
        const tool = this.getPackTool(platform);
        if (!tool) {
            return false;
        }
        await tool.init(params);
        return true;
    }

    async create(platform: ISupportPlatform) {
        const tool = this.getPackTool(platform);
        if (!tool || !tool.create) {
            return false;
        }
        await tool.create();
    }

    async generate(platform: ISupportPlatform) {
        const tool = this.getPackTool(platform);
        if (!tool || !tool.generate) {
            return false;
        }
        await tool.generate();
        return true;
    }

    async make(platform: ISupportPlatform) {
        const tool = this.getPackTool(platform);
        if (!tool || !tool.make) {
            return false;
        }
        await tool.make();
        return true;
    }

    async run(platform: ISupportPlatform) {
        const tool = this.getPackTool(platform);
        if (!tool || !tool.run) {
            return false;
        }
        await tool.run();
        return true;
    }
}

export const nativePackToolMg = new NativePackToolManager();
