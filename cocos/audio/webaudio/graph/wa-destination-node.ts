import { CCDestinationNode } from '../../base';
import { WAAudioNode } from './wa-audio-node';

export class WADestinationNode extends WAAudioNode implements CCDestinationNode {
    private _node: AudioDestinationNode;
    get anode () {
        return this._node;
    }
    constructor (ctx: AudioContext) {
        super();
        this._node = ctx.destination;
    }
    get maxChannelCount (): number {
        return this._node.maxChannelCount;
    }
}
