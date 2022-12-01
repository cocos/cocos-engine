import { CCAudioNode } from './audio-node';

export class CCDestinationNode extends CCAudioNode {
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
