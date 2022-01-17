/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { ccclass, editable, serializable } from 'cc.decorator';
import { property } from '../data/decorators/property';
import { legacyCC } from '../global-exports';
import { _applyDecoratedDescriptor } from '../data/utils/decorator-jsb-utils';
import { baseNodePolyfill } from './base-node-dev';
const baseNodeProto: any = jsb.BaseNode.prototype;

baseNodeProto.createNode = null!;

export type BaseNode = jsb.BaseNode;
export const BaseNode = jsb.BaseNode;



const clsDecorator = ccclass('cc.BaseNode');

// const _class2$u = BaseNode;
//
// _applyDecoratedDescriptor(_class2$u.prototype, '_persistNode', [property], Object.getOwnPropertyDescriptor(_class2$u.prototype, '_persistNode'), _class2$u.prototype);
// _applyDecoratedDescriptor(_class2$u.prototype, 'name', [editable], Object.getOwnPropertyDescriptor(_class2$u.prototype, 'name'), _class2$u.prototype);
// _applyDecoratedDescriptor(_class2$u.prototype, 'children', [editable], Object.getOwnPropertyDescriptor(_class2$u.prototype, 'children'), _class2$u.prototype);
// _applyDecoratedDescriptor(_class2$u.prototype, 'active', [editable], Object.getOwnPropertyDescriptor(_class2$u.prototype, 'active'), _class2$u.prototype);
// _applyDecoratedDescriptor(_class2$u.prototype, 'activeInHierarchy', [editable], Object.getOwnPropertyDescriptor(_class2$u.prototype, 'activeInHierarchy'), _class2$u.prototype);
// _applyDecoratedDescriptor(_class2$u.prototype, 'parent', [editable], Object.getOwnPropertyDescriptor(_class2$u.prototype, 'parent'), _class2$u.prototype);
//
// const _descriptor$o = _applyDecoratedDescriptor(_class2$u.prototype, '_parent', [serializable], {
//     configurable: true,
//     enumerable: true,
//     writable: true,
//     initializer: function initializer () {
//         return null;
//     },
// });
// const _descriptor2$h = _applyDecoratedDescriptor(_class2$u.prototype, '_children', [serializable], {
//     configurable: true,
//     enumerable: true,
//     writable: true,
//     initializer: function initializer () {
//         return [];
//     },
// });
// const _descriptor3$b = _applyDecoratedDescriptor(_class2$u.prototype, '_active', [serializable], {
//     configurable: true,
//     enumerable: true,
//     writable: true,
//     initializer: function initializer () {
//         return true;
//     },
// });
// const _descriptor4$9 = _applyDecoratedDescriptor(_class2$u.prototype, '_components', [serializable], {
//     configurable: true,
//     enumerable: true,
//     writable: true,
//     initializer: function initializer () {
//         return [];
//     },
// });
// const _descriptor5$6 = _applyDecoratedDescriptor(_class2$u.prototype, '_prefab', [serializable], {
//     configurable: true,
//     enumerable: true,
//     writable: true,
//     initializer: function initializer () {
//         return null;
//     },
// });
//
baseNodeProto._ctor = function () {
//     // _initializerDefineProperty(_this, "_parent", _descriptor$o, _assertThisInitialized(_this));
//     // _initializerDefineProperty(_this, "_children", _descriptor2$h, _assertThisInitialized(_this));
//     // _initializerDefineProperty(_this, "_active", _descriptor3$b, _assertThisInitialized(_this));
//     // _initializerDefineProperty(_this, "_components", _descriptor4$9, _assertThisInitialized(_this));
//     // _initializerDefineProperty(_this, "_prefab", _descriptor5$6, _assertThisInitialized(_this));
};

clsDecorator(BaseNode);
baseNodePolyfill(BaseNode);
legacyCC._BaseNode = jsb.BaseNode;
