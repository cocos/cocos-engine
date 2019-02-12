import { GFXCommandBuffer } from '../command-buffer';
import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXQueue, IGFXQueueInfo } from '../queue';
import { WebGL2GFXCommandBuffer } from './webgl2-command-buffer';
import { WebGL2CmdFuncExecuteCmds } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';

export class WebGL2GFXQueue extends GFXQueue {

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
                WebGL2CmdFuncExecuteCmds(this._device as WebGL2GFXDevice,
                    (cmdBuff as WebGL2GFXCommandBuffer).cmdPackage);
            }
        }
    }
}
