import { CCGainNode } from '../../base';
import { DomAudioContext } from './dom-audio-context';
import { DomAudioNode, NodeType } from './dom-audio-node';

export class DomGainNode extends DomAudioNode implements CCGainNode {
    innerOperation: (() => void) | undefined;
    protected _type: NodeType = NodeType.GAIN;

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
