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
 * @hidden
 */

import { DEBUG } from 'internal:constants';
import { Vec3, Quat, approx } from '../../core/math';
import { Node } from '../../core/scene-graph';
import { RuntimeBinding } from '../../core/animation/tracks/track';
import { assertIsNonNullable, assertIsTrue } from '../../core/data/utils/asserts';
import { MAX_ANIMATION_LAYER } from './limits';

export abstract class BlendStateBuffer<
    TNodeBlendState extends NodeBlendState<PropertyBlendState<Vec3>, PropertyBlendState<Quat>> =
    NodeBlendState<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>
> {
    protected _nodeBlendStates: Map<Node, TNodeBlendState> = new Map();

    public createWriter<P extends BlendingPropertyName> (
        node: Node,
        property: P,
        host: BlendStateWriterHost,
        constants: boolean,
    ): BlendStateWriter<P> {
        const propertyBlendState = this.ref(node, property);
        return new BlendStateWriterInternal<P>(
            node,
            property,
            propertyBlendState,
            host,
            constants,
        );
    }

    public destroyWriter<P extends BlendingPropertyName> (writer: BlendStateWriter<P>) {
        const internal = writer as BlendStateWriterInternal<P>;
        this.deRef(internal.node, internal.property);
    }

    public ref<P extends BlendingPropertyName> (node: Node, property: P) {
        let nodeBlendState = this._nodeBlendStates.get(node);
        if (!nodeBlendState) {
            nodeBlendState = this.createNodeBlendState();
            this._nodeBlendStates.set(node, nodeBlendState);
        }
        const propertyBlendState = nodeBlendState.refProperty(node, property);
        return propertyBlendState as PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P];
    }

    public deRef (node: Node, property: BlendingPropertyName) {
        const nodeBlendState = this._nodeBlendStates.get(node);
        if (!nodeBlendState) {
            return;
        }
        nodeBlendState.deRefProperty(property);
        if (nodeBlendState.empty) {
            this._nodeBlendStates.delete(node);
        }
    }

    public apply () {
        this._nodeBlendStates.forEach((nodeBlendState, node) => {
            nodeBlendState.apply(node);
        });
    }

    protected abstract createNodeBlendState (): TNodeBlendState;
}

export interface BlendStateWriterHost {
    readonly weight: number;
}

export type BlendingPropertyName = 'position' | 'scale' | 'rotation' | 'eulerAngles';

interface PropertyBlendStateTypeMap<TVec3PropertyBlendState, TQuatPropertyBlendState> {
    'rotation': TQuatPropertyBlendState;
    'position': TVec3PropertyBlendState;
    'scale': TVec3PropertyBlendState;
    'eulerAngles': TVec3PropertyBlendState;
}

class BlendStateWriterInternal<P extends BlendingPropertyName> implements RuntimeBinding {
    constructor (
        protected _node: Node,
        protected _property: P,
        protected _propertyBlendState: PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P],
        protected _host: BlendStateWriterHost,
        protected _constants: boolean,
    ) {
    }

    get node () {
        return this._node;
    }

    get property () {
        return this._property;
    }

    public getValue () {
        return this._node[this._property];
    }

    public setValue (value: PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P]['result']) {
        const {
            _propertyBlendState: propertyBlendState,
            _host: host,
        } = this;
        const weight = host.weight;
        // @ts-expect-error Complex typing
        propertyBlendState.blend(value, weight);
    }
}

export type BlendStateWriter<P extends BlendingPropertyName> = Omit<BlendStateWriterInternal<P>, 'node' | 'property'>;

interface PropertyBlendState<TValue> {
    /**
     * How many writer reference this property.
     */
    refCount: number;

    readonly result: Readonly<TValue>;

    blend(value: Readonly<TValue>, weight: number): void;
}

class LegacyVec3PropertyBlendState implements PropertyBlendState<Vec3> {
    public refCount = 0;

    public accumulatedWeight = 0.0;

    public result = new Vec3();

    public blend (value: Readonly<Vec3>, weight: number) {
        this.accumulatedWeight = mixAveragedVec3(
            this.result,
            this.result,
            this.accumulatedWeight,
            value,
            weight,
        );
    }

    public reset () {
        this.accumulatedWeight = 0.0;
        Vec3.zero(this.result);
    }
}

class LegacyQuatPropertyBlendState implements PropertyBlendState<Quat> {
    public refCount = 0;

    public accumulatedWeight = 0.0;

    public result = new Quat();

