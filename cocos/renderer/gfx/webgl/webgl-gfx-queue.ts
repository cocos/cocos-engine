import { GFXDevice } from '../gfx-device';
import { GFXQueueInfo, GFXQueue } from '../gfx-queue';
import { GFXCommandBuffer } from '../gfx-command-buffer';
import { WebGLGFXCommandBuffer } from './webgl-gfx-command-buffer';
import { WebGLCmdFuncExecuteCmds } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-gfx-device';

export class WebGLGFXQueue extends GFXQueue {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXQueueInfo): boolean {

        this._type = info.type;

        return true;
    }

    public destroy() {

    }

    public submit(cmdBuffs: GFXCommandBuffer[], fence: null = null) {

        // TODO: Async
        if (!this._isAsync) {
            for (let i = 0; i < cmdBuffs.length; ++i) {
                let cmdBuff = <WebGLGFXCommandBuffer>cmdBuffs[i];
                WebGLCmdFuncExecuteCmds(<WebGLGFXDevice>this._device, cmdBuff.cmdPackage);
            }
        }
    }

    private _isAsync: boolean = false;
};
