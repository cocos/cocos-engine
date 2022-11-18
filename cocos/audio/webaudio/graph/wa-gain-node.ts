import { CCGainNode } from '../../base';
import { WAAudioNode } from './wa-audio-node';

export class WAGainNode extends WAAudioNode implements CCGainNode {
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
