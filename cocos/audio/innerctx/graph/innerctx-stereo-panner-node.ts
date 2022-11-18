import { CCStereoPannerNode } from '../../base';
import { InnerctxAudioContext } from './innerctx-audio-context';
import { InnerctxAudioNode } from './innerctx-audio-node';

export class InnerctxStereoPannerNode extends InnerctxAudioNode implements CCStereoPannerNode {
    public pan = 0;
    constructor (ctx: InnerctxAudioContext) {
        super(ctx);
    }
}
