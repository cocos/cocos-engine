import { CCGainNode } from '../../base';
import { InnerctxAudioContext } from './innerctx-audio-context';
import { InnerctxAudioNode } from './innerctx-audio-node';

export class InnerctxGainNode extends InnerctxAudioNode implements CCGainNode {
    get gain () {
        return this.gain;
    }
    set gain (val: number) {
        this.gain = val;
        this.update();
    }
    constructor (ctx: InnerctxAudioContext) {
        super(ctx);
    }
}
