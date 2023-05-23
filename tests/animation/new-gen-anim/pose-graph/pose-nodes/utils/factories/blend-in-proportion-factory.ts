
import { PoseNodeBlendInProportion } from '../../../../../../../cocos/animation/marionette/pose-graph/pose-nodes/blend-in-proportion';
import { connectNode } from '../../../../../../../cocos/animation/marionette/pose-graph/op/internal';
import { poseGraphOp } from '../../../../../../../cocos/animation/marionette/pose-graph/op';
import '../../../../utils/factory';
import { addPoseNodeFactory, createPoseNode, PoseNodeParams } from '../../../../utils/factory';

declare global {
    interface PoseNodeFactoryRegistry {
        'blend-in-proportion': {
            items: Array<{
                pose: PoseNodeParams;
                proportion: number;
            }>;
        };
    }
}

addPoseNodeFactory('blend-in-proportion', (poseGraph, params) => {
    const node = poseGraph.addNode(new PoseNodeBlendInProportion());
    params.items.forEach(({ pose: poseParams, proportion }, itemIndex) => {
        const pose = createPoseNode(poseGraph, poseParams);
        const infos = Object.keys(poseGraphOp.getInputInsertInfos(node));
        expect(infos.length).toBeGreaterThan(0);
        poseGraphOp.insertInput(poseGraph, node, infos[0]);
        connectNode(poseGraph, node, ['poses', itemIndex], pose);
        node.proportions[itemIndex] = proportion;
    });
    return node;
});