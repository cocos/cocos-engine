
import { Paths } from "../utils";
import { NativePackTool } from "./default";

export type ISupportPlatform = 'mac-os' | 'mac' | 'ios' | 'android' | 'ohos';

export class NativePackToolManager {
    static Paths: Paths;

    private PackToolMap: Record<string, NativePackTool> = {};

    public addChild: Function | null = null;

    public removeChild: Function | null = null;

    private getPackTool(platform: string): NativePackTool {
        const handler = this.PackToolMap[platform];
        if (!handler) {
            throw new Error(`No pack tool for platform ${platform}}`);
        }
        return handler;
    }

    register(platform: string, tool: NativePackTool) {
        this.PackToolMap[platform] = tool;
    }

    init(params:any) {
        const tool = this.getPackTool(params.platform);
        tool.init(params);
    }

    async create(platform: string) {
        const tool = this.getPackTool(platform);
        if (!tool) {
            throw new Error(`No pack tool for platform ${platform}}`);
        }
        if (!tool.create) {
            return false;
        }
        await tool.create();
    }

    async generate(platform: string) {
        const tool = this.getPackTool(platform);
        if (!tool) {
            throw new Error(`No pack tool for platform ${platform}}`);
        }
        if (!tool.generate) {
            return false;
        }
        await tool.generate();
    }

    async make(platform: string) {
        const tool = this.getPackTool(platform);
        if (!tool.make) {
            return false;
        }
        await tool.make();
        // TODO: 是否需要监听中断，才能结束这个 await
        return true;
    }

    async run(platform: string) {
        const tool = this.getPackTool(platform);
        if (!tool.run) {
            return false;
        }
        await tool.run();
        return true;
    }

    setAddChild(addChild: Function) {
        if (!this.addChild) {
            this.addChild = addChild;
        }
    }

    setRemoveChild(removeChild: Function) {
        if (!this.removeChild) {
            this.removeChild = removeChild;
        }
    }
}

export const nativePackToolMg = new NativePackToolManager();
