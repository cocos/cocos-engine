
/**
 * @category animation
 */

import { Asset } from '../assets/asset';
import { SpriteFrame } from '../assets/sprite-frame';
import { ccclass, property } from '../data/class-decorator';
import { errorID } from '../platform/debug';
import binarySearchEpsilon from '../utils/binary-search';
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';
import { AnimCurve, CurveValueAdapter, IPropertyCurveData, RatioSampler } from './animation-curve';
import { ComponentModifier, HierachyModifier, TargetModifier } from './target-modifier';
import { WrapMode as AnimationWrapMode } from './types';

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

export interface IRuntimeCurve {
    /**
     * 属性曲线。
     */
    curve: AnimCurve;

    /**
     * 目标修改器。
     */
    modifiers: TargetModifier[];

    /**
     * 曲线值适配器。
     */
    valueAdapter?: CurveValueAdapter;

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

export declare namespace AnimationClip {
    export interface ICurveData {
        [path: string]: INodeCurveData;
    }

    export type PropertyCurveData = IPropertyCurveData;

    export interface ICurve {
        modifiers: TargetModifier[];
        valueAdapter?: CurveValueAdapter;
        data: PropertyCurveData;
    }

    export interface IEvent {
        frame: number;
        func: string;
        params: string[];
    }
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
        clip.curves = [{
            modifiers: [
                new ComponentModifier('cc.SpriteComponent'),
                'spriteFrame',
            ],
            data: {
                keys: 0,
                values,
            },
        }];

        return clip;
    }

    /**
     * @zh 动画帧率，单位为帧/秒。
     */
    @property
    public sample = 60;

    /**
     * @zh 动画的播放速度。
     */
    @property
    public speed = 1;

    /**
     * @zh 动画的循环模式。
     */
    @property
    public wrapMode = AnimationWrapMode.Normal;

    /**
     * @zh 动画包含的事件数据。
     */
    @property({visible: false})
    public events: AnimationClip.IEvent[] = [];

    @property
    private _duration = 0;

    @property
    private _keys: number[][] = [];

    @property
    private _stepness = 0;

    /**
     * @zh 动画的曲线数据。
     * @deprecated 请转用 `this.curves`
     */
    @property
    private curveDatas?: AnimationClip.ICurveData = {};

    @property
    private _curves: AnimationClip.ICurve[] = [];

    private _hash = 0;
    private frameRate = 0;
    private _ratioSamplers: RatioSampler[] = [];
    private _runtimeCurves?: IRuntimeCurve[];
    private _runtimeEvents?: {
        ratios: number[];
        eventGroups: IAnimationEventGroup[];
    };

    /**
     * @zh 动画的周期。
     */
    get duration () {
        return this._duration;
    }

    set duration (value) {
        this._duration = value;
    }

    /**
     * @zh 动画所有时间轴。
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
        if (!this._hash) { this._hash = murmurhash2_32_gc(JSON.stringify(this._curves), 666); }
        return this._hash;
    }

    get curves () {
        return this._curves;
    }

    set curves (value) {
        this._curves = value;
        delete this._runtimeCurves;
    }

    public onLoaded () {
        this.frameRate = this.sample;
        this._migrateCurveDatas();
    }

    public getPropertyCurves (): ReadonlyArray<IRuntimeCurve> {
        if (!this._runtimeCurves) {
            this._createPropertyCurves();
        }
        return this._runtimeCurves!;
    }

    /**
     * @zh 提交曲线数据的修改。<br/>
     * 当你修改了 `this.curveDatas`、`this.keys` 或 `this.duration`时，<br/>
     * 必须调用 `this.updateCurveDatas()` 使修改生效。
     * @deprecated
     */
    public updateCurveDatas () {
        this._migrateCurveDatas();
        delete this._runtimeCurves;
    }

    /**
     * @zh 提交事件数据的修改。<br/>
     * 当你修改了 `this.events` 时，必须调用 `this.updateEventDatas()` 使修改生效。
     * @protected
     */
    public updateEventDatas () {
        delete this._runtimeEvents;
    }

    /**
     * @en Gets the event group shall be processed at specified ratio.
     * @zh 获取事件组应按指定比例处理。
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
     * @zh 返回本动画是否包含事件数据。
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

        this._runtimeCurves = this._curves.map((targetCurve): IRuntimeCurve => {
            return {
                curve: new AnimCurve(targetCurve.data, this._duration),
                modifiers: targetCurve.modifiers,
                valueAdapter: targetCurve.valueAdapter,
                sampler: this._ratioSamplers[targetCurve.data.keys],
            };
        });

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
        if (!this._runtimeCurves) {
            return;
        }
        // for (const propertyCurve of this._propertyCurves) {
        //     propertyCurve.curve.stepfy(this._stepness);
        // }
    }

    private _migrateCurveDatas () {
        if (!this.curveDatas) {
            return;
        }
        for (const curveTargetPath of Object.keys(this.curveDatas)) {
            const hierachyModifier = new HierachyModifier();
            hierachyModifier.path = curveTargetPath;
            const nodeData = this.curveDatas[curveTargetPath];
            if (nodeData.props) {
                for (const nodePropertyName of Object.keys(nodeData.props)) {
                    const propertyCurveData = nodeData.props[nodePropertyName];
                    this._curves.push({
                        modifiers: [ hierachyModifier, nodePropertyName ],
                        data: propertyCurveData,
                    });
                }
            }
            if (nodeData.comps) {
                for (const componentName of Object.keys(nodeData.comps)) {
                    const componentModifier = new ComponentModifier();
                    componentModifier.component = componentName;
                    const componentData = nodeData.comps[componentName];
                    for (const componentPropertyName of Object.keys(componentData)) {
                        const propertyCurveData = componentData[componentPropertyName];
                        this._curves.push({
                            modifiers: [ hierachyModifier, componentModifier, componentPropertyName ],
                            data: propertyCurveData,
                        });
                    }
                }
            }
        }
        delete this.curveDatas;
    }
}

cc.AnimationClip = AnimationClip;
