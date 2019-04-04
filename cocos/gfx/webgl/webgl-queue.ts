import { GFXCommandBuffer } from '../command-buffer';
import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXQueue, IGFXQueueInfo } from '../queue';
import { WebGLGFXCommandBuffer } from './webgl-command-buffer';
import { WebGLCmdFuncExecuteCmds } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';

export class WebGLGFXQueue extends GFXQueue {

    public numDrawCalls: number = 0;
    public numTris: number = 0;

    private _isAsync: boolean = false;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXQueueInfo): boolean {

        this._type = info.type;
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._status = GFXStatus.UNREADY;
    }

    public submit (cmdBuffs: GFXCommandBuffer[], fence?) {

        // TODO: Async
        if (!this._isAsync) {
            for (const cmdBuff of cmdBuffs) {
                WebGLCmdFuncExecuteCmds( this._device as WebGLGFXDevice, (cmdBuff as WebGLGFXCommandBuffer).cmdPackage);
                this.numDrawCalls += cmdBuff.numDrawCalls;
                this.numTris += cmdBuff.numTris;
            }
        }
    }

    public clear () {
        this.numDrawCalls = 0;
        this.numTris = 0;
    }
}
