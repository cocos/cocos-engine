import { CCGainNode } from '../../base';
import { InnerctxAudioContext } from './innerctx-audio-context';
import { InnerctxAudioNode, NodeType } from './innerctx-audio-node';

export class InnerctxGainNode extends InnerctxAudioNode implements CCGainNode {
    protected _type: NodeType = NodeType.GAIN;
    innerOperation: (() => void) | undefined;
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
