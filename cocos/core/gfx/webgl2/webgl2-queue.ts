import { GFXCommandBuffer } from '../command-buffer';
import { GFXQueue, IGFXQueueInfo } from '../queue';
import { WebGL2CommandBuffer } from './webgl2-command-buffer';
import { GFXStatus } from '../define';
import { GFXFence } from '../fence';
import { WebGL2Fence } from './webgl2-fence';

export class WebGL2Queue extends GFXQueue {

    public numDrawCalls: number = 0;
    public numInstances: number = 0;
    public numTris: number = 0;

    public initialize (info: IGFXQueueInfo): boolean {

        this._type = info.type;

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._status = GFXStatus.UNREADY;
    }

    public submit (cmdBuffs: GFXCommandBuffer[], fence?: GFXFence) {
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
