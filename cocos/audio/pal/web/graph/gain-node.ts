import { CCAudioNode } from './audio-node';

export class CCGainNode extends CCAudioNode {
    private _node: GainNode;
    get anode () {
        return this._node;
    }
    get gain (): number {
        return this._node.gain.value;
    }
    set gain (gain: number) {
        this._node.gain.value = gain;
    }
    constructor (ctx: AudioContext) {
        super();
        this._node = ctx.createGain();
    }
}
