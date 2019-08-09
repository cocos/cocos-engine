import { BaseNode } from './base-node';
import { js } from '../core/utils/js';

js.get(BaseNode.prototype, 'childrenCount', function () {
    cc.warn("`childrenCount` is deprecated, please use `node.children.length` instead.");
    // @ts-ignore
    return this.children.length;
});