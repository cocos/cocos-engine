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

/**
 * @en
 * Value proxies are used to set curve value to target. They are "generalized assignment".
 * Every value proxy associates with a target object.
 * @zh
 * 曲线值代理用来设置曲线值到目标，是广义的赋值。
 * 每个曲线值代理都关联着一个目标对象。
 */
export interface IValueProxy {
    /**
     * @en
     * Gets the value from the target.
     * This method is used for implementing component-wise animation in certain circumstance.
     * @zh
     * 从目标中获取值。某些情况下可能需要这个接口来实现分量动画。
     */
    get?: () => any;

    /**
     * @en
     * Sets a value.
     * @zh
     * 设置曲线值到目标对象上。
     */
    set: (value: any) => void;
}

export interface IValueProxyFactory {
    /**
     * @en
     * Returns a value proxy for specific target.
     * @zh
     * 返回指定目标的曲线值代理。
     * @param target The target acquiring the value proxy.
     * @returns The value proxy, or undefined if the proxy could not be created.
     * In later case, a warn should be given before returning.
     */
    forTarget (target: any): IValueProxy | undefined;
}
