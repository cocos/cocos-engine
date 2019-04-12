import { Asset, SpriteFrame } from '../assets';
import { Vec2 } from '../core';
import { ccclass, property } from '../core/data/class-decorator';
import { errorID } from '../core/platform/CCDebug';
import Quat from '../core/value-types/quat';
import Vec3, { v3 } from '../core/value-types/vec3';
import { lerp, quat, vec3 } from '../core/vmath';
import { find, Node } from '../scene-graph';
import { PropertyBlendState } from './animation-blend-state';
import { CurveValue, DynamicAnimCurve, EasingMethodName, ICurveTarget, LerpFunction, quickFindIndex } from './animation-curve';
import * as blending from './blending';
import { MotionPath, sampleMotionPaths } from './motion-path-helper';
import { ILerpable, isLerpable, WrapMode } from './types';

interface IAnimationEvent {
    frame: number;
    func: string;
    params: string[];
}

interface IKeyframe {
    frame: number;
    value: CurveValue;
    curve?: EasingMethodName | number[];
    motionPath?: MotionPath;
}

interface IPropertyCurveDataDetail {
    keyframes: IKeyframe[];
    blending: keyof(typeof blending) | null;
}

type PropertyCurveData = IKeyframe[] | IPropertyCurveDataDetail;

interface ICurveData {
    props?: {
        [propertyName: string]: PropertyCurveData;
    };
    comps?: {
        [componentName: string]: {
            [propertyName: string]: PropertyCurveData;
        };
    };
    paths?: {
        [path: string]: ICurveData;
    };
}

@ccclass('cc.AnimationClip')
export class AnimationClip extends Asset {

    /**
     * !#en Duration of this animation.
     * !#zh 动画的持续时间。
     */
    get duration () {
        return this._duration;
    }

    /**
     * !#en Crate clip with a set of sprite frames
     * !#zh 使用一组序列帧图片来创建动画剪辑
     * @example
     * const clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 10);
     *
     */
    public static createWithSpriteFrames (spriteFrames: SpriteFrame[], sample: number) {
        if (!Array.isArray(spriteFrames)) {
            errorID(3905);
            return null;
        }

        const clip = new AnimationClip();
        clip.sample = sample || clip.sample;

        clip._duration = spriteFrames.length / clip.sample;

        const frames: IKeyframe[] = [];
        const step = 1 / clip.sample;

        for (let i = 0, l = spriteFrames.length; i < l; i++) {
            frames[i] = { frame: (i * step), value: spriteFrames[i] };
        }

        clip.curveData = {
            comps: {
                // component
                'cc.Sprite': {
                    // component properties
                    spriteFrame: frames,
                },
            },
        };

        return clip;
    }

    /**
     * !#en FrameRate of this animation.
     * !#zh 动画的帧速率。
     */
    @property
    public sample = 60;

    /**
     * !#en Speed of this animation.
     * !#zh 动画的播放速度。
     */
    @property
    public speed = 1;

    /**
     * !#en WrapMode of this animation.
     * !#zh 动画的循环模式。
     */
    @property
    public wrapMode = WrapMode.Normal;

    /**
     * !#en Curve data.
     * !#zh 曲线数据。
     * @example {@link cocos2d/core/animation-clip/curve-data.js}
     */
    @property({visible: false})
    public curveData: ICurveData = {};

    /**
     * !#en Event data.
     * !#zh 事件数据。
     * @example {@link cocos2d/core/animation-clip/event-data.js}
     * @typescript events: {frame: number, func: string, params: string[]}[]
     */
    @property({visible: false})
    public events: IAnimationEvent[] = [];

    @property
    private _duration = 0;

    private frameRate = 0;

    public onLoad () {
        this._duration = this.duration;
        this.speed = this.speed;
        this.wrapMode = this.wrapMode;
        this.frameRate = this.sample;
    }

