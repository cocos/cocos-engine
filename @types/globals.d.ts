/*
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
*/

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

declare const jsb: any;

declare const CC_PHYSICS_CANNON: boolean;
declare const CC_PHYSICS_AMMO: boolean;
declare const CC_PHYSICS_BUILT_IN: boolean;
interface Window {

    [x: string]: any;
    
    WebGL2RenderingContext: any;

    sharedCanvas: any;
    __canvas: any;
    canvas: any;

    XMLHttpRequest: any;
    mozRequestAnimationFrame (callback: any, element?: any): any;
    oRequestAnimationFrame (callback: any, element?: any): any;
    msRequestAnimationFrame (callback: any, element?: any): any;
    cancelRequestAnimationFrame (callback: any, element?: any): any;
    msCancelRequestAnimationFrame (callback: any, element?: any): any;
    mozCancelRequestAnimationFrame (callback: any, element?: any): any;
    oCancelRequestAnimationFrame (callback: any, element?: any): any;
    webkitCancelRequestAnimationFrame (callback: any, element?: any): any;
    msCancelAnimationFrame (callback: any, element?: any): any;
    mozCancelAnimationFrame (callback: any, element?: any): any;
    ocancelAnimationFrame (callback: any, element?: any): any;
}

interface Document{
    mozHidden: any;
    msHidden: any;
    webkitHidden: any;
}

interface HTMLElement{
    content: any;
    name: any;
}

type ActiveXObject = new (s: string) => any;
declare var ActiveXObject: ActiveXObject;

declare const cc: {
    // polyfills: {
    //     destroyObject? (object: any): void;
    // };
    [x: string]: any;
};

declare type CompareFunction<T> = (a: T, b: T) => number;

declare type RecursivePartial<T> = {
    [P in keyof T]?:
        T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
        T[P] extends ReadonlyArray<infer V> ? ReadonlyArray<RecursivePartial<V>> : RecursivePartial<T[P]>;
};

declare interface IWritableArrayLike<T> {
    readonly length: number;
    [index: number]: T;
}

declare type Constructor<T = {}> = new(...args: any[]) => T;

declare type Mutable<T> = { -readonly [P in keyof T]: T[P] };

declare type Getter = () => any;

declare type Setter = (value: any) => void;

declare namespace Editor {
    function log (message?: any, ...optionalParams: any[]): void;
    function error (message?: any, ...optionalParams: any[]): void;
    function warn (message?: any, ...optionalParams: any[]): void;
    function require (str: String): any;
    const isMainProcess: boolean | undefined;
    const Ipc: any;
    const Utils: any;
    const assets: any;
    const serialize: any;
    const Selection: any;
}

declare const Buffer: any;
