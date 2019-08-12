import { BaseNode } from './base-node';
import { replaceProperty } from '../deprecated';

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