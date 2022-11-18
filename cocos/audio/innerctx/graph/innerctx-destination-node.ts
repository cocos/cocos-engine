import { INT_MAX } from '../../../core/math/bits';
import { CCDestinationNode } from '../../base';
import { InnerctxAudioContext } from './innerctx-audio-context';
import { InnerctxAudioNode } from './innerctx-audio-node';

export class InnerctxDestinationNode extends InnerctxAudioNode implements CCDestinationNode {
    get maxChannelCount () {
        console.warn('Innerctx has no caller for max channel count');
        return INT_MAX;
    }
    constructor (ctx: InnerctxAudioContext) {
        super(ctx);
        // When the destination node is created, its weight becomes 1 constantly.
        this._weight = 1;
    }
}
