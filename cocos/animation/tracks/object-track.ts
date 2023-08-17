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

import { ccclass } from 'cc.decorator';
import { ObjectCurve } from '../../core';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { SingleChannelTrack } from './track';

/**
 * @en
 * An object track animates an object of attribute of target.
 * @zh
 * 对象轨道描述目标上某个对象类型的属性的动画。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}ObjectTrack`)
export class ObjectTrack<T> extends SingleChannelTrack<ObjectCurve<T>> {
    /**
     * @internal
     */
    protected createCurve (): ObjectCurve<T> {
        return new ObjectCurve<T>();
    }
}
