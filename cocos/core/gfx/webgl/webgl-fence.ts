import { Fence, FenceInfo } from '../fence';

export class WebGLFence extends Fence {

    public initialize (info: FenceInfo): boolean {
        return true;
    }

    public destroy () {
    }

    // WebGL 1 doesn't have any syncing mechanism
    public wait () {}
    public reset () {}
}
