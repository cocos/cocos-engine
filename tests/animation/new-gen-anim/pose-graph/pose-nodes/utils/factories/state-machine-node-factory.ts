import '../../../../utils/factory';
import { addPoseNodeFactory, createMotion, fillStateMachine, MotionParams, StateMachineParams } from '../../../../utils/factory';
import { PoseNodeStateMachine } from '../../../../../../../cocos/animation/marionette/pose-graph/pose-nodes/state-machine';

declare global {
    interface PoseNodeFactoryRegistry {
        'state-machine': {
            stateMachine: StateMachineParams;
        };
    }
}

addPoseNodeFactory('state-machine', (poseGraph, params) => {
    const node = new PoseNodeStateMachine();
    fillStateMachine(node.stateMachine, params.stateMachine);
    return poseGraph.addNode(node);
});
