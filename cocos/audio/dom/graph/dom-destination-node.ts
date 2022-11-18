import { INT_MAX } from '../../../core/math/bits';
import { CCDestinationNode } from '../../base';
import { DomAudioContext } from './dom-audio-context';
import { DomAudioNode } from './dom-audio-node';

export class DomDestinationNode extends DomAudioNode implements CCDestinationNode {
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
