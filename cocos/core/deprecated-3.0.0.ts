import { replaceProperty, removeProperty } from './utils/x-deprecated';
import * as geometry from './geometry';

replaceProperty(geometry, 'geometry', [
    {
        name: 'intersect',
        newName: 'Intersect',
    },
    {
        name: 'line',
        newName: 'Line',
    },
    {
        name: 'plane',
        newName: 'Plane',
    },
    {
        name: 'ray',
        newName: 'Ray',
    },
    {
        name: 'triangle',
        newName: 'Triangle',
    },
    {
        name: 'sphere',
        newName: 'Sphere',
    },
    {
        name: 'aabb',
        newName: 'AABB',
    },
    {
        name: 'obb',
        newName: 'OBB',
    },
    {
        name: 'capsule',
        newName: 'Capsule',
    },
    {
        name: 'frustum',
        newName: 'Frustum',
    },
]);
