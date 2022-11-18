import { CCStereoPannerNode } from '../../base';
import { DomAudioContext } from './dom-audio-context';
import { DomAudioNode } from './dom-audio-node';

export class DomStereoPannerNode extends DomAudioNode implements CCStereoPannerNode {
    public pan = 0;
    constructor (ctx: DomAudioContext) {
        super(ctx);
    }
}
