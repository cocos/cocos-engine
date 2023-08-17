/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, serializable, uniquelyReferenced } from 'cc.decorator';
import { SUPPORT_JIT } from 'internal:constants';
import type { Component } from '../../scene-graph/component';
import { error, ObjectCurve, QuatCurve, RealCurve, errorID, warnID, js } from '../../core';
import { assertIsTrue } from '../../core/data/utils/asserts';

import { Node } from '../../scene-graph';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import type { AnimationMask } from '../marionette/animation-mask';
import { PoseOutput } from '../pose-output';
import { ComponentPath, HierarchyPath, isPropertyPath, TargetPath } from '../target-path';
import { IValueProxyFactory } from '../value-proxy';
import { Range } from './utils';

export const normalizedFollowTag = Symbol('NormalizedFollow');

const parseTrsPathTag = Symbol('ConvertAsTrsPath');

export const trackBindingTag = Symbol('TrackBinding');

export interface RuntimeBinding<T = unknown> {
    setValue(value: T): void;

    getValue?(): T;
}

export type Binder = (binding: TrackBinding) => undefined | RuntimeBinding;

export type TrsTrackPath = [HierarchyPath, 'position' | 'rotation' | 'scale' | 'eulerAngles'];

/**
 * @en Describes how to find the animation target.
 * @zh 描述怎样寻址动画目标。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TrackPath`)
class TrackPath {
    /**
     * @en The length of the path.
     * @zh 此路径的段数。
     */
    get length (): number {
        return this._paths.length;
    }

    /**
     * @en Appends a property path.
     * @zh 附加一段属性路径。
     * @param name The property's name.
     * @returns `this`
     */
    public toProperty (name: string): TrackPath {
        this._paths.push(name);
        return this;
    }

    /**
     * @en Appends an array element path.
     * @zh 附加一段数组元素路径。
     * @param index The element's index.
     * @returns `this`
     */
    public toElement (index: number): TrackPath {
        this._paths.push(index);
        return this;
    }

    /**
     * @en Appends a hierarchy path.
     * @zh 附加一段层级路径。
     * @param nodePath Path to the children.
     * @returns `this`
     */
    public toHierarchy (nodePath: string): TrackPath {
        this._paths.push(new HierarchyPath(nodePath));
        return this;
    }

    /**
     * @en Appends a component path.
     * @zh 附加一段组件路径。
     * @param constructor @en The constructor of the component. @zh 组件的构造函数。
     * @returns `this`
     */
    public toComponent<T extends Component> (constructor: Constructor<T> | string): TrackPath {
        const path = new ComponentPath(typeof constructor === 'string' ? constructor : js.getClassName(constructor));
        this._paths.push(path);
        return this;
    }

    /**
     * @internal Reserved for backward compatibility. DO NOT USE IT IN YOUR CODE.
     */
    public toCustomized (resolver: CustomizedTrackPathResolver): TrackPath {
        this._paths.push(resolver);
        return this;
    }

    /**
     * @en Appends paths to this path.
     * @zh 附加指定路径到此路径后。
     * @param trackPaths Paths to append.
     * @returns `this`.
     */
    public append (...trackPaths: TrackPath[]): TrackPath {
        const paths = this._paths.concat(...trackPaths.map((trackPath): TargetPath[] => trackPath._paths));
        this._paths = paths;
        return this;
    }

    /**
     * @zh 判断指定路径段是否是属性路径。
     * @en Decides if the specific path segment is property path.
     * @param index Index to the segment。
     * @returns The judgement result.
     */
    public isPropertyAt (index: number): boolean {
        return typeof (this._paths[index]) === 'string';
    }

    /**
     * @zh 将指定路径段视为属性路径，获取其描述的属性。
     * @en Treats the path segment as a property path. Obtains the property it describes.
     * @param index Index to the segment。
     * @returns The property.
     */
    public parsePropertyAt (index: number): string {
        return this._paths[index] as string;
    }

    /**
     * @zh 判断指定路径段是否是数组元素路径。
     * @en Decides if the specific path segment is an array element path.
     * @param index Index to the segment。
     * @returns The judgement result.
     */
    public isElementAt (index: number): boolean {
        return typeof this._paths[index] === 'number';
    }

    /**
     * @zh 将指定路径段视为数组元素路径，获取其描述的数组元素。
     * @en Treats the path segment as an array element path. Obtains the element index it describes.
     * @param index Index to the segment。
     * @returns The element index.
     */
    public parseElementAt (index: number): number {
        return this._paths[index] as number;
    }

    /**
     * @zh 判断指定路径段是否是层级路径。
     * @en Decides if the specific path segment is a hierarchy path.
     * @param index Index to the segment。
     * @returns The judgement result.
     */
    public isHierarchyAt (index: number): boolean {
        return this._paths[index] instanceof HierarchyPath;
    }

    /**
     * @zh 将指定路径段视为层级路径，获取其描述的层级路径。
     * @en Treats the path segment as a hierarchy path. Obtains the hierarchy path it describes.
     * @param index Index to the segment。
     * @returns The hierarchy path.
     */
    public parseHierarchyAt (index: number): string {
        assertIsTrue(this.isHierarchyAt(index));
        return (this._paths[index] as HierarchyPath).path;
    }

    /**
     * @zh 判断指定路径段是否是组件路径。
     * @en Decides if the specific path segment is a component path.
     * @param index Index to the segment。
     * @returns The judgement result.
     */
    public isComponentAt (index: number): boolean {
        return this._paths[index] instanceof ComponentPath;
    }

    /**
     * @zh 将指定路径段视为组件路径，获取其描述的组件路径。
     * @en Treats the path segment as a hierarchy path. Obtains the component path it describes.
     * @param index Index to the segment。
     * @returns The component path.
     */
    public parseComponentAt (index: number): string {
        assertIsTrue(this.isComponentAt(index));
        return (this._paths[index] as ComponentPath).component;
    }

    /**
     * @en Slices a interval of the path.
     * @zh 分割指定区段上的路径。
     * @param beginIndex Begin index to the segment. Default to 0.
     * @param endIndex End index to the segment. Default to the last segment.
     * @returns The new path.
     */
    public slice (beginIndex?: number, endIndex?: number): TrackPath {
        const trackPath = new TrackPath();
        trackPath._paths = this._paths.slice(beginIndex, endIndex);
        return trackPath;
    }

    /**
     * @internal
     */
    public trace (object: unknown, beginIndex?: number, endIndex?: number): unknown {
        beginIndex ??= 0;
        endIndex ??= this._paths.length;
        return this[normalizedFollowTag](object, beginIndex, endIndex);
    }

    /**
     * @internal
     */
    public [parseTrsPathTag] (): { node: string; property: "position" | "scale" | "rotation" | "eulerAngles"; } | null {
        const { _paths: paths } = this;
        const nPaths = paths.length;

        let iPath = 0;

        let nodePath = '';
        for (; iPath < nPaths; ++iPath) {
            const path = paths[iPath];
            if (!(path instanceof HierarchyPath)) {
                break;
            } else if (!path.path) {
                continue;
            }  else if (nodePath) {
                nodePath += `/${path.path}`;
            } else {
                nodePath = path.path;
            }
        }

        if (iPath === nPaths) {
            return null;
        }

        let prs: 'position' | 'scale' | 'rotation' | 'eulerAngles';
        if (iPath !== nPaths - 1) {
            return null;
        }

        switch (paths[iPath]) {
        case 'position':
        case 'scale':
        case 'rotation':
        case 'eulerAngles':
            prs = paths[iPath] as typeof prs;
            break;
        default:
            return null;
        }

        return { node: nodePath, property: prs };
    }

    /**
     * @internal
     */
    public [normalizedFollowTag] (root: unknown, beginIndex: number, endIndex: number): unknown {
        const { _paths: paths } = this;
        let result = root;
        for (let iPath = beginIndex; iPath < endIndex; ++iPath) {
            const path = paths[iPath];
            if (isPropertyPath(path)) {
                if (!(path in (result as any))) {
                    warnID(3929, path);
                    return null;
                } else {
                    result = (result as any)[path];
                }
            } else {
                result = path.get(result);
            }
            if (result === null) {
                break;
            }
        }
        return result;
    }

    @serializable
    private _paths: TargetPath[] = [];
}

