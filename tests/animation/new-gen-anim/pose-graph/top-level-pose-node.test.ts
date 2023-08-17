import { AnimationGraph } from "../../../../cocos/animation/marionette/animation-graph";
import { connectOutputNode } from "../../../../cocos/animation/marionette/pose-graph/op/internal";
import { Node } from "../../../../cocos/scene-graph";
import { AnimationGraphEvalMock } from "../utils/eval-mock";
import { createAdditivityCheckMock } from "./utils/additive";

test(`Additivity inheritance`, () => {
    /// - The additivity of top level pose's binding context is inherited from animation graph layer.

    t(true);
    t(false);

    function t(additive: boolean) {
        const additivityCheckMock = createAdditivityCheckMock();

        const graph = new AnimationGraph();
        const layer = graph.addLayer();
        layer.additive = additive;

        const proceduralPoseState = layer.stateMachine.addProceduralPoseState();
        const poseNodeMock = proceduralPoseState.graph.addNode(new additivityCheckMock.PoseNodeMock());
        connectOutputNode(proceduralPoseState.graph, poseNodeMock);
        layer.stateMachine.connect(layer.stateMachine.entryState, proceduralPoseState);

        void new AnimationGraphEvalMock(new Node(), graph);

        expect(additivityCheckMock.bindMock).toBeCalledTimes(1);
        expect(additivityCheckMock.bindMock.mock.calls[0][0]).toBe(additive);
    }
});
