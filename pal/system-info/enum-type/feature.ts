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

export enum Feature {
    /**
     * @en Feature to support Webp.
     * @zh 是否支持 Webp 特性。
     */
    WEBP = 'WEBP',
    /**
     * @en Feature to support Image Bitmap.
     * @zh 是否支持 Image Bitmap 特性。
     */
    IMAGE_BITMAP = 'IMAGE_BITMAP',
    /**
     * @en Feature to support Web View.
     * @zh 是否支持 Web View 特性。
     */
    WEB_VIEW = 'WEB_VIEW',
    /**
     * @en Feature to support Video Player.
     * @zh 是否支持 Video Player 特性。
     */
    VIDEO_PLAYER = 'VIDEO_PLAYER',
    /**
     * @en Feature to support Safe Area.
     * @zh 是否支持 Safe Area 特性。
     */
    SAFE_AREA = 'SAFE_AREA',

    /**
     * @en Feature to support HPE (high performance emulator) platforms, such as Google Play Games For PC.
     * @zh 是否支持 HPE 平台, 比如: Android 的 Google Play Games 在 PC 上的模拟器.
     */
    HPE = 'HPE',

    /**
     * @en Feature to support Touch Input.
     * Touch Input is only supported on some devices with touch screen.
     * This feature tells that whether the device has a touch screen.
     * @zh 是否支持触摸输入。
     * 触摸输入只在一些带触摸屏的设备上支持。
     * 这个特性旨在说明设备上是否带触摸屏。
     */
    INPUT_TOUCH = 'INPUT_TOUCH',
    /**
     * @en Feature to support dispatching EventKeyboard.
     * @zh 是否支持派发 EventKeyboard。
     */
    EVENT_KEYBOARD = 'EVENT_KEYBOARD',
    /**
     * @en Feature to support dispatching EventMouse.
     * @zh 是否支持派发 EventMouse。
     */
    EVENT_MOUSE = 'EVENT_MOUSE',
    /**
     * @en Feature to support dispatching EventTouch.
     * On some devices without touch screen, we still can simulate dispatching EventTouch from EventMouse.
     * @zh 是否支持派发 EventTouch。
     * 在一些不带触摸屏的设备上，我们仍然会从 EventMouse 模拟派发 EventTouch。
     */
    EVENT_TOUCH = 'EVENT_TOUCH',
    /**
     * @en Feature to support dispatching EventAcceleration.
     * @zh 是否支持派发 EventAcceleration。
     */
    EVENT_ACCELEROMETER = 'EVENT_ACCELEROMETER',
    /**
     * @en Feature to support dispatching EventGamepad.
     * @zh 是否支持派发 EventGamepad.
     */
    EVENT_GAMEPAD = 'EVENT_GAMEPAD',
    /**
     * @en Feature to support dispatching EventHandle.
     * @zh 是否支持派发 EventHandle
     */
    EVENT_HANDLE = 'EVENT_HANDLE',
    /**
     * @en Feature to support dispatching EventHMD.
     * @zh 是否支持派发 EventHMD
     */
    EVENT_HMD = 'EVENT_HMD',
    /**
     * @en Feature to support dispatching EventHandheld.
     * @zh 是否支持派发 EventHandheld
     */
    EVENT_HANDHELD = 'EVENT_HANDHELD',
    /**
     * @en Check whether Webassembly is supported at runtime. Generally, it needs to be checked when the constant `NATIVE_CODE_BUNDLE_MODE` is 2.
     * If it is not supported, you need to fallback to the Asm solution.
     * @zh 运行时检测是否支持 Webassembly，一般在宏 `NATIVE_CODE_BUNDLE_MODE` 为 2 时需要检测，如果不支持，需要回滚到 Asm 方案
     */
    WASM = 'WASM',
}
