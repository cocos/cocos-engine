import { PoseGraphNode } from './pose-graph-node';

export class AddNonFreestandingNodeError extends Error {
    constructor (node: PoseGraphNode) {
        super(`Can not add the specified ${node.toString()} since it has already been added into another graph.`);
    }
}

export class OperationOnFreestandingNodeError extends Error {
    constructor (node: PoseGraphNode) {
        super(`Can not perform specified operation on ${node.toString()} since it has not been added in to graph.`);
    }
}
