/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import './polyfill-legacy-cc';
import './deprecated-3.0.0';
import './deprecated-3.5.0';

export * from './base/descriptor-set';
export * from './base/buffer';
export * from './base/command-buffer';
export * from './base/define';
export * from './base/device';
export * from './base/swapchain';
export * from './base/framebuffer';
export * from './base/input-assembler';
export * from './base/descriptor-set-layout';
export * from './base/pipeline-layout';
export * from './base/pipeline-state';
export * from './base/queue';
export * from './base/render-pass';
export * from './base/states/sampler';
export * from './base/shader';
export * from './base/texture';
export * from './base/states/general-barrier';
export * from './base/states/texture-barrier';
export * from './device-manager';
