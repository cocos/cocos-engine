import { CCAudioNode } from './audio-node';

export class CCStereoPannerNode extends CCAudioNode {
    get pan (): number {
        return this._node.pan.value;
    }
    set pan (val: number) {
        this._node.pan.value = val;
    }
    private _node: StereoPannerNode;
    get anode () {
        return this._node;
    }
    constructor (ctx: AudioContext) {
        super();
        this._node = ctx.createStereoPanner();
    }
}
