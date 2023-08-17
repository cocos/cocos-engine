import { Node } from '../../../cocos/scene-graph';
import { Motion, MotionEval, MotionPort } from '../../../cocos/animation/marionette/motion';
import { createEval } from '../../../cocos/animation/marionette/create-eval';
import { VarInstance, Value, VariableType, VariableDescription, createInstanceTag } from '../../../cocos/animation/marionette/variable';
import { assertIsNonNullable } from '../../../cocos/core/data/utils/asserts';
import {
    AnimationBlendEval,
} from '../../../cocos/animation/marionette/motion/animation-blend';
import type { RuntimeID } from '../../../cocos/animation/marionette/graph-debug';
import {
    AnimationGraphBindingContext, AnimationGraphEvaluationContext,
    AnimationGraphPoseLayoutMaintainer, defaultTransformsTag, AuxiliaryCurveRegistry,
} from '../../../cocos/animation/marionette/animation-graph-context';
import { blendPoseInto, Pose } from '../../../cocos/animation/core/pose';
import { AnimationController } from '../../../cocos/animation/marionette/animation-controller';
import { EventTarget } from '../../../exports/base';

class AnimationGraphPartialPreviewer {
    constructor(root: Node) {
        this._root = root;

        const dummyAnimationControllerNode = new Node();
        this._dummyAnimationController = dummyAnimationControllerNode.addComponent(AnimationController);
    }

    public destroy() {
        this._dummyAnimationController.node.destroy();
    }

    public clear() {
        this._varInstances = {};
        this._motionRecords = [];
    }

    public evaluate() {
        const { _evaluationContext: evaluationContext } = this;
        const pose = this.doEvaluate(evaluationContext);
        this._poseLayoutMaintainer.apply(pose ?? evaluationContext.pushDefaultedPose());
        evaluationContext.popPose();
    }

    public addVariable(id: string, description: VariableDescription) {
        const { _varInstances: varInstances } = this;
        if (id in varInstances) {
            return;
        }
        varInstances[id] = description[createInstanceTag]();
    }

    public removeVariable(id: string) {
        delete this._varInstances[id];
    }

    public updateVariable(id: string, value: Value) {
        const varInstance = this._varInstances[id];
        if (!varInstance) {
            return;
        }
        varInstance.value = value;
    }

    protected createMotionEval(motion: Motion): MotionEvalRecord | null {
        const record = new MotionEvalRecord(motion);
        this._motionRecords.push(record);
        this._updateAllRecords();
        return record;
    }

    protected doEvaluate(_evaluationContext: AnimationGraphEvaluationContext): Pose | null {
        return null;
    }

    // NOTE: these two properties rely on lazy initialization.
    private _poseLayoutMaintainer!: AnimationGraphPoseLayoutMaintainer;
    private _evaluationContext!: AnimationGraphEvaluationContext;

    private _varInstances: Record<string, VarInstance> = {};

    private _root: Node;

    private _motionRecords: MotionEvalRecord[] = [];

    private _dummyAnimationController: AnimationController;

    private _updateAllRecords() {
        const poseLayoutMaintainer = new AnimationGraphPoseLayoutMaintainer(this._root, new AuxiliaryCurveRegistry());
        this._poseLayoutMaintainer = poseLayoutMaintainer;

        const bindingContext = new AnimationGraphBindingContext(
            this._root, this._poseLayoutMaintainer, this._varInstances, this._dummyAnimationController,
        );

        poseLayoutMaintainer.startBind();

        for (const record of this._motionRecords) {
            record.rebind(bindingContext);
        }

        poseLayoutMaintainer.endBind();

        const evaluationContext = poseLayoutMaintainer.createEvaluationContext();

        poseLayoutMaintainer.fetchDefaultTransforms(evaluationContext[defaultTransformsTag]);

        if (this._evaluationContext) {
            this._evaluationContext.destroy();
        }
        this._evaluationContext = evaluationContext;
    }
}

export interface MotionPreviewerTimelineStats {
    timeLineLength: number;
}

export class MotionPreviewer extends AnimationGraphPartialPreviewer {
    get timelineStats(): Readonly<MotionPreviewerTimelineStats> {
        if (this._timelineStatsDirty) {
            this._updateTimelineStats();
            this._timelineStatsDirty = false;
        }
        return this._timelineStats;
    }

    /**
     * Gets an iterable to the weights of each motion(that has runtime ID).
     */
    public queryWeights(): Iterable<[RuntimeID, number]> {
        if (this._motionEval) {
            return this._motionEval.getWeightsRecursive(1.0);
        }
        return [];
    }

    public setMotion(motion: Motion) {
        this._motionEval = super.createMotionEval(motion);
        this._timelineStatsDirty = true;
    }

    public setTime(time: number) {
        this._time = time;
    }

