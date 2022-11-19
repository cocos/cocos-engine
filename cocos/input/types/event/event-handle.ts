/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

import { HandleInputDevice } from 'pal/input';
import { Event } from './event';
import { SystemEventTypeUnion } from '../event-enum';

/**
 * @en
 * The 6DOF handle event.
 *
 * @zh
 * 6DOF手柄事件。
 */
export class EventHandle extends Event {
    /**
     * @en The handle device which trigger the current handle event
     * @zh 触发当前手柄事件的手柄设备
     */
     public handleInputDevice: HandleInputDevice;

    /**
     * @param eventType - The type of the event
     * @param handleInputDevice - The handle device which trigger the current handle event
     */
    constructor (eventType: SystemEventTypeUnion, handleInputDevice: HandleInputDevice) {
        super(eventType, false);
        this.handleInputDevice = handleInputDevice;
    }
}
