import { CCAudioNode } from '../../base';

export abstract class WAAudioNode implements CCAudioNode {
    abstract readonly anode: AudioNode;
    connect (node: WAAudioNode): WAAudioNode {
        this.anode.connect(node.anode);
        return node;
    }
    disconnect (node?: WAAudioNode) {
        throw new Error('Method not implemented.');
    }
}