    public updateVariable(id: string, value: Value): void {
        super.updateVariable(id, value);
        this._timelineStatsDirty = true;
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext) {
        const {
            _motionEval: motionEval,
        } = this;
        if (!motionEval) {
            return context.pushDefaultedPose();
        }
        return motionEval.sample(this._time / motionEval.duration, context);
    }

    private _time: number = 0.0;

    private _motionEval: MotionEvalRecord | null = null;

    private _timelineStatsDirty = true;
    private _timelineStats: MotionPreviewerTimelineStats = {
        timeLineLength: 0.0,
    };

    private _updateTimelineStats() {
        this._timelineStats.timeLineLength = this._motionEval?.duration ?? 0.0;
    }
}

export interface TransitionPreviewerTimelineStats {
    timeLineLength: number;
    sourceMotionStart: number;
    sourceMotionRepeatCount: number;
    sourceMotionDuration: number;
    targetMotionStart: number;
    targetMotionRepeatCount: number;
    targetMotionDuration: number;
    exitTimesStart: number;
    exitTimesLength: number;
    transitionDurationStart: number;
    transitionDurationLength: number;
}

export class TransitionPreviewer extends AnimationGraphPartialPreviewer {
    constructor(root: Node) {
        super(root);
    }

    public destroy() {
    }

    get timelineStats(): Readonly<TransitionPreviewerTimelineStats> {
        if (this._timelineStatsDirty) {
            this._updateTimelineStats();
            this._timelineStatsDirty = false;
        }

        return this._timeLineStats;
    }

    public setSourceMotion(motion: Motion) {
        this._source = super.createMotionEval(motion);
        this._timelineStatsDirty = true;
    }

    public setTargetMotion(motion: Motion) {
        this._target = super.createMotionEval(motion);
        this._timelineStatsDirty = true;
    }

    public setTransitionDuration(value: number) {
        this._transitionDuration = value;
        this._timelineStatsDirty = true;
    }

    public setRelativeTransitionDuration(value: boolean) {
        this._relativeDuration = value;
        this._timelineStatsDirty = true;
    }

    public calculateTransitionDurationFromTimelineLength(value: number) {
        assertIsNonNullable(this._source);
        return this._relativeDuration ? value / this._source.duration : value;
    }

    public setExitTimes(value: number) {
        this._exitCondition = value;
        this._timelineStatsDirty = true;
    }

    public setExitTimeEnabled(value: boolean) {
        this._exitConditionEnabled = value;
        this._timelineStatsDirty = true;
    }

    public setDestinationStart(value: number) {
        this._destinationStart = value;
        this._timelineStatsDirty = true;
    }

    public setRelativeDestinationStart(value: boolean) {
        this._relativeDestinationStart = value;
        this._timelineStatsDirty = true;
    }

    public calculateExitTimesFromTimelineLength(value: number) {
        assertIsNonNullable(this._source);
        return value / this._source.duration;
    }

    public updateVariable(id: string, value: Value): void {
        super.updateVariable(id, value);
        this._timelineStatsDirty = true;
    }

    /**
     * 
     * @param time Player time, in seconds.
     */
    public setTime(time: number) {
        this._time = time;
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext) {
        const {
            _source: source,
            _target: target,
            _time: time,
            _exitCondition: exitCondition,
            _exitConditionEnabled: exitConditionEnabled,
            _transitionDuration: transitionDuration,
            _relativeDuration: relativeDuration,
            _destinationStart: destinationStart,
            _relativeDestinationStart: relativeDestinationStart,
        } = this;

        if (!source || !target) {
            return context.pushDefaultedPose();
        }

        const sourceDuration = source.duration;
        const targetDuration = target.duration;

        const exitTimeAbsolute = exitConditionEnabled
            ? sourceDuration * exitCondition
            : 0.0;

        const transitionDurationAbsolute = relativeDuration
            ? sourceDuration * transitionDuration
            : transitionDuration;

        const destinationStartAbsolute = relativeDestinationStart ? destinationStart * targetDuration : destinationStart;

        if (time < exitTimeAbsolute) {
            return source.sample(time / sourceDuration, context);
        } else {
            const transitionTime = time - exitTimeAbsolute;
            if (transitionTime > transitionDurationAbsolute) {
                return target.sample((destinationStartAbsolute + transitionTime) / targetDuration, context);
            } else {
                const transitionRatio = transitionTime / transitionDurationAbsolute;
                const sourcePose = source.sample(time / sourceDuration, context);
                const targetPose = target.sample(transitionTime / targetDuration, context);
                blendPoseInto(sourcePose, targetPose, transitionRatio);
                context.popPose();
                return sourcePose;
            }
        }
    }

