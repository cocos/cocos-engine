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

import { cclegacy } from '../../core';

import * as PolygonSeparator from './utils/polygon-separator';
import * as PolygonPartition from './utils/polygon-partition';

import { selector } from './physics-selector';

export * from './physics-types';

export * from './physics-system';

export * from '../spec/i-physics-contact';

// rigid body
export * from './components/rigid-body-2d';

// colliders
export * from './components/colliders/collider-2d';
export * from './components/colliders/box-collider-2d';
export * from './components/colliders/circle-collider-2d';
export * from './components/colliders/polygon-collider-2d';

// joints
export * from './components/joints/joint-2d';
export * from './components/joints/distance-joint-2d';
export * from './components/joints/spring-joint-2d';
export * from './components/joints/mouse-joint-2d';
export * from './components/joints/relative-joint-2d';
export * from './components/joints/slider-joint-2d';
export * from './components/joints/fixed-joint-2d';
export * from './components/joints/wheel-joint-2d';
export * from './components/joints/hinge-joint-2d';

export const Physics2DUtils = {
    PolygonSeparator,
    PolygonPartition,
};

export { selector };

cclegacy.internal.physics2d = {
    selector,
};
