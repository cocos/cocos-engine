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
import type {
    NativeRenderDrawInfo as N2dNativeRenderDrawInfo,
    NativeBatcher2d as N2dNativeBatcher2d,
    NativeUIMeshBuffer as N2dNativeUIMeshBuffer,
    NativeRenderEntity as N2dNativeRenderEntity,
    NativeUIModelProxy as N2dNativeUIModelProxy,
    NativeStencilManager as N2dNativeStencilManager,
} from './native-2d';

// 2d
declare const n2d: any;

export const NativeRenderDrawInfo: typeof N2dNativeRenderDrawInfo = n2d.RenderDrawInfo;
export type NativeRenderDrawInfo = N2dNativeRenderDrawInfo;
export const NativeBatcher2d: typeof N2dNativeBatcher2d = n2d.Batcher2d;
export type NativeBatcher2d = N2dNativeBatcher2d;
export const NativeUIMeshBuffer: typeof N2dNativeUIMeshBuffer = n2d.UIMeshBuffer;
export type NativeUIMeshBuffer = N2dNativeUIMeshBuffer;
export const NativeRenderEntity: typeof N2dNativeRenderEntity = n2d.RenderEntity;
export type NativeRenderEntity = N2dNativeRenderEntity;
export const NativeUIModelProxy: typeof N2dNativeUIModelProxy = n2d.UIModelProxy;
export type NativeUIModelProxy = N2dNativeUIModelProxy;
export const NativeStencilManager: typeof N2dNativeStencilManager = n2d.StencilManager;
export type NativeStencilManager = N2dNativeStencilManager;