    private _time: number = 0.0;
    private _transitionDuration: number = 0.0;
    private _relativeDuration: boolean = false;
    private _exitConditionEnabled: boolean = false;
    private _exitCondition: number = 0.0;
    private _destinationStart = 0.0;
    private _relativeDestinationStart = false;
    private _source: MotionEvalRecord | null = null;
    private _target: MotionEvalRecord | null = null;
    private _timelineStatsDirty = true;
    private _timeLineStats: TransitionPreviewerTimelineStats = {
        timeLineLength: 0.0,
        sourceMotionStart: 0.0,
        sourceMotionRepeatCount: 0.0,
        sourceMotionDuration: 0.0,
        targetMotionStart: 0.0,
        targetMotionRepeatCount: 0.0,
        targetMotionDuration: 0.0,
        exitTimesStart: 0.0,
        exitTimesLength: 0.0,
        transitionDurationStart: 0.0,
        transitionDurationLength: 0.0,
    };

    private _updateTimelineStats() {
        const {
            _source: source,
            _target: target,
            _exitCondition: exitCondition,
            _exitConditionEnabled: exitConditionEnabled,
            _transitionDuration: transitionDuration,
            _relativeDuration: relativeDuration,
            _destinationStart: destinationStart,
            _relativeDestinationStart: relativeDestinationStart,
        } = this;

        assertIsNonNullable(source);
        assertIsNonNullable(target);

        const sourceMotionDuration = source.duration;
        const exitTimeRelative = exitConditionEnabled ? exitCondition : 0.0;
        const exitTimeAbsolute = sourceMotionDuration * exitTimeRelative;
        const transitionDurationAbsolute = relativeDuration
            ? sourceMotionDuration * transitionDuration
            : transitionDuration;
        const sourceMotionStart = 0.0;
        const sourceMotionLiveTime = exitTimeAbsolute + transitionDurationAbsolute;
        const sourceMotionRepeatCount = sourceMotionLiveTime / sourceMotionDuration;

        const targetMotionDuration = target.duration;
        const destinationStartAbsolute = relativeDestinationStart ? targetMotionDuration * destinationStart : destinationStart;
        const targetMotionStart = exitTimeAbsolute - destinationStartAbsolute;
        const targetMotionLiveTime = Math.max(transitionDurationAbsolute, targetMotionDuration);
        const targetMotionRepeatCount = targetMotionLiveTime / targetMotionDuration;

        const timeLineLength =
            exitTimeAbsolute
            + targetMotionLiveTime;

        const { _timeLineStats: timeLineStats } = this;
        timeLineStats.timeLineLength = timeLineLength;
        timeLineStats.sourceMotionStart = sourceMotionStart;
        timeLineStats.sourceMotionRepeatCount = sourceMotionRepeatCount;
        timeLineStats.sourceMotionDuration = sourceMotionDuration;
        timeLineStats.targetMotionStart = targetMotionStart;
        timeLineStats.targetMotionRepeatCount = targetMotionRepeatCount;
        timeLineStats.targetMotionDuration = targetMotionDuration;
        timeLineStats.exitTimesStart = 0.0;
        timeLineStats.exitTimesLength = exitTimeAbsolute;
        timeLineStats.transitionDurationStart = exitTimeAbsolute;
        timeLineStats.transitionDurationLength = transitionDurationAbsolute;
    }
}

class MotionEvalRecord {
    constructor(motion: Motion) {
        this._motion = motion;
    }

    get motion() {
        return this._motion;
    }

    get duration() {
        return this._eval?.duration ?? 0.0;
    }

    public sample(progress: number, context: AnimationGraphEvaluationContext) {
        return this._port?.evaluate(progress, context) ?? context.pushDefaultedPose();
    }

    public getWeightsRecursive(weight: number): Iterable<[RuntimeID, number]> {
        if (!this._eval) {
            return [];
        }

        const getWeightsRecursive = function* (motionEval: MotionEval, weight: number): Iterable<[RuntimeID, number]> {
            if (typeof motionEval.runtimeId !== 'undefined') {
                yield [motionEval.runtimeId, weight];
            }

            if (motionEval instanceof AnimationBlendEval) {
                const nChild = motionEval.childCount;
                for (let iChild = 0; iChild < nChild; ++iChild) {
                    const childMotionEval = motionEval.getChildMotionEval(iChild);
                    const childWeight = motionEval.getChildWeight(iChild);
                    if (childMotionEval) {
                        for (const child of getWeightsRecursive(childMotionEval, childWeight)) {
                            yield child;
                        }
                    }
                }
            }

            return;
        };

        return getWeightsRecursive(this._eval, weight);
    }

    public rebind(bindContext: AnimationGraphBindingContext) {
        const motionEval = this._motion[createEval](bindContext, true);

        if (!motionEval) {
            return;
        }

        this._eval = motionEval;
        this._port = motionEval.createPort();
    }

    private _motion: Motion;
    private _eval: MotionEval | null = null;
    private _port: MotionPort | null = null;
}
