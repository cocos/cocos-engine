import { BlendStateBuffer, LegacyBlendStateBuffer } from '../../../cocos/3d/skeletal-animation/skeletal-animation-blending';
import { Node } from '../../../cocos/scene-graph';
import { Motion, MotionEval } from '../../../cocos/animation/marionette/motion';
import { createEval } from '../../../cocos/animation/marionette/create-eval';
import { BindContext } from '../../../cocos/animation/marionette/parametric';
import { VarInstance, Value, VariableType } from '../../../cocos/animation/marionette/variable';
import { assertIsNonNullable } from '../../../cocos/core/data/utils/asserts';
import {
    AnimationBlendEval,
} from '../../../cocos/animation/marionette/animation-blend';
import type { RuntimeID } from '../../../cocos/animation/marionette/graph-debug';

class AnimationGraphPartialPreviewer {
    constructor(root: Node) {
        this._root = root;
    }

    public destroy() {
    }

    public evaluate() {
        this._blendBuffer.apply();
    }

    public addVariable(id: string, type: VariableType, value: Value) {
        const { _varInstances: varInstances } = this;
        if (id in varInstances) {
            return;
        }
        varInstances[id] = new VarInstance(type, value);
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

    protected createMotionEval(motion: Motion) {
        const {
            _root: root,
            _blendBuffer: blendBuffer,
        } = this;

        const bindContext: BindContext = {
            getVar: this._getVar.bind(this),
        };

        const motionEval = motion[createEval]({
            node: root,
            blendBuffer,
            getVar: (...args) => {
                return bindContext.getVar(...args);
            },
            clipOverrides: null,
        });

        return motionEval;
    }

    private _root: Node;

    private _blendBuffer: BlendStateBuffer = new LegacyBlendStateBuffer();

    private _varInstances: Record<string, VarInstance> = {};

    private _getVar(id: string): VarInstance | undefined {
        return this._varInstances[id];
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

        if (this._motionEval) {
            return getWeightsRecursive(this._motionEval, 1.0);
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

    public evaluate(): void {
        const {
            _motionEval: motionEval,
        } = this;
        if (!motionEval) {
            return;
        }
        motionEval.sample(this._time / motionEval.duration, 1.0);
        super.evaluate();
    }

    private _time: number = 0.0;

    private _motionEval: MotionEval | null = null;

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

    public evaluate() {
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
            return;
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
            source.sample(time / sourceDuration, 1.0);
        } else {
            const transitionTime = time - exitTimeAbsolute;
            if (transitionTime > transitionDurationAbsolute) {
                target.sample((destinationStartAbsolute + transitionTime) / targetDuration, 1.0);
            } else {
                const transitionRatio = transitionTime / transitionDurationAbsolute;
                const sourceWeight = 1.0 - transitionRatio;
                const targetWeight = transitionRatio;
                source.sample(time / sourceDuration, sourceWeight);
                target.sample(transitionTime / targetDuration, targetWeight);
            }
        }

        super.evaluate();
    }

    private _time: number = 0.0;
    private _transitionDuration: number = 0.0;
    private _relativeDuration: boolean = false;
    private _exitConditionEnabled: boolean = false;
    private _exitCondition: number = 0.0;
    private _destinationStart = 0.0;
    private _relativeDestinationStart = false;
    private _source: MotionEval | null = null;
    private _target: MotionEval | null = null;
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
