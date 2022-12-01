import { CCAudioContext } from './audio-context';
import { CCAudioNode, NodeType } from './audio-node';

export class CCGainNode extends CCAudioNode {
    protected _type: NodeType = NodeType.GAIN;
    innerOperation: (() => void) | undefined;
    get gain () {
        return this.gain;
    }
    set gain (val: number) {
        this.gain = val;
        this.update();
    }
    constructor (ctx: CCAudioContext) {
        super(ctx);
    }
}
