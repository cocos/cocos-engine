/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { VFXEmitter } from './vfx-emitter';
import { EventHandler } from './event-handler';
import { FloatExpression } from './expressions/float';
import { ColorExpression } from './expressions/color';
import './vfx-manager';
import { VFXRenderer } from './vfx-renderer';
import { VFXExpression } from './vfx-expression';

export {
    VFXEmitter,
    VFXRenderer,
    FloatExpression,
    ColorExpression,
    EventHandler,
    VFXExpression,
};

export * from './vfx-events';
export * from './particle-renderer';
export * from './vfx-parameter';
export * from './modules';
export * from './expressions';
export * from './renderers';
export * from './parameters';
export * from './emitter-data-set';
export * from './user-data-set';
