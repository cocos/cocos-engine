import { CCAudioContext } from './audio-context';
import { CCAudioNode, NodeType } from './audio-node';

export class CCStereoPannerNode extends CCAudioNode {
    protected _type: NodeType = NodeType.STEREOPANNER;
    innerOperation: (() => void) | undefined;
    public pan = 0;
    constructor (ctx: CCAudioContext) {
        super(ctx);
    }
}