interface AnimationFunction {
    getValue: () => any;
    setValue: (val: any) => void
}

/**
 * Composite of track path and value proxy.
 * Not exposed to external. If there is any reason it should be exposed,
 * please redesign the public interfaces.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}TrackBinding`)
@uniquelyReferenced
export class TrackBinding {
    @serializable
    public path: Readonly<TrackPath> = new TrackPath();

    @serializable
    public proxy: IValueProxyFactory | undefined;

    private static _animationFunctions = new WeakMap<Constructor, Map<string | number, AnimationFunction>>();

    public parseTrsPath (): { node: string; property: "position" | "scale" | "rotation" | "eulerAngles"; } | null {
        if (this.proxy) {
            return null;
        } else {
            return this.path[parseTrsPathTag]();
        }
    }

    public createRuntimeBinding (target: unknown, poseOutput: PoseOutput | undefined, isConstant: boolean): RuntimeBinding<unknown> | { target: any; setValue: any; getValue: any; } | null {
        const { path, proxy } = this;
        const nPaths = path.length;
        const iLastPath = nPaths - 1;
        if (nPaths !== 0 && (path.isPropertyAt(iLastPath) || path.isElementAt(iLastPath)) && !proxy) {
            const lastPropertyKey = path.isPropertyAt(iLastPath)
                ? path.parsePropertyAt(iLastPath)
                : path.parseElementAt(iLastPath);
            const resultTarget = path[normalizedFollowTag](target, 0, nPaths - 1) as any;
            if (resultTarget === null) {
                return null;
            }
            if (poseOutput && resultTarget instanceof Node && isTrsPropertyName(lastPropertyKey)) {
                const blendStateWriter = poseOutput.createPoseWriter(resultTarget, lastPropertyKey, isConstant);
                return blendStateWriter;
            }
            let setValue; let getValue;
            if (SUPPORT_JIT) {
                let animationFunction = TrackBinding._animationFunctions.get(resultTarget.constructor);
                if (!animationFunction) {
                    animationFunction = new Map();
                    TrackBinding._animationFunctions.set(resultTarget.constructor, animationFunction);
                }

                let accessor = animationFunction.get(lastPropertyKey);
                if (!accessor) {
                    accessor = {
                        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
                        setValue: Function('value', `this.target.${lastPropertyKey} = value;`) as (val: any) => void,
                        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
                        getValue: Function(`return this.target.${lastPropertyKey};`) as () => any,
                    };
                    animationFunction.set(lastPropertyKey, accessor);
                }
                setValue = accessor.setValue;
                getValue = accessor.getValue;
            } else {
                setValue = (value: unknown): void => {
                    resultTarget[lastPropertyKey] = value;
                };
                getValue = (): unknown => resultTarget[lastPropertyKey] as unknown;
            }
            return {
                target: resultTarget,
                setValue,
                getValue,
            };
        } else if (!proxy) {
            errorID(3921);
            return null;
        } else {
            const resultTarget = path[normalizedFollowTag](target, 0, nPaths);
            if (resultTarget === null) {
                return null;
            }
            const runtimeProxy = proxy.forTarget(resultTarget);
            if (!runtimeProxy) {
                return null;
            }
            const binding: RuntimeBinding = {
                setValue: (value): void => {
                    runtimeProxy.set(value);
                },
            };
            const proxyGet = runtimeProxy.get;
            if (proxyGet) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                binding.getValue = (): any => proxyGet.call(runtimeProxy);
            }
            return binding;
        }
    }

    public isMaskedOff (mask: AnimationMask): boolean {
        const trsPath = this.parseTrsPath();
        if (!trsPath) {
            return false;
        }
        const joints = mask.joints[Symbol.iterator]();
        for (let jointMaskInfoIter = joints.next();
            !jointMaskInfoIter.done;
            jointMaskInfoIter = joints.next()) {
            const { value: jointMaskInfo } = jointMaskInfoIter;
            if (jointMaskInfo.path !== trsPath.node) {
                continue;
            }
            return !jointMaskInfo.enabled;
        }
        return false;
    }
}

export function isTrsPropertyName (name: string | number): name is 'position' | 'rotation' | 'scale' | 'eulerAngles' {
    return name === 'position' || name === 'rotation' || name === 'scale' || name === 'eulerAngles';
}

interface CustomizedTrackPathResolver {
    get (target: unknown): unknown;
}

export { TrackPath };

/**
 * @en
 * A track describes how to trace the target and how to animate it.
 * It's the basic unit of animation clip.
 * @zh
 * 轨道描述了动画目标的路径和动画的方式。它是动画剪辑的基础单元。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}Track`)
export abstract class Track {
    /**
     * @en Track path.
     * @zh 轨道路径。
     */
    get path (): Readonly<TrackPath> {
        return this._binding.path;
    }

    set path (value) {
        this._binding.path = value;
    }

    /**
     * @en Value proxy for the target.
     * @zh 目标的值代理。
     */
    get proxy (): IValueProxyFactory | undefined {
        return this._binding.proxy;
    }

    set proxy (value) {
        this._binding.proxy = value;
    }

    /**
     * @internal
     */
    get [trackBindingTag] (): TrackBinding {
        return this._binding;
    }

    /**
     * @en Channels on this track.
     * @zh 此轨道上的通道。
     * @returns Iterator to the channels.
     */
    public channels (): Iterable<Channel> {
        return [];
    }

    /**
     * @en Time range of this track.
     * @zh 此轨道的时间范围。
     * @returns The time range.
     */
    public range (): Range {
        const range: Range = { min: Infinity, max: -Infinity };
        for (const channel of this.channels()) {
            range.min = Math.min(range.min, channel.curve.rangeMin);
            range.max = Math.max(range.max, channel.curve.rangeMax);
        }
        return range;
    }

    /**
     * @internal
     */
    public abstract [createEvalSymbol] (): TrackEval<any>;

    @serializable
    private _binding = new TrackBinding();
}

