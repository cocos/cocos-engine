import { CommandBuffer } from '../base/command-buffer';
import { Queue } from '../base/queue';
import { WebGPUCommandBuffer } from './webgpu-command-buffer';
import { QueueInfo } from '../base/define';

export class WebGPUQueue extends Queue {
    public numDrawCalls = 0;
    public numInstances = 0;
    public numTris = 0;

    private _nativeQueue: GPUQueue | null = null;

    public initialize(info: QueueInfo): boolean {
        this._type = info.type;

        return true;
    }

    public destroy() {
    }

    public submit(cmdBuffs: CommandBuffer[]) {
        // TODO: Async
        if (!this._isAsync) {
            for (let i = 0; i < cmdBuffs.length; i++) {
                const cmdBuff = cmdBuffs[i] as WebGPUCommandBuffer;
                // WebGPUCmdFuncExecuteCmds(this._device as WebGPUDevice, cmdBuff.cmdPackage); // opted out
                this.numDrawCalls += cmdBuff.numDrawCalls;
                this.numInstances += cmdBuff.numInstances;
                this.numTris += cmdBuff.numTris;
            }
        }
    }

    public clear() {
        this.numDrawCalls = 0;
        this.numInstances = 0;
        this.numTris = 0;
    }
}
