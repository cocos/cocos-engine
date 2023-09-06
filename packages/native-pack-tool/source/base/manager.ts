
import { Paths } from "../utils";
import { CocosParams, NativePackTool } from "./default";

export type ISupportPlatform = 'mac-os' | 'mac' | 'ios' | 'android' | 'ohos';

export class NativePackToolManager {
    static Paths: Paths;

    private PackToolMap: Record<string, NativePackTool> = {};

    private updateMessage: Function | null = null;

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
        // 监听平台执行时的日志信息
        tool.on('update-message', (message: string) => {
            if (this.updateMessage) {
                this.updateMessage(message);
            }
        });
        await tool.make();
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

    setUpdateMessage(func: Function) {
        this.updateMessage = func;
    }

    getUpdateMessage(): Function | null {
        return this.updateMessage;
    }
}

export const nativePackToolMg = new NativePackToolManager();
