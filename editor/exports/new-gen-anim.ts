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

export class TransitionPreviewer {
    constructor(root: Node) {
        this._root = root;
        const bindContext: BindContext = {
            getVar: this._getVar.bind(this),
        };
        this._source = new TransitionEndpoint(root, this._blendBuffer, bindContext);
        this._target = new TransitionEndpoint(root, this._blendBuffer, bindContext);
    }

    get source() {
        return this._source;
    }

    get target() {
        return this._target;
    }

    public destroy() {
    }

    public setTransitionDuration(value: number) {
        this._transitionDuration = value;
    }

    public setRelativeDuration(value: boolean) {
        this._relativeDuration = value;
    }

    public setExitCondition(value: number) {
        this._exitCondition = value;
    }

    public setExitConditionEnabled(value: boolean) {
        this._exitConditionEnabled = value;
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

    /**
     * 
     * @param time Player time, in seconds.
     */
    public setTime(time: number) {
        this._time = time;
    }

    public evaluate() {
        this._eval();
    }

    private _root: Node;
    private _time: number;
    private _transitionDuration: number = 0.0;
    private _relativeDuration: boolean = false;
    private _exitConditionEnabled: boolean = false;
    private _exitCondition: number = 0.0;
    private _blendBuffer = new BlendStateBuffer();
    private _source: TransitionEndpoint;
    private _target: TransitionEndpoint;
    private _varInstances: Record<string, VarInstance> = {};

    private _eval() {
        const {
            _time: time,
            _exitCondition: exitCondition,
            _exitConditionEnabled: exitConditionEnabled,
            _transitionDuration: transitionDuration,
            _relativeDuration: relativeDuration,
        } = this;

        const sourceDuration = this._source.duration;

        const exitTimeAbsolute = exitConditionEnabled
            ? sourceDuration * exitCondition
            : 0.0;

        const transitionDurationAbsolute = relativeDuration
            ? sourceDuration * transitionDuration
            : transitionDuration;

        if (time < exitTimeAbsolute) {
            this._source.eval(time, 1.0);
        } else {
            const transitionTime = time - exitTimeAbsolute;
            if (transitionTime > transitionDurationAbsolute) {
                this._target.eval(transitionTime, 1.0);
            } else {
                const transitionRatio = transitionTime / transitionDurationAbsolute;
                const sourceWeight = 1.0 - transitionRatio;
                const targetWeight = transitionRatio;
                this._source.eval(time, sourceWeight);
                this._target.eval(transitionTime, targetWeight);
            }
        }

        this._blendBuffer.apply();
    }

    private _getVar(id: string): VarInstance | undefined {
        return this._varInstances[id];
    }
}

class TransitionEndpoint {
    constructor(root: Node, blendBuffer: BlendStateBuffer, bindContext: BindContext) {
        this._root = root;
        this._blendBuffer = blendBuffer;
        this._bindContext = bindContext;
    }

    get duration() {
        return this._motionEval.duration;
    }

    public setMotion(motion: Motion) {
        const {
            _root: root,
            _blendBuffer: blendBuffer,
        } = this;

        const motionEval = motion[createEval]({
            node: root,
            blendBuffer,
            getVar: (...args) => {
                return this._bindContext.getVar(...args);
            },
        });

        this._motionEval = motionEval;
    }

    public eval(progress: number, weight: number) {
        this._motionEval.sample(progress, weight);
    }

    private declare _root: Node;
    private declare _blendBuffer: BlendStateBuffer;
    private declare _bindContext: BindContext;
    private _motionEval: MotionEval;
}
