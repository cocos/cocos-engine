import { Quat, Vec3 } from '../core';
import { quat, vec3 } from '../core/vmath';
import { PropertyBlendState } from './animation-blend-state';

export function additive1D (value: number, weight: number, propertyBlendState: PropertyBlendState<number>) {
    if (!propertyBlendState.value) {
        propertyBlendState.value = 0;
    }
    if (propertyBlendState.weight === 0) {
        propertyBlendState.value = 0;
    }
    return propertyBlendState.value + value * weight;
}

export function additive3D (value: Vec3, weight: number, propertyBlendState: PropertyBlendState<Vec3>) {
    if (!propertyBlendState.value) {
        propertyBlendState.value = new Vec3();
    }
    if (propertyBlendState.weight === 0) {
        vec3.zero(propertyBlendState.value);
    }
    if (weight === 0) {
        return propertyBlendState.value;
    } else if (weight === 1) {
        return vec3.copy(propertyBlendState.value, value);
    }
    return vec3.scaleAndAdd(propertyBlendState.value, propertyBlendState.value, value, weight);
}

export function additiveQuat (value: Quat, weight: number, propertyBlendState: PropertyBlendState<Quat>) {
    if (!propertyBlendState.value) {
        propertyBlendState.value = new Quat();
    }
    if (propertyBlendState.weight === 0) {
        quat.identity(propertyBlendState.value);
    }
    if (weight === 0) {
        return propertyBlendState.value;
    } else if (weight === 1) {
        return quat.copy(propertyBlendState.value, value);
    }
    const t = weight / (propertyBlendState.weight + weight);
    return quat.slerp(propertyBlendState.value, propertyBlendState.value, value, t);
}
