import { GFXCommandBuffer } from '../command-buffer';
import { GFXQueue, GFXQueueInfo } from '../queue';
import { WebGPUCommandBuffer } from './WebGPU-command-buffer';
import { GFXFence } from '../fence';
import { WebGPUFence } from './WebGPU-fence';

export class WebGPUQueue extends GFXQueue {

    public numDrawCalls: number = 0;
    public numInstances: number = 0;
    public numTris: number = 0;

    public initialize (info: GFXQueueInfo): boolean {

        this._type = info.type;

        return true;
    }

    public destroy () {
    }

    public submit (cmdBuffs: GFXCommandBuffer[], fence?: GFXFence) {
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
        if (fence) {
            (fence as WebGPUFence).insert();
        }
    }

    public clear () {
        this.numDrawCalls = 0;
        this.numInstances = 0;
        this.numTris = 0;
    }
}
