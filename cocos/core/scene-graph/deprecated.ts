/**
 * @hidden
 */

import { BaseNode } from './base-node';
import { replaceProperty, removeProperty } from '../utils/deprecated';
import { Layers } from './layers';
import { Node } from './node';

// js.get(BaseNode.prototype, 'childrenCount', function () {
//     cc.warn("`childrenCount` is deprecated, please use `node.children.length` instead.");
//     // @ts-ignore
//     return this.children.length;
// });

replaceProperty(BaseNode.prototype, 'BaseNode', [
    {
        'name': 'childrenCount',
        'newName': 'children.length',
        'customGetter': function (this: BaseNode) {
            return this.children.length;
        }
    }
]);

removeProperty(Layers, 'Layers', [
    {
        'name': 'addLayer',
    }
]);

removeProperty(Node.prototype, 'Node.prototype', [
    {
        'name': 'addLayer',
    },
    {
        'name': 'removeLayer',
    }
]);


replaceProperty(Layers, 'Layers', [
    {
        name: 'Default',
        newName: 'Enum.DEFAULT'
    },
    {
        name: 'Always',
        newName: 'Enum.ALWAYS'
    },
    {
        name: 'IgnoreRaycast',
        newName: 'Enum.IGNORE_RAYCAST'
    },
    {
        name: 'Gizmos',
        newName: 'Enum.GIZMOS'
    },
    {
        name: 'Editor',
        newName: 'Enum.EDITOR'
    },
    {
        name: 'UI',
        newName: 'Enum.UI'
    },
    {
        name: 'UI2D',
        newName: 'Enum.UI_2D'
    },
    {
        name: 'SceneGizmo',
        newName: 'Enum.SCENE_GIZMO'
    },
]);
