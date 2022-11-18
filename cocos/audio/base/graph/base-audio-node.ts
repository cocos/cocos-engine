export interface CCAudioNode {
    connect(node: CCAudioNode): CCAudioNode;
    disconnect(node?: CCAudioNode);
}
