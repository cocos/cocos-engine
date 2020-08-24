/**
 * @hidden
 */

import { Vec3, Quat } from '../math';
import { Node } from '../scene-graph';
import { IValueProxyFactory } from './value-proxy';
import { assertIsNonNullable } from '../data/utils/asserts';

export class BlendStateBuffer {
    private _nodeBlendStates: Map<Node, NodeBlendState> = new Map();

    public ref (node: Node, property: BlendingProperty) {
        let nodeBlendState = this._nodeBlendStates.get(node);
        if (!nodeBlendState) {
            nodeBlendState = { dirty: false, properties: {} };
            this._nodeBlendStates.set(node, nodeBlendState);
        }
        let propertyBlendState = nodeBlendState.properties[property];
        if (!propertyBlendState) {
            propertyBlendState = nodeBlendState.properties[property] = new PropertyBlendState(
                nodeBlendState,
                (isVec3Property(property) ? new Vec3() : new Quat()) as any,
            );
        }
        ++propertyBlendState.refCount;
        return propertyBlendState;
    }

    public deRef (node: Node, property: BlendingProperty) {
        const nodeBlendState = this._nodeBlendStates.get(node);
        if (!nodeBlendState) {
            return;
        }
        const propertyBlendState = nodeBlendState.properties[property];
        if (!propertyBlendState) {
            return;
        }
        --propertyBlendState.refCount;
        if (propertyBlendState.refCount > 0) {
            return;
        }
        delete nodeBlendState.properties[property];
        if (isEmptyNodeBlendState(nodeBlendState)) {
            this._nodeBlendStates.delete(node);
        }
    }

    public apply () {
        this._nodeBlendStates.forEach((nodeBlendState, node) => {
            if (!nodeBlendState.dirty) {
                return;
            }
            nodeBlendState.dirty = false;
            const { position, scale, rotation, eulerAngles } = nodeBlendState.properties;
            let t: Vec3 | undefined;
            let s: Vec3 | undefined;
            let r: Quat | Vec3 | undefined;
            let anyChanged = false;
            if (position && position.weight !== 0) {
                position.weight = 0;
                t = position.value;
                anyChanged = true;
            }
            if (scale && scale.weight !== 0) {
                scale.weight = 0;
                s = scale.value;
                anyChanged = true;
            }

            // Note: rotation and eulerAngles can not co-exist.
            if (rotation && rotation.weight !== 0) {
                rotation.weight = 0;
                r = rotation.value;
                anyChanged = true;
            }
            if (eulerAngles && eulerAngles.weight !== 0) {
                eulerAngles.weight = 0;
                r = eulerAngles.value;
                anyChanged = true;
            }

            if (anyChanged) {
                node.setRTS(r, t, s);
            }
        });
    }
}

export type IBlendStateWriter = IValueProxyFactory & { destroy: () => void };

export function createBlendStateWriter<P extends BlendingProperty> (
    blendState: BlendStateBuffer,
    node: Node,
    property: P,
    weightProxy: { weight: number }, // Effectively equals to AnimationState
    /**
     * True if this writer will write constant value each time.
     */
    constants: boolean,
): IBlendStateWriter {
    const blendFunction: BlendFunction<BlendingPropertyValue<P>> =
        isVec3Property(property) ? additive3D as any: additiveQuat as any;
    let propertyBlendState: PropertyBlendState<BlendingPropertyValue<P>> | null = blendState.ref(node, property);
    let isConstCacheValid = false;
    let lastWeight = -1;
    return {
        destroy () {
            assertIsNonNullable(propertyBlendState);
            if (propertyBlendState) {
                blendState.deRef(node, property);
                propertyBlendState = null;
            }
        },
        forTarget: () => {
            return {
                /**
                 * Gets the node's actual property for now.
                 */
                get: () => {
                    return node[property];
                },
                set: (value: BlendingPropertyValue<P>) => {
                    if (!propertyBlendState) {
                        return;
                    }
                    const weight = weightProxy.weight;
                    if (constants) {
                        if (weight !== 1 ||
                            weight !== lastWeight) {
                            // If there are multi writer for this property at this time,
                            // or if the weight has been changed since last write,
                            // we should invalidate the cache.
                            isConstCacheValid = false;
                        } else if (isConstCacheValid) {
                            // Otherwise, we may keep to use the cache.
                            // i.e we leave the weight to 0 to prevent the property from modifying.
                            return;
                        }
                    }
                    blendFunction(value, weight, propertyBlendState);
                    propertyBlendState.weight += weight;
                    propertyBlendState.markAsDirty();
                    isConstCacheValid = true;
                    lastWeight = weight;
                },
            };
        },
    };
}

function isQuatProperty (property: BlendingProperty) {
    return property === 'rotation';
}

function isVec3Property (property: BlendingProperty) {
    return !isQuatProperty(property);
}

type BlendingProperty = keyof NodeBlendState['properties'];

type BlendingPropertyValue<P extends BlendingProperty> = NonNullable<NodeBlendState['properties'][P]>['value'];

class PropertyBlendState<T> {
    public weight = 0;
    public value: T;

    /**
     * How many writer reference this property.
     */
    public refCount = 0;

    private _node: NodeBlendState;

    constructor (node: NodeBlendState, value: T) {
        this._node = node;
        this.value = value;
    }

    public markAsDirty () {
        this._node.dirty = true;
    }
}

interface NodeBlendState {
    dirty: boolean;
    properties: {
        position?: PropertyBlendState<Vec3>;
        rotation?: PropertyBlendState<Quat>;
        eulerAngles?: PropertyBlendState<Vec3>;
        scale?: PropertyBlendState<Vec3>;
    };
}

function isEmptyNodeBlendState (nodeBlendState: NodeBlendState) {
    // Which is equal to `Object.keys(nodeBlendState.properties).length === 0`.
    return !nodeBlendState.properties.position &&
        !nodeBlendState.properties.rotation &&
        !nodeBlendState.properties.eulerAngles &&
        !nodeBlendState.properties.scale;
}

/**
 * If propertyBlendState.weight equals to zero, the propertyBlendState.value is dirty.
 * You shall handle this situation correctly.
 */
type BlendFunction<T> = (value: T, weight: number, propertyBlendState: PropertyBlendState<T>) => T;

function additive3D (value: Vec3, weight: number, propertyBlendState: PropertyBlendState<Vec3>) {
    if (propertyBlendState.weight === 0) {
        Vec3.zero(propertyBlendState.value);
    }
    if (weight === 0) {
        return propertyBlendState.value;
    } else if (weight === 1) {
        return Vec3.copy(propertyBlendState.value, value);
    }
    return Vec3.scaleAndAdd(propertyBlendState.value, propertyBlendState.value, value, weight);
}

function additiveQuat (value: Quat, weight: number, propertyBlendState: PropertyBlendState<Quat>) {
    if (propertyBlendState.weight === 0) {
        Quat.identity(propertyBlendState.value);
    }
    if (weight === 0) {
        return propertyBlendState.value;
    } else if (weight === 1) {
        return Quat.copy(propertyBlendState.value, value);
    }
    const t = weight / (propertyBlendState.weight + weight);
    return Quat.slerp(propertyBlendState.value, propertyBlendState.value, value, t);
}
