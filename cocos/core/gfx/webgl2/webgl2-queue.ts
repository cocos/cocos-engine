import { CommandBuffer } from '../command-buffer';
import { Queue, QueueInfo } from '../queue';
import { WebGL2CommandBuffer } from './webgl2-command-buffer';
import { Fence } from '../fence';
import { WebGL2Fence } from './webgl2-fence';

export class WebGL2Queue extends Queue {

    public numDrawCalls: number = 0;
    public numInstances: number = 0;
    public numTris: number = 0;

    public initialize (info: QueueInfo): boolean {

        this._type = info.type;

        return true;
    }

    public destroy () {
    }

    public submit (cmdBuffs: CommandBuffer[], fence?: Fence) {
        // TODO: Async
        if (!this._isAsync) {
            for (let i = 0; i < cmdBuffs.length; i++) {
                const cmdBuff = cmdBuffs[i] as WebGL2CommandBuffer;
                // WebGL2CmdFuncExecuteCmds(this._device as WebGL2Device, cmdBuff.cmdPackage); // opted out
                this.numDrawCalls += cmdBuff.numDrawCalls;
                this.numInstances += cmdBuff.numInstances;
                this.numTris += cmdBuff.numTris;
            }
        }
        if (fence) {
            (fence as WebGL2Fence).insert();
        }
    }

    public clear () {
        this.numDrawCalls = 0;
        this.numInstances = 0;
        this.numTris = 0;
    }
}
