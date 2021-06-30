/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module animation
 */

import { EDITOR } from 'internal:constants';
import { ccclass, serializable } from 'cc.decorator';
import { Asset } from '../assets/asset';
import { SpriteFrame } from '../../2d/assets/sprite-frame';
import { CompactValueTypeArray } from '../data/utils/compact-value-type-array';
import { errorID } from '../platform/debug';
import { DataPoolManager } from '../../3d/skeletal-animation/data-pool-manager';
import { binarySearchEpsilon } from '../algorithm/binary-search';
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';
import { AnimCurve, IPropertyCurveData, RatioSampler } from './animation-curve';
import { SkelAnimDataHub } from '../../3d/skeletal-animation/skeletal-animation-data-hub';
import { ComponentPath, HierarchyPath, TargetPath } from './target-path';
import { WrapMode as AnimationWrapMode } from './types';
import { IValueProxyFactory } from './value-proxy';
import { legacyCC } from '../global-exports';
import { GarbageCollectorContext } from '../data/garbage-collection';
import { GCObject } from '../data/gc-object';

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

export type IRuntimeCurve = Pick<AnimationClip.ICurve, 'modifiers' | 'valueAdapter' | 'commonTarget'> & {
    /**
     * 属性曲线。
     */
    curve: AnimCurve;

    /**
     * 曲线采样器。
     */
    sampler: RatioSampler | null;
};

export interface IAnimationEvent {
    functionName: string;
    parameters: string[];
}

export interface IAnimationEventGroup {
    events: IAnimationEvent[];
}

export declare namespace AnimationClip {
    export type PropertyCurveData = IPropertyCurveData;

    export interface ICurve {
        commonTarget?: number;
        modifiers: TargetPath[];
        valueAdapter?: IValueProxyFactory;
        data: PropertyCurveData;
    }

    export interface ICommonTarget {
        modifiers: TargetPath[];
        valueAdapter?: IValueProxyFactory;
    }

    export interface IEvent {
        frame: number;
        func: string;
        params: any[];
    }

    export namespace _impl {
        type MaybeCompactCurve = Omit<AnimationClip.ICurve, 'data'> & {
            data: Omit<AnimationClip.PropertyCurveData, 'values'> & {
                values: any[] | CompactValueTypeArray;
            };
        };

        type MaybeCompactKeys = Array<number[] | CompactValueTypeArray>;
    }
}

/**
 * @zh 动画剪辑表示一段使用动画编辑器编辑的关键帧动画或是外部美术工具生产的骨骼动画。
 * 它的数据主要被分为几层：轨道、关键帧和曲线。
 * @en The animation clip represents a sequence of key frame animation created with the animation editor or skeletal animation other DCC tools.
 * The data is divided in different levels: tracks, key frames, curves.
 */
@ccclass('cc.AnimationClip')
export class AnimationClip extends Asset {
    public static WrapMode = AnimationWrapMode;

    /**
     * @en Crate clip with a set of sprite frames
     * @zh 使用一组序列帧图片来创建动画剪辑
     * @example
     * ```
     * import { AnimationClip } from 'cc';
     * const clip = AnimationClip.createWithSpriteFrames(spriteFrames, 10);
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
                new ComponentPath('cc.Sprite'),
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
     * @zh 动画帧率，单位为帧/秒。注意此属性仅用于编辑器动画编辑。
     * @en Animation frame rate: frames per second.
     * Note this property is only used for animation editing in Editor.
     */
    @serializable
    public sample = 60;

    /**
     * @zh 动画的播放速度。
     * @en Animation playback speed.
     */
    @serializable
    public speed = 1;

    /**
     * @zh 动画的循环模式。
     * @en Animation loop mode.
     */
    @serializable
    public wrapMode = AnimationWrapMode.Normal;

    /**
     * @zh 动画包含的事件数据。
     * @en Associated event data.
     */
    @serializable
    public events: AnimationClip.IEvent[] = [];

    /**
     * Sets if node TRS curves in this animation can be blended.
     * Normally this flag is enabled for model animation and disabled for other case.
     * @internal This is an internal slot. Never use it in your code.
     */
    @serializable
    public enableTrsBlending = false;

    @serializable
    private _duration = 0;

    @serializable
    private _keys: number[][] = [];

    @serializable
    private _stepness = 0;

    @serializable
    private _curves: AnimationClip.ICurve[] = [];

    @serializable
    private _commonTargets: AnimationClip.ICommonTarget[] = [];

    @serializable
    private _hash = 0;

    private frameRate = 0;
    private _ratioSamplers: RatioSampler[] = [];
    private _runtimeCurves?: IRuntimeCurve[];
    private _runtimeEvents?: {
        ratios: number[];
        eventGroups: IAnimationEventGroup[];
    };

