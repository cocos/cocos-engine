import { Asset, SpriteFrame } from '../assets';
import { ccclass, property } from '../core/data/class-decorator';
import { errorID } from '../core/platform/CCDebug';
import { AnimCurve, PropertyCurveData, RatioSampler } from './animation-curve';
import { WrapMode as AnimationWrapMode } from './types';

interface IAnimationEvent {
    frame: number;
    func: string;
    params: string[];
}

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

export interface IPropertyCurve {
    /**
     * 结点路径。
     */
    path: string;

    /**
     * 组件名称。
     */
    component?: string;

    /**
     * 属性名称。
     */
    propertyName: string;

    /**
     * 属性曲线。
     */
    curve: AnimCurve;
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

    private _propertyCurves?: IPropertyCurve[];

    private frameRate = 0;

    @property
    private _stepness = 0;

    get propertyCurves (): ReadonlyArray<IPropertyCurve> {
        if (!this._propertyCurves) {
            this._createPropertyCurves();
        }
        return this._propertyCurves!;
    }

    get stepness () {
        return this._stepness;
    }

    set stepness (value) {
        this._stepness = value;
        this._applyStepness();
    }

    public onLoad () {
        this._duration = this.duration;
        this.speed = this.speed;
        this.wrapMode = this.wrapMode;
        this.frameRate = this.sample;
    }

    /**
     * Call it when you modify `this.curveDatas`;
     */
    public updateCurveDatas () {
        delete this._propertyCurves;
    }

    private _createPropertyCurves () {
        this._ratioSamplers = this._keys.map(
            (keys) => new RatioSampler(
                keys.map(
                    (key) => key / this._duration)));

        this._propertyCurves = [];
        for (const curveTargetPath of Object.keys(this.curveDatas)) {
            const nodeData = this.curveDatas[curveTargetPath];
            if (nodeData.props) {
                for (const nodePropertyName of Object.keys(nodeData.props)) {
                    this._propertyCurves.push({
                        path: curveTargetPath,
                        propertyName: nodePropertyName,
                        curve: this._createCurve(nodeData.props[nodePropertyName], nodePropertyName, true),
                    });
                }
            }
            if (nodeData.comps) {
                for (const componentName of Object.keys(nodeData.comps)) {
                    const componentData = nodeData.comps[componentName];
                    for (const componentPropertyName of Object.keys(componentData)) {
                        this._propertyCurves.push({
                            path: curveTargetPath,
                            component: componentName,
                            propertyName: componentPropertyName,
                            curve: this._createCurve(componentData[componentPropertyName], componentPropertyName, false),
                        });
                    }
                }
            }
        }
        this._applyStepness();
    }

    private _createCurve (propertyCurveData: PropertyCurveData, propertyName: string, isNode: boolean) {
        let ratioSampler: null | RatioSampler = null;
        if (propertyCurveData.keys >= 0) {
            ratioSampler = this._ratioSamplers[propertyCurveData.keys];
        }
        return new AnimCurve(propertyCurveData, propertyName, isNode, ratioSampler);
    }

    private _applyStepness () {
        if (!this._propertyCurves) {
            return;
        }
        for (const propertyCurve of this._propertyCurves) {
            propertyCurve.curve.stepfy(this._stepness);
        }
    }
}

cc.AnimationClip = AnimationClip;
