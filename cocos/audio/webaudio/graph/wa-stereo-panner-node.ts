import { CCStereoPannerNode } from '../../base';
import { WAAudioNode } from './wa-audio-node';

export class WAStereoPannerNode extends WAAudioNode implements CCStereoPannerNode {
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
