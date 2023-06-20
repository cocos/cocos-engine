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

function deprecatedClassMessage (oldClassName: string, newClassName): void {
    console.warn(`${oldClassName} is deprecated, please use ${newClassName} instead.`);
}

/**
 * @en
 * Alias of [[geometry.Line]]
 * @zh
 * [[geometry.Line]] 别名类
 *
 * @deprecated Since v3.0, please use Line instead
 */
export class line extends Line {
    constructor () {
        super();
        deprecatedClassMessage('line', 'Line');
    }
}

/**
 * @en
 * Alias of [[geometry.Plane]]
 *
 * @zh
 * [[geometry.Plane]] 别名类
 *
 * @deprecated Since v3.0, please use Plane instead
 */
export class plane extends Plane {
    constructor () {
        super();
        deprecatedClassMessage('plane', 'Plane');
    }
}

/**
 * @en
 * Alias of [[geometry.Ray]]
 * @zh
 * [[geometry.Ray]] 别名类
 * @deprecated Since v3.0, please use Ray instead
 */
export class ray extends Ray {
    constructor () {
        super();
        deprecatedClassMessage('ray', 'Ray');
    }
}

/**
 * @en
 * Alias of [[geometry.Triangle]]
 *
 * @zh
 * [[geometry.Triangle]] 别名类
 * @deprecated Since v3.0, please use Triangle instead
 */
export class triangle extends Triangle {
    constructor () {
        super();
        deprecatedClassMessage('triangle', 'Triangle');
    }
}

/**
 * @en
 * Alias of [[geometry.Sphere]]
 *
 * @zh
 * [[geometry.Sphere]] 别名类
 * @deprecated Since v3.0, please use Sphere instead
 */
export class sphere extends Sphere {
    constructor () {
        super();
        deprecatedClassMessage('sphere', 'Sphere');
    }
}

/**
 * @en
 * Alias of [[geometry.AABB]]
 *
 * @zh
 * [[geometry.AABB]] 别名类
 * @deprecated Since v3.0, please use AABB instead
 */
export class aabb extends AABB {
    constructor () {
        super();
        deprecatedClassMessage('aabb', 'AABB');
    }
}

/**
 * @en
 * Alias of [[geometry.OBB]]
 *
 * @zh
 * [[geometry.OBB]] 别名类
 * @deprecated Since v3.0, please use OBB instead
 */
export class obb extends OBB {
    constructor () {
        super();
        deprecatedClassMessage('obb', 'OBB');
    }
}

/**
 * @en
 * Alias of [[geometry.Capsule]]
 *
 * @zh
 * [[geometry.Capsule]] 别名类
 * @deprecated Since v3.0, please use Capsule instead
 */
export class capsule extends Capsule {
    constructor () {
        super();
        deprecatedClassMessage('capsule', 'Capsule');
    }
}

/**
 * @en
 * Alias of [[geometry.Frustum]]
 *
 * @zh
 * [[geometry.Frustum]] 别名类
 * @deprecated Since v3.0, please use Frustum instead
 */
export class frustum extends Frustum {
    constructor () {
        super();
        deprecatedClassMessage('frustum', 'Frustum');
    }
}