    public blend (value: Readonly<Quat>, weight: number) {
        this.accumulatedWeight = mixAveragedQuat(
            this.result,
            this.result,
            this.accumulatedWeight,
            value,
            weight,
        );
    }

    public reset () {
        this.accumulatedWeight = 0.0;
        Quat.identity(this.result);
    }
}

abstract class NodeBlendState<TVec3PropertyBlendState extends PropertyBlendState<Vec3>, TQuatPropertyBlendState extends PropertyBlendState<Quat>> {
    get empty () {
        const { _properties: properties } = this;
        return !properties.position
            && !properties.rotation
            && !properties.eulerAngles
            && !properties.scale;
    }

    public refProperty<P extends BlendingPropertyName> (
        node: Node, property: BlendingPropertyName,
    ): NodeBlendState<TVec3PropertyBlendState, TQuatPropertyBlendState>['_properties'][P] {
        const { _properties: properties } = this;
        let propertyBlendState: TVec3PropertyBlendState | TQuatPropertyBlendState;
        switch (property) {
        default:
        case 'position':
        case 'scale':
        case 'eulerAngles':
            propertyBlendState = properties[property] ??= this._createVec3BlendState(node[property]);
            break;
        case 'rotation':
            propertyBlendState = properties[property] ??= this._createQuatBlendState(node.rotation);
            break;
        }
        ++propertyBlendState.refCount;
        return propertyBlendState as PropertyBlendStateTypeMap<TVec3PropertyBlendState, TQuatPropertyBlendState>[P];
    }

    public deRefProperty (property: BlendingPropertyName) {
        const { _properties: properties } = this;

        const propertyBlendState = properties[property];
        if (!propertyBlendState) {
            return;
        }

        --propertyBlendState.refCount;
        if (propertyBlendState.refCount > 0) {
            return;
        }

        delete properties[property];
    }

    public apply (node: Node) {
        const { _properties: { position, scale, rotation, eulerAngles } } = this;

        let t: Vec3 | undefined;
        let s: Vec3 | undefined;
        let r: Quat | Vec3 | undefined;

        if (position) {
            t = position.result;
        }

        if (scale) {
            s = scale.result;
        }

        if (eulerAngles) {
            r = eulerAngles.result;
        }

        if (rotation) {
            r = rotation.result;
        }

        if (r || t || s) {
            node.setRTS(r, t, s);
        }
    }

    protected _properties: {
        position?: TVec3PropertyBlendState;
        rotation?: TQuatPropertyBlendState;
        eulerAngles?: TVec3PropertyBlendState;
        scale?: TVec3PropertyBlendState;
    } = {};

    protected abstract _createVec3BlendState (currentValue: Readonly<Vec3>): TVec3PropertyBlendState;

    protected abstract _createQuatBlendState (currentValue: Readonly<Quat>): TQuatPropertyBlendState;
}

class LegacyNodeBlendState extends NodeBlendState<LegacyVec3PropertyBlendState, LegacyQuatPropertyBlendState> {
    public apply (node: Node) {
        const { _properties: { position, scale, rotation, eulerAngles } } = this;

        if (position && position.accumulatedWeight) {
            if (position.accumulatedWeight < 1.0) {
                position.blend(node.position, 1.0 - position.accumulatedWeight);
            }
        }

        if (scale && scale.accumulatedWeight) {
            if (scale.accumulatedWeight < 1.0) {
                scale.blend(node.scale, 1.0 - scale.accumulatedWeight);
            }
        }

        if (eulerAngles && eulerAngles.accumulatedWeight) {
            if (eulerAngles.accumulatedWeight < 1.0) {
                eulerAngles.blend(node.eulerAngles, 1.0 - eulerAngles.accumulatedWeight);
            }
        }

        if (rotation && rotation.accumulatedWeight) {
            if (rotation.accumulatedWeight < 1.0) {
                rotation.blend(node.rotation, 1.0 - rotation.accumulatedWeight);
            }
        }

        super.apply(node);

        position?.reset();
        scale?.reset();
        rotation?.reset();
        eulerAngles?.reset();
    }

    protected _createVec3BlendState (_currentValue: Readonly<Vec3>) {
        return new LegacyVec3PropertyBlendState();
    }

    protected _createQuatBlendState (_currentValue: Readonly<Quat>) {
        return new LegacyQuatPropertyBlendState();
    }
}

