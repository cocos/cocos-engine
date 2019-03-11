import { quat, vec3 } from '../../core/vmath';

export function stringfyVec3 (value: {x: number; y: number; z: number}): string {
    if (vec3.exactEquals(value, vec3.create())) {
        return `<origin>`;
    } else {
        return `(x: ${value.x}, y: ${value.y}, z: ${value.z})`;
    }
}

export function stringfyQuat (value: {x: number; y: number; z: number; w: number}): string {
    if (quat.exactEquals(value, quat.create())) {
        return `<Identity>`;
    } else {
        return `(x: ${value.x}, y: ${value.y}, z: ${value.z}, w: ${value.w})`;
    }
}
