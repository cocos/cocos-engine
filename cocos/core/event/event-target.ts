/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { legacyCC } from '../global-exports';
import { Eventify } from './eventify';

class Empty {}

/**
 * @en
 * EventTarget is an object to which an event is dispatched when something has occurred.
 * [[Node]]s are the most common event targets, but other objects can be event targets too.
 * If a class cannot extend from EventTarget, it can consider using [[Eventify]].
 *
 * @zh
 * 事件目标是具有注册监听器、派发事件能力的类，[[Node]] 是最常见的事件目标，
 * 但是其他类也可以继承自事件目标以获得管理监听器和派发事件的能力。
 * 如果无法继承自 EventTarget，也可以使用 [[Eventify]]
 */
export const EventTarget = Eventify(Empty);

export type EventTarget = InstanceType<typeof EventTarget>;

legacyCC.EventTarget = EventTarget;
