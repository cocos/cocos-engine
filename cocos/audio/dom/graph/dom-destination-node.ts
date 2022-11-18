import { INT_MAX } from '../../../core/math/bits';
import { CCDestinationNode } from '../../base';
import { DomAudioContext } from './dom-audio-context';
import { DomAudioNode, NodeType } from './dom-audio-node';

export class DomDestinationNode extends DomAudioNode implements CCDestinationNode {
    innerOperation: (() => void) | undefined = undefined;

    protected _type: NodeType = NodeType.DESTINATION;

    get maxChannelCount () {
        console.warn('Dom has no caller for max channel count');
        return INT_MAX;
    }
    constructor (ctx: DomAudioContext) {
        super(ctx);
        // When the destination node is created, its weight becomes 1 constantly.
        this._weight = 1;
    }
}
