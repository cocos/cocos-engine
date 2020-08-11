import { GFXFence, IGFXFenceInfo } from '../fence';
import { WebGL2Device } from './webgl2-device';

export class WebGL2Fence extends GFXFence {

    private _sync: WebGLSync | null = null;

    public initialize (info: IGFXFenceInfo): boolean {
        return true;
    }

    public destroy () {
    }

    public wait () {
        if (this._sync) {
            const gl = (this._device as WebGL2Device).gl;
            gl.clientWaitSync(this._sync, 0, gl.TIMEOUT_IGNORED);
        }
    }

    public reset () {
        if (this._sync) {
            const gl = (this._device as WebGL2Device).gl;
            gl.deleteSync(this._sync);
            this._sync = null;
        }
    }

    public insert () {
        const gl = (this._device as WebGL2Device).gl;
        if (this._sync) { gl.deleteSync(this._sync); }
        this._sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    }
}
