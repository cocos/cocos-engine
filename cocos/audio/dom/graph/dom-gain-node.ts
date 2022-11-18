import { CCGainNode } from '../../base';
import { DomAudioContext } from './dom-audio-context';
import { DomAudioNode } from './dom-audio-node';

export class DomGainNode extends DomAudioNode implements CCGainNode {
    get gain () {
        return this.gain;
    }
    set gain (val: number) {
        this.gain = val;
        this.update();
    }
    constructor (ctx: DomAudioContext) {
        super(ctx);
    }
}
