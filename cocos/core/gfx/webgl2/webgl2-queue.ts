import { GFXCommandBuffer } from '../command-buffer';
import { GFXQueue, IGFXQueueInfo } from '../queue';
import { WebGL2GFXCommandBuffer } from './webgl2-command-buffer';

export class WebGL2GFXQueue extends GFXQueue {

    public numDrawCalls: number = 0;
    public numInstances: number = 0;
    public numTris: number = 0;

    private _isAsync: boolean = false;

    protected _initialize (info: IGFXQueueInfo): boolean {

        return true;
    }

    protected _destroy () {
    }

    public submit (cmdBuffs: GFXCommandBuffer[], fence?) {
        // TODO: Async
        if (!this._isAsync) {
            for (let i = 0; i < cmdBuffs.length; i++) {
                const cmdBuff = cmdBuffs[i] as WebGL2GFXCommandBuffer;
                // WebGL2CmdFuncExecuteCmds(this._device as WebGL2GFXDevice, cmdBuff.cmdPackage); // opted out
                this.numDrawCalls += cmdBuff.numDrawCalls;
                this.numInstances += cmdBuff.numInstances;
                this.numTris += cmdBuff.numTris;
            }
        }
    }

    public clear () {
        this.numDrawCalls = 0;
        this.numInstances = 0;
        this.numTris = 0;
    }
}
