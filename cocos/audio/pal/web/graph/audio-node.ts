export abstract class CCAudioNode {
    protected abstract get anode(): AudioNode;
    connect (node: CCAudioNode): CCAudioNode {
        this.anode.connect(node.anode);
        return node;
    }
    disconnect (node?: CCAudioNode) {
        throw new Error('Method not implemented.');
    }
}
