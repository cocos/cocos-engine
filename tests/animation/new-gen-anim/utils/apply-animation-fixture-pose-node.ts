import { Pose } from "../../../../cocos/animation/core/pose";
import { AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphEvaluationContext } from "../../../../cocos/animation/marionette/animation-graph-context";
import { PoseNode } from "../../../../cocos/animation/marionette/pose-graph/pose-node";
import { RealValueAnimationFixture } from "./fixtures";
import { SingleRealValueObserver } from "./single-real-value-observer";

export class ApplyAnimationFixturePoseNode extends PoseNode {
    constructor(
        private _fixture: RealValueAnimationFixture,
        private _observer: SingleRealValueObserver,
    ) {
        super();
    }

    public bind(context: AnimationGraphBindingContext): void {
        this._poseWriter = this._observer.createPoseWriter(context);
    }

    public settle(context: AnimationGraphSettleContext): void { }

    public reenter(): void {
        this._time = 0.0;
    }

    protected doUpdate(context: AnimationGraphUpdateContext): void {
        this._time += context.deltaTime;
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        expect(this._poseWriter).not.toBeUndefined();
        return this._poseWriter!.write(this._fixture.getExpected(this._time), context);
    }

    private _poseWriter: ReturnType<SingleRealValueObserver['createPoseWriter']> | undefined;
    private _time = 0.0;
}