export class LegacyBlendStateBuffer extends BlendStateBuffer<LegacyNodeBlendState> {
    protected createNodeBlendState () {
        return new LegacyNodeBlendState();
    }
}

class LayeredVec3PropertyBlendState implements PropertyBlendState<Vec3> {
    constructor (defaultValue: Readonly<Vec3>) {
        Vec3.copy(this._defaultValue, defaultValue);
        Vec3.copy(this.result, defaultValue);
    }

    public refCount = 0;

    public result = new Vec3();

    public blend (value: Readonly<Vec3>, weight: number): void {
        this._accumulatedWeight = mixAveragedVec3(
            this._clipBlendResult,
            this._clipBlendResult,
            this._accumulatedWeight,
            value,
            weight,
        );
    }

    public commitLayerChange (weight: number) {
        const {
            result,
            _clipBlendResult: clipBlendResult,
            _accumulatedWeight: accumulatedWeight,
        } = this;
        if (accumulatedWeight < 1.0) {
            this.blend(this._defaultValue, 1.0 - accumulatedWeight);
        }
        Vec3.lerp(result, result, clipBlendResult, weight);
        Vec3.zero(this._clipBlendResult);
        this._accumulatedWeight = 0.0;
    }

    public reset () {
        Vec3.copy(this.result, this._defaultValue);
    }

    private _defaultValue = new Vec3();
    private _clipBlendResult = new Vec3();
    private _accumulatedWeight = 0.0;
}

class LayeredQuatPropertyBlendState implements PropertyBlendState<Quat> {
    constructor (defaultValue: Readonly<Quat>) {
        Quat.copy(this._defaultValue, defaultValue);
        Quat.copy(this.result, defaultValue);
    }

    public refCount = 0;

    public result = new Quat();

    public blend (value: Readonly<Quat>, weight: number): void {
        this._accumulatedWeight = mixAveragedQuat(
            this._clipBlendResult,
            this._clipBlendResult,
            this._accumulatedWeight,
            value,
            weight,
        );
    }

    public commitLayerChange (weight: number) {
        const {
            result,
            _clipBlendResult: clipBlendResult,
            _accumulatedWeight: accumulatedWeight,
        } = this;
        if (accumulatedWeight < 1.0) {
            this.blend(this._defaultValue, 1.0 - accumulatedWeight);
        }
        Quat.slerp(result, result, clipBlendResult, weight);
        Quat.identity(this._clipBlendResult);
        this._accumulatedWeight = 0.0;
    }

    public reset () {
        Quat.copy(this.result, this._defaultValue);
    }

    private _defaultValue = new Quat();
    private _clipBlendResult = new Quat();
    private _accumulatedWeight = 0.0;
}

class LayeredNodeBlendState extends NodeBlendState<LayeredVec3PropertyBlendState, LayeredQuatPropertyBlendState> {
    public setLayerMask (layerIndex: number) {
        this._layerMask &= ~(1 << layerIndex);
    }

    public commitLayerChanges (layerIndex: number, weight: number) {
        if (!(this._layerMask & (1 << layerIndex))) {
            return;
        }
        const { _properties: { position, scale, rotation, eulerAngles } } = this;
        if (position) {
            position.commitLayerChange(weight);
        }
        if (scale) {
            scale.commitLayerChange(weight);
        }
        if (rotation) {
            rotation.commitLayerChange(weight);
        }
        if (eulerAngles) {
            eulerAngles.commitLayerChange(weight);
        }
    }

    public apply (node: Node) {
        super.apply(node);

        const { _properties: { position, scale, rotation, eulerAngles } } = this;

        position?.reset();
        scale?.reset();
        rotation?.reset();
        eulerAngles?.reset();
    }

    protected _createVec3BlendState (currentValue: Readonly<Vec3>) {
        return new LayeredVec3PropertyBlendState(currentValue);
    }

    protected _createQuatBlendState (currentValue: Readonly<Quat>) {
        return new LayeredQuatPropertyBlendState(currentValue);
    }

    private _layerMask = ~0;
}

