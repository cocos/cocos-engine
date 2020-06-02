import { GFXFence, IGFXFenceInfo } from '../fence';
import { GFXStatus } from '../define';

export class WebGLGFXFence extends GFXFence {

    public initialize (info: IGFXFenceInfo): boolean {
        this._status = GFXStatus.SUCCESS;
        return true;
    }

    public destroy () {
        this._status = GFXStatus.UNREADY;
    }

    // WebGL 1 doesn't have any syncing mechanism
    public wait () {}
    public reset () {}
}
