import { GFXCommandBuffer } from '../command-buffer';
import { GFXQueue, IGFXQueueInfo } from '../queue';

export class WebGLGFXQueue extends GFXQueue {

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
            const len = cmdBuffs.length;
            for (let i = 0; i < len; i++) {
                const cmdBuff = cmdBuffs[i];
                // WebGLCmdFuncExecuteCmds( this._device as WebGLGFXDevice, (cmdBuff as WebGLGFXCommandBuffer).cmdPackage); // opted out
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
