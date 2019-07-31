
/**
 * @category animation
 */

import { Asset, SpriteFrame } from '../assets';
import { ccclass, property } from '../core/data/class-decorator';
import { errorID } from '../core/platform/CCDebug';
import binarySearchEpsilon from '../core/utils/binary-search';
import { AnimCurve, IPropertyCurveData, RatioSampler } from './animation-curve';
import { WrapMode as AnimationWrapMode } from './types';
import { INode } from '../core/utils/interfaces';
import { murmurhash2_32_gc } from '../core/utils/murmurhash2_gc';

interface IAnimationEventData {
    frame: number;
    func: string;
    params: string[];
}

export interface IObjectCurveData {
    [propertyName: string]: IPropertyCurveData;
}

export interface IComponentsCurveData {
    [componentName: string]: IObjectCurveData;
}

export interface INodeCurveData {
    props?: IObjectCurveData;
    comps?: IComponentsCurveData;
}

export interface ICurveData {
    [path: string]: INodeCurveData;
}

export interface IKeySharedCurveData {
    keys: number[][];
    curves: ICurveData;
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

    /**
     * 曲线采样器。
     */
    sampler: RatioSampler | null;
}

export interface IAnimationEvent {
    functionName: string;
    parameters: string[];
}

export interface IAnimationEventGroup {
    events: IAnimationEvent[];
}

/**
 * 动画剪辑。
 */
@ccclass('cc.AnimationClip')
export class AnimationClip extends Asset {
    public static WrapMode = AnimationWrapMode;

