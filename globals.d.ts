/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 ****************************************************************************/

declare const CC_BUILD: boolean;
declare const CC_TEST: boolean;
declare const CC_EDITOR: boolean;
declare const CC_PREVIEW: boolean;
declare const CC_DEV: boolean;
declare const CC_DEBUG: boolean;
declare const CC_JSB: boolean;
declare const CC_WECHATGAME_SUB: boolean;
declare const CC_WECHATGAME: boolean;
declare const CC_QQPLAY: boolean;
declare const CC_RUNTIME: boolean;
declare const CC_SUPPORT_JIT: boolean;

declare const cc: any;

type RecursivePartial<T> = {
    [P in keyof T]?:
        T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
        T[P] extends ReadonlyArray<infer V> ? ReadonlyArray<RecursivePartial<V>> : RecursivePartial<T[P]>;
};

declare module "webgl-debug" {
    export function makeDebugContext(
        webGLRenderingContext: WebGLRenderingContext,
        throwOnGLError: (err: GLenum, funcName: string, ...args: any[]) => void
    ): WebGLRenderingContext;

    export function makeDebugContext(
        webGL2RenderingContext: WebGL2RenderingContext,
        throwOnGLError: (err: GLenum, funcName: string, ...args: any[]) => void
    ): WebGL2RenderingContext;

    export function glEnumToString(glEnum: GLenum): string;
}

declare namespace Editor {
    function log (message?: any, ...optionalParams: any[]): void;
    function error (message?: any, ...optionalParams: any[]): void;
    function warn (message?: any, ...optionalParams: any[]): void;
}
