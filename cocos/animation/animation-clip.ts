import { Asset, SpriteFrame } from '../assets';
import { Vec2 } from '../core';
import { ccclass, property } from '../core/data/class-decorator';
import { errorID } from '../core/platform/CCDebug';
import Quat from '../core/value-types/quat';
import Vec3, { v3 } from '../core/value-types/vec3';
import { lerp } from '../core/vmath';
import { find, Node } from '../scene-graph';
import { CurveValue, DynamicAnimCurve, EasingMethodName, ICurveTarget, RatioSampler } from './animation-curve';
import { AnimationState } from './animation-state';
import * as blending from './blending';
import { MotionPath, sampleMotionPaths } from './motion-path-helper';
import { ILerpable, isLerpable, WrapMode as AnimationWrapMode } from './types';

interface IAnimationEvent {
    frame: number;
    func: string;
    params: string[];
}

type EasingMethod = EasingMethodName | number[];

interface IPropertyCurveDataDetail {
    keys: number;
    values: CurveValue[];
    easingMethod?: EasingMethod;
    easingMethods?: EasingMethod[];
    motionPaths?: MotionPath | MotionPath[];
}

type PropertyCurveData = IPropertyCurveDataDetail;

interface ICurveData {
    props?: {
        [propertyName: string]: PropertyCurveData;
    };
    comps?: {
        [componentName: string]: {
            [propertyName: string]: PropertyCurveData;
        };
    };
}

@ccclass('cc.AnimationClip')
export class AnimationClip extends Asset {
    public static WrapMode = AnimationWrapMode;

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
        const step = 1 / clip.sample;
        const keys = new Array<number>(spriteFrames.length);
        const values = new Array<SpriteFrame>(keys.length);
        for (let i = 0; i < spriteFrames.length; i++) {
            keys[i] = i * step;
            values[i] = spriteFrames[i];
        }
        clip._keys = [keys];
        clip.curveDatas = {
            '/': {
                comps: {
                    // component
                    'cc.Sprite': {
                        // component properties
                        spriteFrame: {
                            keys: 0,
                            values,
                        },
                    },
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
    public wrapMode = AnimationWrapMode.Normal;

    /**
     * !#en Curve data.
     * !#zh 曲线数据。
     * @example {@link cocos2d/core/animation-clip/curve-data.js}
     */
    @property({visible: false})
    public curveDatas: { [path: string]: ICurveData; } = {};

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

    @property
    private _keys: number[][] = [];

    private _ratioSamplers: RatioSampler[] = [];

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

        if (propertyCurveData.keys >= 0) {
            curve.ratioSampler = this._ratioSamplers[propertyCurveData.keys];
        } else {
            curve.ratioSampler = null;
        }
        curve.values = propertyCurveData.values;

        const getCurveType = (easingMethod: EasingMethod) => {
            if (typeof easingMethod === 'string') {
                return easingMethod;
            } else if (Array.isArray(easingMethod)) {
                if (easingMethod[0] === easingMethod[1] &&
                    easingMethod[2] === easingMethod[3]) {
                    return DynamicAnimCurve.Linear;
                } else {
                    return DynamicAnimCurve.Bezier(easingMethod);
                }
            } else {
                return DynamicAnimCurve.Linear;
            }
        };
        if (propertyCurveData.easingMethod !== undefined) {
            curve.type = getCurveType(propertyCurveData.easingMethod);
        } else if (propertyCurveData.easingMethods !== undefined) {
            curve.types = propertyCurveData.easingMethods.map(getCurveType);
        } else {
            curve.type = null;
        }

        if (isMotionPathProp) {
            sampleMotionPaths(motionPaths, curve, this.duration, this.sample, target);
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
        if (target instanceof Node) {
            switch (propPath) {
                case 'position':
                    curve._blendFunction = blending.additive3D;
                    break;
                case 'scale':
                    curve._blendFunction = blending.additive3D;
                    break;
                case 'rotation':
                    curve._blendFunction = blending.additiveQuat;
                    break;
            }
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

    public createCurves (state: AnimationState, root: Node) {
        this._ratioSamplers = this._keys.map(
            (keys) => new RatioSampler(
                keys.map(
                    (key) => key / this._duration)));
        const curves: DynamicAnimCurve[] = [];
        for (const path of Object.keys(this.curveDatas)) {
            const target = find(path, root);
            if (!target) {
                continue;
            }
            const curveData = this.curveDatas[path];
            this.createTargetCurves(target, curveData, curves);
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
