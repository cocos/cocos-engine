import { replaceProperty } from '../deprecated';
import { BaseNode } from './base-node';

replaceProperty(BaseNode.prototype, 'BaseNode', [
    {
        name: 'childrenCount',
        custom: function () {
            return this.children.length;
        }
    }
]);