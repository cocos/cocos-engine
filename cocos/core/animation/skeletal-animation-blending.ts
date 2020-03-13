
import { Vec3, Quat } from '../math';
import { Node } from '../scene-graph';
import { IValueProxyFactory } from './value-proxy';

export class BlendState {
    private _nodeBlendStates: Map<Node, NodeBlendState> = new Map();

    ref (node: Node, property: BlendingProperty) {
        let nodeBlendState = this._nodeBlendStates.get(node);
        if (!nodeBlendState) {
            nodeBlendState = {  properties: {} };
            this._nodeBlendStates.set(node, nodeBlendState);
        }
        let propertyBlendState = nodeBlendState.properties[property];
        if (!propertyBlendState) {
            propertyBlendState = nodeBlendState.properties[property] = {
                refCount: 0,
                weight: 0,
                value: ((property === 'position' || property === 'scale') ? new Vec3() : new Quat()) as any,
            };
        }
        ++propertyBlendState.refCount;
        return propertyBlendState;
    }

    deRef (node: Node, property: BlendingProperty) {
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
        if (Object.keys(nodeBlendState.properties).length === 0) {
            this._nodeBlendStates.delete(node);
        }
    }

    apply () {
        this._nodeBlendStates.forEach((nodeBlendState, node) => {
            const { position, scale, rotation } = nodeBlendState.properties;
            if (position && position.weight !== 0) {
                node.setPosition(position.value);
                position.weight = 0;
            }
            if (scale && scale.weight !== 0) {
                node.setScale(scale.value);
                scale.weight = 0;
            }
            if (rotation && rotation.weight !== 0) {
                node.setRotation(rotation.value);
                rotation.weight = 0;
            }
        });
    }
}

export type IBlendStateWriter = IValueProxyFactory & {
    start: () => void;
    stop: () => void;
}

export function createBlendStateWriter<P extends BlendingProperty>(
    blendState: BlendState,
    node: Node,
    property: P,
    weightProxy: { weight: number; }
    ): IBlendStateWriter {
    const blendFunction: BlendFunction<BlendingPropertyValue<P>> =
        (property === 'position' || property === 'scale') ?
            additive3D as any:
            additiveQuat as any;
    let propertyBlendState: PropertyBlendState<BlendingPropertyValue<P>> | null = null;
    return {
        start : () => {
            if (!propertyBlendState) {
                propertyBlendState = blendState.ref(node, property);
            }
        },
        stop: () => {
            if (propertyBlendState) {
                blendState.deRef(node, property);
                propertyBlendState = null;
            }
        },
        forTarget: (_) => {
            return {
                set: (value: BlendingPropertyValue<P>) => {
                    if (propertyBlendState) {
                        blendFunction(value, weightProxy.weight, propertyBlendState);
                        propertyBlendState.weight += weightProxy.weight;
                    }
                },
            };
        },
    };
}

type BlendingProperty = keyof NodeBlendState['properties'];

type BlendingPropertyValue<P extends BlendingProperty> = NonNullable<NodeBlendState['properties'][P]>['value'];

interface PropertyBlendState<T> {
    weight: number;
    value: T;
    refCount: number;
}

interface NodeBlendState {
    properties: {
        position?: PropertyBlendState<Vec3>;
        rotation?: PropertyBlendState<Quat>;
        scale?: PropertyBlendState<Vec3>;
    };
}

/**
 * If propertyBlendState.weight equals to zero, the propertyBlendState.value is dirty.
 * You shall handle this situation correctly.
 */
type BlendFunction<T> = (value: T, weight: number, propertyBlendState: PropertyBlendState<T>) => T;

function additive3D (value: Vec3, weight: number, propertyBlendState: PropertyBlendState<Vec3>) {
    if (!propertyBlendState.value) {
        propertyBlendState.value = new Vec3();
    }
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
    if (!propertyBlendState.value) {
        propertyBlendState.value = new Quat();
    }
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