    private _data: Uint8Array | null = null;

    /**
     * @zh 动画的周期。
     * @en Animation duration.
     */
    get duration () {
        return this._duration;
    }

    set duration (value) {
        this._duration = value;
    }

    /**
     * @zh 曲线可引用的所有时间轴。
     * @en Frame keys referenced by curves.
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
    get eventGroups (): readonly IAnimationEventGroup[] {
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
        // hashes should already be computed offline, but if not, make one
        if (this._hash) { return this._hash; }
        const data = this._nativeAsset;
        const buffer = new Uint8Array(ArrayBuffer.isView(data) ? data.buffer : data);
        return this._hash = murmurhash2_32_gc(buffer, 666);
    }

    get curves () {
        return this._curves;
    }

    set curves (value) {
        this._curves = value;
        delete this._runtimeCurves;
    }

    /**
     * 此动画的数据。
     */
    get data () {
        return this._data;
    }

    get commonTargets () {
        return this._commonTargets;
    }

    set commonTargets (value) {
        this._commonTargets = value;
    }

    public onLoaded () {
        this.frameRate = this.sample;
        this._decodeCVTAs();
    }

    public getPropertyCurves (): readonly IRuntimeCurve[] {
        if (!this._runtimeCurves) {
            this._createPropertyCurves();
        }
        return this._runtimeCurves!;
    }

    /**
     * @zh 提交事件数据的修改。
     * 当你修改了 `this.events` 时，必须调用 `this.updateEventDatas()` 使修改生效。
     * @en
     * Commit event data update.
     * You should call this function after you changed the `events` data to take effect.
     * @internal
     */
    public updateEventDatas () {
        delete this._runtimeEvents;
    }

    /**
     * @en Gets the event group shall be processed at specified ratio.
     * @zh 获取事件组应按指定比例处理。
     * @param ratio The ratio.
     * @internal
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
     * @en Returns if this animation contains event data.
     * @protected
     */
    public hasEvents () {
        return this.events.length !== 0;
    }

    public destroy () {
        if (legacyCC.director.root.dataPoolManager) {
            (legacyCC.director.root.dataPoolManager as DataPoolManager).releaseAnimationClip(this);
        }
        SkelAnimDataHub.destroy(this);
        return super.destroy();
    }

    protected _createPropertyCurves () {
        this._ratioSamplers = this._keys.map(
            (keys) => new RatioSampler(
                keys.map(
                    (key) => key / this._duration,
                ),
            ),
        );

        this._runtimeCurves = this._curves.map((targetCurve): IRuntimeCurve => ({
            curve: new AnimCurve(targetCurve.data, this._duration),
            modifiers: targetCurve.modifiers,
            valueAdapter: targetCurve.valueAdapter,
            sampler: this._ratioSamplers[targetCurve.data.keys],
            commonTarget: targetCurve.commonTarget,
        }));

        this._applyStepness();
    }

    protected _createRuntimeEvents () {
        if (EDITOR && !legacyCC.GAME_VIEW) {
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
        // for (const propertyCurve of this._propertyCurves) {
        //     propertyCurve.curve.stepfy(this._stepness);
        // }
    }

    private _decodeCVTAs () {
        const binaryBuffer: ArrayBuffer = ArrayBuffer.isView(this._nativeAsset) ? this._nativeAsset.buffer : this._nativeAsset;
        if (!binaryBuffer) {
            return;
        }

        const maybeCompressedKeys = this._keys as AnimationClip._impl.MaybeCompactKeys;
        for (let iKey = 0; iKey < maybeCompressedKeys.length; ++iKey) {
            const keys = maybeCompressedKeys[iKey];
            if (keys instanceof CompactValueTypeArray) {
                maybeCompressedKeys[iKey] = keys.decompress(binaryBuffer);
            }
        }

        for (let iCurve = 0; iCurve < this._curves.length; ++iCurve) {
            const curve = this._curves[iCurve] as AnimationClip._impl.MaybeCompactCurve;
            if (curve.data.values instanceof CompactValueTypeArray) {
                curve.data.values = curve.data.values.decompress(binaryBuffer);
            }
        }
    }

    public markDependencies (context: GarbageCollectorContext) {
        for (let i = 0, length = this.curves.length; i < length; i++) {
            this.curves[i].data.values.forEach((value) => {
                if (value instanceof GCObject) {
                    context.markGCObject(value);
                }
            });
        }
    }

    public validate () {
        return this.keys.length > 0 && this.curves.length > 0;
    }
}

legacyCC.AnimationClip = AnimationClip;
