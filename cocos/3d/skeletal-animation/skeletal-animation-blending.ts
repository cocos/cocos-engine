/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { Vec3, Quat } from '../../core';
import { Node } from '../../scene-graph';
import { RuntimeBinding } from '../../animation/tracks/track';

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

    public destroyWriter<P extends BlendingPropertyName> (writer: BlendStateWriter<P>): void {
        const internal = writer as BlendStateWriterInternal<P>;
        this.deRef(internal.node, internal.property);
    }

    public ref<P extends BlendingPropertyName> (node: Node, property: P): PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P]
    {
        let nodeBlendState = this._nodeBlendStates.get(node);
        if (!nodeBlendState) {
            nodeBlendState = this.createNodeBlendState();
            this._nodeBlendStates.set(node, nodeBlendState);
        }
        const propertyBlendState = nodeBlendState.refProperty(node, property);
        return propertyBlendState as PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P];
    }

    public deRef (node: Node, property: BlendingPropertyName): void {
        const nodeBlendState = this._nodeBlendStates.get(node);
        if (!nodeBlendState) {
            return;
        }
        nodeBlendState.deRefProperty(property);
        if (nodeBlendState.empty) {
            this._nodeBlendStates.delete(node);
        }
    }

    public apply (): void {
        this._nodeBlendStates.forEach((nodeBlendState, node): void => {
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

    get node (): Node {
        return this._node;
    }

    get property (): P {
        return this._property;
    }

    public getValue (): Node[P] {
        return this._node[this._property];
    }

    public setValue (value: PropertyBlendStateTypeMap<PropertyBlendState<Vec3>, PropertyBlendState<Quat>>[P]['result']): void {
        const {
            _propertyBlendState: propertyBlendState,
            _host: host,
        } = this;
        const weight = host.weight;
        // TODO: please fix type here @Leslie Leigh
        // Tracking issue: https://github.com/cocos/cocos-engine/issues/14640
        propertyBlendState.blend(value as Readonly<Vec3> & Readonly<Quat>, weight);
    }
}

export type BlendStateWriter<P extends BlendingPropertyName> = Omit<BlendStateWriterInternal<P>, 'node' | 'property'>;

enum TransformApplyFlag {
    POSITION = 1,
    ROTATION = 2,
    SCALE = 4,
    EULER_ANGLES = 8,
}

const TRANSFORM_APPLY_FLAGS_ALL = TransformApplyFlag.POSITION
    | TransformApplyFlag.ROTATION
    | TransformApplyFlag.SCALE
    | TransformApplyFlag.EULER_ANGLES;

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

    public blend (value: Readonly<Vec3>, weight: number): void {
        this.accumulatedWeight = mixAveragedVec3(
            this.result,
            this.result,
            this.accumulatedWeight,
            value,
            weight,
        );
    }

    public reset (): void {
        this.accumulatedWeight = 0.0;
        Vec3.zero(this.result);
    }
}

class LegacyQuatPropertyBlendState implements PropertyBlendState<Quat> {
    public refCount = 0;

    public accumulatedWeight = 0.0;

    public result = new Quat();

    public blend (value: Readonly<Quat>, weight: number): void {
        this.accumulatedWeight = mixAveragedQuat(
            this.result,
            this.result,
            this.accumulatedWeight,
            value,
            weight,
        );
    }

    public reset (): void {
        this.accumulatedWeight = 0.0;
        Quat.identity(this.result);
    }
}

abstract class NodeBlendState<TVec3PropertyBlendState extends PropertyBlendState<Vec3>, TQuatPropertyBlendState extends PropertyBlendState<Quat>> {
    get empty (): boolean {
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

    public deRefProperty (property: BlendingPropertyName): void {
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

    public apply (node: Node): void {
        const {
            _transformApplyFlags: transformApplyFlags,
            _properties: { position, scale, rotation, eulerAngles },
        } = this;

        if (!transformApplyFlags) {
            return;
        }

        let t: Vec3 | undefined;
        let s: Vec3 | undefined;
        let r: Quat | Vec3 | undefined;

        if (position && (transformApplyFlags & TransformApplyFlag.POSITION)) {
            t = position.result;
        }

        if (scale && (transformApplyFlags & TransformApplyFlag.SCALE)) {
            s = scale.result;
        }

        if (eulerAngles && (transformApplyFlags & TransformApplyFlag.EULER_ANGLES)) {
            r = eulerAngles.result;
        }

        if (rotation && (transformApplyFlags & TransformApplyFlag.ROTATION)) {
            r = rotation.result;
        }

        if (r || t || s) {
            node.setRTS(r, t, s);
        }

        this._transformApplyFlags = 0;
    }

    protected _transformApplyFlags = 0;

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
    public apply (node: Node): void {
        const { _properties: { position, scale, rotation, eulerAngles } } = this;

        if (position && position.accumulatedWeight) {
            this._transformApplyFlags |= TransformApplyFlag.POSITION;
            if (position.accumulatedWeight < 1.0) {
                position.blend(node.position, 1.0 - position.accumulatedWeight);
            }
        }

        if (scale && scale.accumulatedWeight) {
            this._transformApplyFlags |= TransformApplyFlag.SCALE;
            if (scale.accumulatedWeight < 1.0) {
                scale.blend(node.scale, 1.0 - scale.accumulatedWeight);
            }
        }

        if (eulerAngles && eulerAngles.accumulatedWeight) {
            this._transformApplyFlags |= TransformApplyFlag.EULER_ANGLES;
            if (eulerAngles.accumulatedWeight < 1.0) {
                eulerAngles.blend(node.eulerAngles, 1.0 - eulerAngles.accumulatedWeight);
            }
        }

        if (rotation && rotation.accumulatedWeight) {
            this._transformApplyFlags |= TransformApplyFlag.ROTATION;
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

    protected _createVec3BlendState (_currentValue: Readonly<Vec3>): LegacyVec3PropertyBlendState {
        return new LegacyVec3PropertyBlendState();
    }

    protected _createQuatBlendState (_currentValue: Readonly<Quat>): LegacyQuatPropertyBlendState {
        return new LegacyQuatPropertyBlendState();
    }
}

export class LegacyBlendStateBuffer extends BlendStateBuffer<LegacyNodeBlendState> {
    protected createNodeBlendState (): LegacyNodeBlendState {
        return new LegacyNodeBlendState();
    }
}

function mixAveragedVec3 (result: Vec3, previous: Readonly<Vec3>, accumulatedWeight: number, input: Readonly<Vec3>, weight: number): number {
    const newSum = accumulatedWeight + weight;
    if (weight === 1.0 && !accumulatedWeight) {
        Vec3.copy(result, input);
    } else if (newSum) {
        const t = weight / newSum;
        Vec3.lerp(result, result, input, t);
    }
    return newSum;
}

function mixAveragedQuat (result: Quat, previous: Readonly<Quat>, accumulatedWeight: number, input: Readonly<Quat>, weight: number): number {
    const newSum = accumulatedWeight + weight;
    if (weight === 1.0 && !accumulatedWeight) {
        Quat.copy(result, input);
    } else if (newSum) {
        const t = weight / newSum;
        Quat.slerp(result, previous, input, t);
    }
    return newSum;
}
