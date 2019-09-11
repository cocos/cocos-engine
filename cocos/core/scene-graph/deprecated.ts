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
