import { CCAudioNode } from './base-audio-node';

export interface CCDestinationNode extends CCAudioNode {
    readonly maxChannelCount: number;
}
