import { AnimationGraph } from "../../../../../cocos/animation/marionette/animation-graph";
import { connectOutputNode } from "../../../../../cocos/animation/marionette/pose-graph/op/internal";
import { PoseNodeSampleMotion } from "../../../../../cocos/animation/marionette/pose-graph/pose-nodes/sample-motion";
import { Node } from "../../../../../cocos/scene-graph";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";
import { LinearRealValueAnimationFixture } from '../../utils/fixtures';
import { SingleRealValueObserver } from "../../utils/single-real-value-observer";

describe(`Use normalized time`, () => {
    test.each([
        [true],
        [false],
    ])(`if %`, (useNormalizedTime) => {
        const fixture = {
            animation: new LinearRealValueAnimationFixture(2., 6., 5.),
        };

        const observer = new SingleRealValueObserver();
        const graph = new AnimationGraph();
        const layer = graph.addLayer();
        const proceduralPoseState = layer.stateMachine.addProceduralPoseState();
        const poseNode = proceduralPoseState.graph.addNode(new PoseNodeSampleMotion());
        connectOutputNode(proceduralPoseState.graph, poseNode);
        layer.stateMachine.connect(layer.stateMachine.entryState, proceduralPoseState);

        poseNode.motion = fixture.animation.createMotion(observer.getCreateMotionContext());
        poseNode.time = 0.2;
        poseNode.useNormalizedTime = useNormalizedTime;

        const evalMock = new AnimationGraphEvalMock(observer.root, graph);

        evalMock.step(9999.0);
        const expectedSampleTime = useNormalizedTime
            ? 0.2 * fixture.animation.duration
            : 0.2;
        expect(observer.value).toBeCloseTo(fixture.animation.getExpected(expectedSampleTime));
    })
});