/**
 * The blend state buffer is an internal facility
 * used by Creator to implements animation blending.
 *
 * The workflow of a blend state buffer is described as following:
 *
 * - Create writers onto the buffer.
 *
 *   Through `createWriter()`.
 *
 * - Set layer masks.
 *
 *   Each layer should set its mask, if any.
 *
 * - Call the following steps in every buffer frame.
 *
 * - Change to layer: sample animation.
 *
 *   The animations would write into the "clip blending buffer"
 *   through `BlendStateWriter` created by the buffer.
 *   The writing process can be weighted. The weight represents the contribution to the blending.
 *   Let's call this kind of blending "clip blending".
 *
 * - Commit layer changes.
 *
 *   While all animations within the layer are sampled. The clip blending buffer holds
 *   the blend result of the layer.
 *   Then, a `commitLayerChanges()` call should be made to commit the changes to final result buffer,
 *   using another algorithm. Let's call this kind of blending "layer blending".
 *
 * - Apply.
 *
 *   After ran above steps for all layers. An `apply()` call
 *   causes the final result buffer content flush into scene.
 *
 * The following demonstrates the algorithms used in "clip blending" and "layer blending", respectively.
 *
 * ### Algorithm used in clip blending and legacy animation system(i.e in cross fading).
 *
 * In short: the weights of samples are normalized,
 * and the samples are scaled multiplied by their normalized weight,
 * and then add up them all together.
 *
 * Let:
 * - `N` be the count of samples to blend;
 * - `v_n` be n-th sample's value;
 * - `w_n` be n-th sample's weight;
 * - `v_current` be current value.
 * - `W_n` be the accumulated weights from 0 to n-th sample.
 *
 * The blend result after mix with n-th sample, denoted by `R_n`, is calculated as:
 *
 * ```
 * R_n = sum(i=0, n, v_i * (w_i / W_n))
 *     = (R_(n-1) * W_(n-1) + v_n * w_n) / (W_(n-1) + w_n)
 * ```
 *
 * The final blend result produced in addition blend with current pose:
 *
 * ```
 * R_final = R_N * W_N + V_current * (1 - W_N) | if W_N < 1
 * R_final = R_N                               | Otherwise
 * ```
 *
 * ### Algorithm used in layer blending(Marionette animation system).
 *
 * In short: each layer is added onto previous content,
 * the previous layer and itself are weighted by its weight.
 *
 * Let:
 * - `N` be the count of samples to blend;
 * - `V_n` be n-th sample's output;
 * - `w_n` be n-th sample's weight;
 * - `V_default` be the default pose.
 *
 * The blend result after mix with n-th sample, denoted by `R_n`, is calculated as:
 *
 * ```
 * R_0 = V_default * (1 - w_0) + V_0 * w_0
 * R_n = R_(n-1) * (1 - w_n) + V_n * w_n    | if n ≠ 0
 * ```
 *
 * The final blend result is simply the N-th result, or the default pose is no input samples:
 *
 * ```
 * R_final = R_N         | if N ≠ 0
 * R_final = V_default   | if N = 0
 * ```
 * ```
 */
export class LayeredBlendStateBuffer extends BlendStateBuffer<LayeredNodeBlendState> {
    public setMask (layerIndex: number, excludeNodes: Set<Node>) {
        if (DEBUG) {
            checkLayerIndex(layerIndex);
        }
        this._nodeBlendStates.forEach((nodeBlendState, node) => {
            if (excludeNodes.has(node)) {
                nodeBlendState.setLayerMask(layerIndex);
            }
        });
    }

    public commitLayerChanges (layerIndex: number, weight: number) {
        if (DEBUG) {
            checkLayerIndex(layerIndex);
        }
        this._nodeBlendStates.forEach((nodeBlendState, node) => {
            nodeBlendState.commitLayerChanges(layerIndex, weight);
        });
    }

    protected createNodeBlendState () {
        return new LayeredNodeBlendState();
    }
}

function checkLayerIndex (layerIndex: number) {
    assertIsTrue(layerIndex < MAX_ANIMATION_LAYER);
}

function mixAveragedVec3 (result: Vec3, previous: Readonly<Vec3>, accumulatedWeight: number, input: Readonly<Vec3>, weight: number) {
    const newSum = accumulatedWeight + weight;
    if (weight === 1.0 && !accumulatedWeight) {
        Vec3.copy(result, input);
    } else if (newSum) {
        const t = weight / newSum;
        Vec3.lerp(result, result, input, t);
    }
    return newSum;
}

function mixAveragedQuat (result: Quat, previous: Readonly<Quat>, accumulatedWeight: number, input: Readonly<Quat>, weight: number) {
    const newSum = accumulatedWeight + weight;
    if (weight === 1.0 && !accumulatedWeight) {
        Quat.copy(result, input);
    } else if (newSum) {
        const t = weight / newSum;
        Quat.slerp(result, previous, input, t);
    }
    return newSum;
}
