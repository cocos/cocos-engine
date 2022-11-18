import { CCStereoPannerNode } from '../../base';
import { DomAudioContext } from './dom-audio-context';
import { DomAudioNode, NodeType } from './dom-audio-node';

export class DomStereoPannerNode extends DomAudioNode implements CCStereoPannerNode {
    innerOperation: (() => void) | undefined;
    protected _type: NodeType = NodeType.STEREOPANNER;
    public pan = 0;
    constructor (ctx: DomAudioContext) {
        super(ctx);
    }
}
