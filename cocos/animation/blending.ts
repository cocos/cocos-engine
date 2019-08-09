/**
 * @category animation
 */

import { Quat, Vec3 } from '../core/math';
import { PropertyBlendState } from './animation-blend-state';

/**
 * If propertyBlendState.weight equals to zero, the propertyBlendState.value is dirty.
 * You shall handle this situation correctly.
 */
export type BlendFunction<T> = (value: T, weight: number, propertyBlendState: PropertyBlendState) => T;

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
        Vec3.zero(propertyBlendState.value);
    }
    if (weight === 0) {
        return propertyBlendState.value;
    } else if (weight === 1) {
        return Vec3.copy(propertyBlendState.value, value);
    }
    return Vec3.scaleAndAdd(propertyBlendState.value, propertyBlendState.value, value, weight);
}

export function additiveQuat (value: Quat, weight: number, propertyBlendState: PropertyBlendState<Quat>) {
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
