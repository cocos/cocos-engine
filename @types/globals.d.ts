/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

declare const gfx: any;
declare const global: any;

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
declare const ActiveXObject: ActiveXObject;

declare const Buffer: any;
