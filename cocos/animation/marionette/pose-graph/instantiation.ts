import { instantiate } from '../../../serialization/instantiate';
import { PoseGraph } from './pose-graph';
import { PoseNode } from './pose-node';

export function instantiatePoseGraph (poseGraph: PoseGraph): PoseNode | null {
    return poseGraph.main
        ? instantiatePoseNode(poseGraph.main)
        : null;
}

function instantiatePoseNode (node: PoseNode) {
    const instantiated = instantiate(node);
    if ('__callOnAfterDeserializeRecursive' in instantiated) {
        (instantiated as unknown as {
            __callOnAfterDeserializeRecursive(): void;
        }).__callOnAfterDeserializeRecursive();
    }
    return instantiated;
}
