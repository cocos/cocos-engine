import { replaceProperty } from '../utils/x-deprecated';

import intersect from './intersect';
import { Line } from './line';
import { Plane } from './plane';
import { Ray } from './ray';
import { Triangle } from './triangle';
import { Sphere } from './sphere';
import { AABB } from './aabb';
import { OBB } from './obb';
import { Capsule } from './capsule';
import { Frustum } from './frustum';

replaceProperty(intersect, 'intersect', [
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

function deprecatedClassMessage (oldClassName: string, newClassName) {
    console.warn(`${oldClassName} is deprecated, please use ${newClassName} instead.`);
}

/**
 * Alias of [[Line]]
 * @deprecated Since v3.0
 */
export class line extends Line {
    constructor () {
        super();
        deprecatedClassMessage('line', 'Line');
    }
}

/**
 * Alias of [[Plane]]
 * @deprecated Since v3.0
 */
export class plane extends Plane {
    constructor () {
        super();
        deprecatedClassMessage('plane', 'Plane');
    }
}

/**
 * Alias of [[Ray]]
 * @deprecated Since v3.0
 */
export class ray extends Ray {
    constructor () {
        super();
        deprecatedClassMessage('ray', 'Ray');
    }
}

/**
 * Alias of [[Triangle]]
 * @deprecated Since v3.0
 */
export class triangle extends Triangle {
    constructor () {
        super();
        deprecatedClassMessage('triangle', 'Triangle');
    }
}

/**
 * Alias of [[Sphere]]
 * @deprecated Since v3.0
 */
export class sphere extends Sphere {
    constructor () {
        super();
        deprecatedClassMessage('sphere', 'Sphere');
    }
}

/**
 * Alias of [[AABB]]
 * @deprecated Since v3.0
 */
export class aabb extends AABB {
    constructor () {
        super();
        deprecatedClassMessage('aabb', 'AABB');
    }
}

/**
 * Alias of [[OBB]]
 * @deprecated Since v3.0
 */
export class obb extends OBB {
    constructor () {
        super();
        deprecatedClassMessage('obb', 'OBB');
    }
}

/**
 * Alias of [[Capsule]]
 * @deprecated Since v3.0
 */
export class capsule extends Capsule {
    constructor () {
        super();
        deprecatedClassMessage('capsule', 'Capsule');
    }
}

/**
 * Alias of [[Frustum]]
 * @deprecated Since v3.0
 */
export class frustum extends Frustum {
    constructor () {
        super();
        deprecatedClassMessage('frustum', 'Frustum');
    }
}