    /**
     * @en Crate clip with a set of sprite frames
     * @zh 使用一组序列帧图片来创建动画剪辑
     * @example
     * ```
     * const clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 10);
     * ```
     */
    public static createWithSpriteFrames (spriteFrames: SpriteFrame[], sample: number) {
        if (!Array.isArray(spriteFrames)) {
            errorID(3905);
            return null;
        }

        const clip = new AnimationClip();
        clip.sample = sample || clip.sample;

        clip.duration = spriteFrames.length / clip.sample;
        const step = 1 / clip.sample;
        const keys = new Array<number>(spriteFrames.length);
        const values = new Array<SpriteFrame>(keys.length);
        for (let i = 0; i < spriteFrames.length; i++) {
            keys[i] = i * step;
            values[i] = spriteFrames[i];
        }
        clip.keys = [keys];
        clip.curveDatas = {
            '/': {
                comps: {
                    // component
                    'cc.SpriteComponent': {
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
     * 动画帧率，单位为帧/秒。
     */
    @property
    public sample = 60;

    /**
     * 动画的播放速度。
     */
    @property
    public speed = 1;

    /**
     * 动画的循环模式。
     */
    @property
    public wrapMode = AnimationWrapMode.Normal;

    /**
     * 动画的曲线数据。
     */
    @property
    public curveDatas: ICurveData = {};

    /**
     * 动画包含的事件数据。
     */
    @property({visible: false})
    public events: IAnimationEventData[] = [];

    @property
    protected _duration = 0;

    @property
    protected _keys: number[][] = [];

    protected _ratioSamplers: RatioSampler[] = [];

    protected _propertyCurves?: IPropertyCurve[];

    protected _runtimeEvents?: {
        ratios: number[];
        eventGroups: IAnimationEventGroup[];
    };

    protected frameRate = 0;

    @property
    protected _stepness = 0;

    protected _hash = 0;

    /**
     * 动画的周期。
     */
    get duration () {
        return this._duration;
    }

    set duration (value) {
        this._duration = value;
    }

    /**
     * 动画所有时间轴。
     */
    get keys () {
        return this._keys;
    }

    set keys (value) {
        this._keys = value;
    }

    /**
     * @protected
     */
    get eventGroups (): ReadonlyArray<IAnimationEventGroup> {
        if (!this._runtimeEvents) {
            this._createRuntimeEvents();
        }
        return this._runtimeEvents!.eventGroups;
    }

    /**
     * @protected
     */
    get stepness () {
        return this._stepness;
    }

    /**
     * @protected
     */
    set stepness (value) {
        this._stepness = value;
        this._applyStepness();
    }

    get hash () {
        return this._hash;
    }

    public onLoad () {
        this.duration = this._duration;
        this.speed = this.speed;
        this.wrapMode = this.wrapMode;
        this.frameRate = this.sample;
        this._hash = murmurhash2_32_gc(`${this._uuid} ${this._duration} ${this._keys[0] && this._keys[0].length}`, 666);
    }

    public getPropertyCurves (root: INode): ReadonlyArray<IPropertyCurve> {
        if (!this._propertyCurves) {
            this._createPropertyCurves();
        }
        return this._propertyCurves!;
    }

    /**
     * 提交曲线数据的修改。
     * 当你修改了 `this.curveDatas`、`this.keys` 或 `this.duration`时，
     * 必须调用 `this.updateCurveDatas()` 使修改生效。
     */
    public updateCurveDatas () {
        delete this._propertyCurves;
    }

    /**
     * 提交事件数据的修改。
     * 当你修改了 `this.events` 时，必须调用 `this.updateEventDatas()` 使修改生效。
     * @protected
     */
    public updateEventDatas () {
        delete this._runtimeEvents;
    }

    /**
     * Gets the event group shall be processed at specified ratio.
     * @param ratio The ratio.
     * @protected
     */
    public getEventGroupIndexAtRatio (ratio: number): number {
        if (!this._runtimeEvents) {
            this._createRuntimeEvents();
        }
        const result = binarySearchEpsilon(this._runtimeEvents!.ratios, ratio);
        return result;
    }

    /**
     * 返回本动画是否包含事件数据。
     * @protected
     */
    public hasEvents () {
        return this.events.length !== 0;
    }

    protected _createPropertyCurves () {
        this._ratioSamplers = this._keys.map(
            (keys) => new RatioSampler(
                keys.map(
                    (key) => key / this._duration)));

        this._propertyCurves = [];
        for (const curveTargetPath of Object.keys(this.curveDatas)) {
            const nodeData = this.curveDatas[curveTargetPath];
            if (nodeData.props) {
                for (const nodePropertyName of Object.keys(nodeData.props)) {
                    const propertyCurveData = nodeData.props[nodePropertyName];
                    this._propertyCurves.push({
                        path: curveTargetPath,
                        propertyName: nodePropertyName,
                        curve: new AnimCurve(propertyCurveData, nodePropertyName, this._duration, true),
                        sampler: propertyCurveData.keys >= 0 ? this._ratioSamplers[propertyCurveData.keys] : null,
                    });
                }
            }
            if (nodeData.comps) {
                for (const componentName of Object.keys(nodeData.comps)) {
                    const componentData = nodeData.comps[componentName];
                    for (const componentPropertyName of Object.keys(componentData)) {
                        const propertyCurveData = componentData[componentPropertyName];
                        this._propertyCurves.push({
                            path: curveTargetPath,
                            component: componentName,
                            propertyName: componentPropertyName,
                            curve: new AnimCurve(propertyCurveData, componentPropertyName, this._duration, false),
                            sampler: propertyCurveData.keys >= 0 ? this._ratioSamplers[propertyCurveData.keys] : null,
                        });
                    }
                }
            }
        }
        this._applyStepness();
    }

    protected _createRuntimeEvents () {
        if (CC_EDITOR) {
            return;
        }

        const ratios: number[] = [];
        const eventGroups: IAnimationEventGroup[] = [];
        const events = this.events.sort((a, b) => a.frame - b.frame);
        for (const eventData of events) {
            const ratio = eventData.frame / this._duration;
            let i = ratios.findIndex((r) => r === ratio);
            if (i < 0) {
                i = ratios.length;
                ratios.push(ratio);
                eventGroups.push({
                    events: [],
                });
            }
            eventGroups[i].events.push({
                functionName: eventData.func,
                parameters: eventData.params,
            });
        }

        this._runtimeEvents = {
            ratios,
            eventGroups,
        };
    }

    protected _applyStepness () {
        if (!this._propertyCurves) {
            return;
        }
        // for (const propertyCurve of this._propertyCurves) {
        //     propertyCurve.curve.stepfy(this._stepness);
        // }
    }
}

cc.AnimationClip = AnimationClip;