export interface TrackEval<TValue> {
    /**
     * A flag indicating if the track requires a default value to be passed to `this.evaluate`.
     */
    readonly requiresDefault: boolean;

    /**
     * Evaluates the track.
     * @param time The time.
     * @param defaultValue A default value.
     * This param will be passed if `this.requiresDefault === true` and
     * the caller is able to provide such a default value.
     */
    evaluate(time: number, defaultValue?: TValue extends unknown ? unknown : Readonly<TValue>): TValue;
}

export type Curve = RealCurve | QuatCurve | ObjectCurve<unknown>;

/**
 * @en
 * Channel contains a curve.
 * @zh
 * 通道包含了一条曲线。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}Channel`)
export class Channel<T = Curve> {
    constructor (curve: T) {
        this._curve = curve;
    }

    /**
     * @internal Not used for now.
     */
    public name = '';

    /**
     * @en The curve within the channel.
     * @zh 通道中的曲线。
     */
    get curve (): T {
        return this._curve;
    }

    @serializable
    private _curve!: T;
}

export type RealChannel = Channel<RealCurve>;

export type QuatChannel = Channel<QuatCurve>;

/**
 * @en 表示一个包含了单条通道的轨道。
 * @zh Describes a track which contains only single channel.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}SingleChannelTrack`)
export abstract class SingleChannelTrack<TCurve extends Curve> extends Track {
    constructor () {
        super();
        this._channel = new Channel<TCurve>(this.createCurve());
    }

    /**
     * @en The channel within the track.
     * @zh 轨道包含的通道。
     */
    get channel (): Channel<TCurve> {
        return this._channel;
    }

    public channels (): Iterable<Channel<TCurve>> {
        return [this._channel];
    }

    /**
     * @internal
     */
    protected createCurve (): TCurve {
        throw new Error(`Not impl`);
    }

    /**
     * @internal
     */
    public [createEvalSymbol] (): TrackEval<unknown> {
        const { curve } = this._channel;
        return new SingleChannelTrackEval(curve);
    }

    @serializable
    private _channel: Channel<TCurve>;
}

class SingleChannelTrackEval<TCurve extends Curve> implements TrackEval<unknown> {
    constructor (private _curve: TCurve) {
    }

    public get requiresDefault (): boolean {
        return false;
    }

    public evaluate (time: number): unknown {
        return this._curve.evaluate(time);
    }
}
