import { BlendStateBuffer } from '../../cocos/3d/skeletal-animation/skeletal-animation-blending';
import { Node } from '../../cocos/core';
import { Motion, MotionEval } from '../../cocos/core/animation/marionette/motion';
import { createEval } from '../../cocos/core/animation/marionette/create-eval';
import { BindContext } from '../../cocos/core/animation/marionette/parametric';
import { VarInstance, Value, VariableType } from '../../cocos/core/animation/marionette/variable';

export {
    blend1D,
} from '../../cocos/core/animation/marionette/blend-1d';

export {
    blendSimpleDirectional,
    validateSimpleDirectionalSamples,
    SimpleDirectionalIssueSameDirection,
} from '../../cocos/core/animation/marionette/blend-2d';

export type {
    SimpleDirectionalSampleIssue,
} from '../../cocos/core/animation/marionette/blend-2d';

export * from '../../cocos/core/animation/marionette/asset-creation';

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
        this._varInstances[id] = new VarInstance(type, value);
    }

    public removeVariable(id: string) {
        delete this._varInstances[id];
    }

    public updateVariable(id: string, value: Value) {
        this._varInstances[id].value = value;
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
        });

        return motionEval;
    }

    private _root: Node;

    private _blendBuffer = new BlendStateBuffer();

    private _varInstances: Record<string, VarInstance> = {};

    private _getVar(id: string): VarInstance | undefined {
        return this._varInstances[id];
    }
}

export class AnimationBlendPreviewer extends AnimationGraphPartialPreviewer {
    public setMotion(motion: Motion) {
        this._motionEval = super.createMotionEval(motion);
    }

    public setTime(time: number) {
        this._time = time;
    }

    public evaluate(): void {
        const {
            _motionEval: motionEval,
        } = this;
        if (!motionEval) {
            return;
        }
        motionEval.sample(this._time / this._motionEval.duration, 1.0);
        super.evaluate();
    }

    private _time: number = 0.0;

    private _motionEval: MotionEval | null = null;
}

export class TransitionPreviewer extends AnimationGraphPartialPreviewer {
    constructor(root: Node) {
        super(root);
    }

    public destroy() {
    }

    public getTimelineStats() {
        const {
            _source: source,
            _target: target,
            _exitCondition: exitCondition,
            _exitConditionEnabled: exitConditionEnabled,
            _transitionDuration: transitionDuration,
            _relativeDuration: relativeDuration,
        } = this;

        const sourceMotionDuration = source.duration;
        const exitTimeRelative = exitConditionEnabled ? exitCondition * sourceMotionDuration : 0.0;
        const exitTimeAbsolute = sourceMotionDuration * exitTimeRelative;
        const transitionDurationAbsolute = relativeDuration
            ? sourceMotionDuration * transitionDuration
            : transitionDuration;
        const sourceMotionStart = 0.0;
        const sourceMotionRepeatCount = Math.max(1.0, exitTimeRelative);
        const targetMotionStart = exitTimeAbsolute;
        const targetMotionRepeatCount = Math.max(1.0, transitionDurationAbsolute / target.duration);
        const targetMotionDuration = target.duration;
        const timeLineLength = Math.max(1.0, exitCondition) * sourceMotionDuration
            + Math.max(transitionDurationAbsolute, targetMotionDuration);

        return {
            timeLineLength,
            sourceMotionStart,
            sourceMotionRepeatCount,
            sourceMotionDuration,
            targetMotionStart,
            targetMotionRepeatCount,
            targetMotionDuration,
            exitTimesStart: 0,
            exitTimesLength: exitTimeAbsolute,
            transitionDurationStart: exitTimeAbsolute,
            transitionDurationLength: transitionDurationAbsolute,
        };
    }

    public setSourceMotion(motion: Motion) {
        this._source = super.createMotionEval(motion);
    }

    public setTargetMotion(motion: Motion) {
        this._target = super.createMotionEval(motion);
    }

    public setTransitionDuration(value: number) {
        this._transitionDuration = value;
    }

    public setRelativeTransitionDuration(value: boolean) {
        this._relativeDuration = value;
    }

    public calculateTransitionDurationFromTimelineLength(value: number) {
        return this._relativeDuration ? value / this._source.duration : value;
    }

    public setExitTimes(value: number) {
        this._exitCondition = value;
    }

    public setExitTimeEnabled(value: boolean) {
        this._exitConditionEnabled = value;
    }

    public calculateExitTimesFromTimelineLength(value: number) {
        return value / this._source.duration;
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

        if (time < exitTimeAbsolute) {
            source.sample(time / sourceDuration, 1.0);
        } else {
            const transitionTime = time - exitTimeAbsolute;
            if (transitionTime > transitionDurationAbsolute) {
                target.sample(transitionTime / targetDuration, 1.0);
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

    private _time: number;
    private _transitionDuration: number = 0.0;
    private _relativeDuration: boolean = false;
    private _exitConditionEnabled: boolean = false;
    private _exitCondition: number = 0.0;
    private _source: MotionEval | null;
    private _target: MotionEval | null;
}
