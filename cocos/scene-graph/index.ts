/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
import './component-event-handler.schema';

import './node-event-processor';
import './deprecated';
import './deprecated-3.7.0';
// @deprecated since v3.7, please use Node instead.
export { Node } from './node';
export { Node as BaseNode } from './node'; //reserve BaseNode for compatibility. Note: should export it after export Node.
export { Scene } from './scene';
export { Layers } from './layers';
export { find } from './find';
export * from './node-enum';
export * from './node-event';
export * from './scene-globals';
export { EventHandler } from './component-event-handler';
export { Component } from './component';
export * from './deprecated';
export { default as NodeActivator } from './node-activator';
export { Prefab } from './prefab';
