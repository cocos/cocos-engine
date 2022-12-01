import { INT_MAX } from '../../../../core/math/bits';

import { CCAudioContext } from './audio-context';
import { CCAudioNode, NodeType } from './audio-node';

export class CCDestinationNode extends CCAudioNode {
    innerOperation: (() => void) | undefined;
    protected _type: NodeType = NodeType.DESTINATION;
    get maxChannelCount () {
        console.warn('CC has no caller for max channel count');
        return INT_MAX;
    }
    constructor (ctx: CCAudioContext) {
        super(ctx);
        // When the destination node is created, its weight becomes 1 constantly.
        this._weight = 1;
    }
}
