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

import { Event } from './event';
import { Acceleration } from '../acceleration';
import { SystemEventType } from '../event-enum';

/**
 * @en
 * The acceleration event.
 * @zh
 * 加速计事件。
 */
export class EventAcceleration extends Event {
    /**
     * @en The acceleration object
     * @zh 加速度对象
     */
    public acc: Acceleration;

    /**
     * @param acc - The acceleration
     * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
     */
    constructor (acc: Acceleration, bubbles?: boolean) {
        super(SystemEventType.DEVICEMOTION, bubbles);
        this.acc = acc;
    }
}

// TODO: this is an injected property, should be deprecated
// issue: https://github.com/cocos/cocos-engine/issues/14643
(Event as any).EventAcceleration = EventAcceleration;
