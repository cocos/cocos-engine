import { GFXFence, IGFXFenceInfo } from '../fence';
import { GFXStatus } from '../define';
import { WebGL2GFXDevice } from './webgl2-device';

export class WebGL2GFXFence extends GFXFence {

    private _sync: WebGLSync | null = null;

    public initialize (info: IGFXFenceInfo): boolean {
        this._status = GFXStatus.SUCCESS;
        return true;
    }

    public destroy () {
        this._status = GFXStatus.UNREADY;
    }

    public wait () {
        if (this._sync) {
            const gl = (this._device as WebGL2GFXDevice).gl;
            gl.clientWaitSync(this._sync, 0, gl.TIMEOUT_IGNORED);
        }
    }

    public reset () {
        if (this._sync) {
            const gl = (this._device as WebGL2GFXDevice).gl;
            gl.deleteSync(this._sync);
            this._sync = null;
        }
    }

    public insert () {
        const gl = (this._device as WebGL2GFXDevice).gl;
        if (this._sync) { gl.deleteSync(this._sync); }
        this._sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    }
}