    public createPropCurve (target: ICurveTarget, propPath: string, propertyCurveData: PropertyCurveData) {
        const motionPaths: Array<(MotionPath | undefined)> = [];
        const isMotionPathProp = target instanceof Node && propPath === 'position';

        const curve = new DynamicAnimCurve();

        // 缓存目标对象，所以 Component 必须一开始都创建好并且不能运行时动态替换……
        curve.target = target;
        curve.prop = propPath;

        // For each keyframe.
        const keyframes = Array.isArray(propertyCurveData) ? propertyCurveData : propertyCurveData.keyframes;
        for (const keyframe of keyframes) {
            const ratio = keyframe.frame / this.duration;
            curve.ratios.push(ratio);

            if (isMotionPathProp) {
                motionPaths.push(keyframe.motionPath);
            }

            const curveValue = keyframe.value;
            curve.values.push(curveValue);

            const curveTypes = keyframe.curve;
            if (curveTypes) {
                if (typeof curveTypes === 'string') {
                    curve.types.push(curveTypes);
                    continue;
                } else if (Array.isArray(curveTypes)) {
                    if (curveTypes[0] === curveTypes[1] &&
                        curveTypes[2] === curveTypes[3]) {
                        curve.types.push(DynamicAnimCurve.Linear);
                    } else {
                        curve.types.push(DynamicAnimCurve.Bezier(curveTypes));
                    }
                    continue;
                }
            }
            curve.types.push(DynamicAnimCurve.Linear);
        }

        if (isMotionPathProp) {
            sampleMotionPaths(motionPaths, curve, this.duration, this.sample, target);
        }

        // if every piece of ratios are the same, we can use the quick function to find frame index.
        const ratios = curve.ratios;
        let currRatioDif;
        let lastRatioDif;
        let canOptimize = true;
        const EPSILON = 1e-6;
        for (let i = 1, l = ratios.length; i < l; i++) {
            currRatioDif = ratios[i] - ratios[i - 1];
            if (i === 1) {
                lastRatioDif = currRatioDif;
            }
            else if (Math.abs(currRatioDif - lastRatioDif) > EPSILON) {
                canOptimize = false;
                break;
            }
        }

        if (canOptimize) {
            curve._findFrameIndex = quickFindIndex;
        }

        // Setup the lerp function.
        const firstValue = curve.values[0];
        if (!curve._lerp && firstValue !== undefined) {
            if (typeof firstValue === 'number') {
                curve._lerp = lerpNumber;
            } else if (firstValue instanceof Quat) {
                curve._lerp = lerpQuat;
            } else if (firstValue instanceof Vec2 || firstValue instanceof Vec3) {
                curve._lerp = lerpVector;
            } else if (isLerpable(firstValue)) {
                curve._lerp = lerpObject;
            }
        }

        // Setup the blend function.
        const blendFunctionName = Array.isArray(propertyCurveData) ? null : propertyCurveData.blending;
        if (blendFunctionName) {
            curve._blendFunction = blending[blendFunctionName];
        }

        return curve;
    }

    public createTargetCurves (target: ICurveTarget, curveData: ICurveData, curves: DynamicAnimCurve[]) {
        const propsData = curveData.props;
        if (propsData) {
            for (const propPath of Object.keys(propsData)) {
                const data = propsData[propPath];
                const curve = this.createPropCurve(target, propPath, data);
                curves.push(curve);
            }
        }

        const compsData = curveData.comps;
        if (compsData) {
            for (const compName of Object.keys(compsData)) {
                const comp = target.getComponent(compName);
                if (!comp) {
                    continue;
                }
                const compData = compsData[compName];
                for (const propPath of Object.keys(compData)) {
                    const data = compData[propPath];
                    const curve = this.createPropCurve(comp, propPath, data);
                    curves.push(curve);
                }
            }
        }
    }

    public createCurves (state, root: Node) {
        const curveData = this.curveData;
        const childrenCurveDatas = curveData.paths;
        const curves = [];

        this.createTargetCurves(root, curveData, curves);
        if (childrenCurveDatas) {
            for (const namePath of Object.keys(childrenCurveDatas)) {
                const target = find(namePath, root);
                if (!target) {
                    continue;
                }
                const childCurveDatas = childrenCurveDatas[namePath];
                this.createTargetCurves(target, childCurveDatas, curves);
            }
        }

        return curves;
    }
}

const lerpNumber = lerp;
const lerpQuat = (() => {
    const out = new Quat();
    return (from: Quat, to: Quat, t: number) => {
        return from.lerp(to, t, out);
    };
})();
const lerpVector = (() => {
    const out = v3();
    return (from: Vec3, to: Vec3, t: number) => {
        return from.lerp(to, t, out);
    };
})();
function lerpObject (from: ILerpable, to: ILerpable, t: number): ILerpable {
    return from.lerp(to, t);
}

cc.AnimationClip = AnimationClip;
