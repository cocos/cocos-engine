import { replaceProperty, removeProperty } from '../utils/x-deprecated';

import Intersect from './intersect';
import { Line } from './line';
import { Plane } from './plane';
import { Ray } from './ray';
import { Triangle } from './triangle';
import { Sphere } from './sphere';
import { AABB } from './aabb';
import { OBB } from './obb';
import { Capsule } from './capsule';
import { Frustum } from './frustum';

replaceProperty(Intersect, 'Intersect', [
    {
        name: 'ray_aabb',
        newName: 'rayAABB',
    },
    {
        name: 'ray_plane',
        newName: 'rayPlane',
    },
    {
        name: 'ray_triangle',
        newName: 'rayTriangle',
    },
    {
        name: 'ray_sphere',
        newName: 'raySphere',
    },
    {
        name: 'ray_obb',
        newName: 'rayOBB',
    },
    {
        name: 'ray_capsule',
        newName: 'rayCapsule',
    },
    {
        name: 'ray_subMesh',
        newName: 'raySubMesh',
    },
    {
        name: 'ray_mesh',
        newName: 'rayMesh',
    },
    {
        name: 'ray_model',
        newName: 'rayModel',
    },
    {
        name: 'line_plane',
        newName: 'linePlane',
    },
    {
        name: 'line_triangle',
        newName: 'lineTriangle',
    },
    {
        name: 'line_aabb',
        newName: 'lineAABB',
    },
    {
        name: 'line_obb',
        newName: 'lineOBB',
    },
    {
        name: 'line_sphere',
        newName: 'lineSphere',
    },
    {
        name: 'aabb_aabb',
        newName: 'aabbWithAABB',
    },
    {
        name: 'aabb_obb',
        newName: 'aabbWithOBB',
    },
    {
        name: 'aabb_plane',
        newName: 'aabbPlane',
    },
    {
        name: 'aabb_frustum',
        newName: 'aabbFrustum',
    },
    {
        name: 'aabbFrustum_accurate',
        newName: 'aabbFrustumAccurate',
    },
    {
        name: 'obb_point',
        newName: 'obbPoint',
    },
    {
        name: 'obb_plane',
        newName: 'obbPlane',
    },
    {
        name: 'obb_frustum',
        newName: 'obbFrustum',
    },
    {
        name: 'obbFrustum_accurate',
        newName: 'obbFrustumAccurate',
    },
    {
        name: 'obb_obb',
        newName: 'obbWithOBB',
    },
    {
        name: 'obb_capsule',
        newName: 'obbCapsule',
    },
    {
        name: 'sphere_plane',
        newName: 'spherePlane',
    },
    {
        name: 'sphere_frustum',
        newName: 'sphereFrustum',
    },
    {
        name: 'sphereFrustum_accurate',
        newName: 'sphereFrustumAccurate',
    },
    {
        name: 'sphere_sphere',
        newName: 'sphereWithSphere',
    },
    {
        name: 'sphere_aabb',
        newName: 'sphereAABB',
    },
    {
        name: 'sphere_obb',
        newName: 'sphereOBB',
    },
    {
        name: 'sphere_capsule',
        newName: 'sphereCapsule',
    },
    {
        name: 'capsule_capsule',
        newName: 'capsuleWithCapsule',
    },
]);

/**
 * Alias of [[Intersect]]
 * @deprecated Since v3.0
 */
// export const intersect = Intersect;

/**
 * Alias of [[Line]]
 * @deprecated Since v3.0
 */
export class line extends Line{};

/**
 * Alias of [[Plane]]
 * @deprecated Since v3.0
 */
export class plane extends Plane{};

/**
 * Alias of [[Ray]]
 * @deprecated Since v3.0
 */
export class ray extends Ray{};

/**
 * Alias of [[Triangle]]
 * @deprecated Since v3.0
 */
export class triangle extends Triangle{};

/**
 * Alias of [[Sphere]]
 * @deprecated Since v3.0
 */
export class sphere extends Sphere{};

/**
 * Alias of [[AABB]]
 * @deprecated Since v3.0
 */
export class aabb extends AABB{};

/**
 * Alias of [[OBB]]
 * @deprecated Since v3.0
 */
export class obb extends OBB{};

/**
 * Alias of [[Capsule]]
 * @deprecated Since v3.0
 */
export class capsule extends Capsule{};

/**
 * Alias of [[Frustum]]
 * @deprecated Since v3.0
 */
export class frustum extends Frustum{};



