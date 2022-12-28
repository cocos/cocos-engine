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

import { ccclass, help, menu } from 'cc.decorator';
import { Component } from '../scene-graph/component';
import { Event } from '../input/types';
import { NodeEventType } from '../scene-graph/node-event';

const BlockEvents = [NodeEventType.TOUCH_START, NodeEventType.TOUCH_END, NodeEventType.TOUCH_MOVE,
    NodeEventType.MOUSE_DOWN, NodeEventType.MOUSE_MOVE, NodeEventType.MOUSE_UP,
    NodeEventType.MOUSE_ENTER, NodeEventType.MOUSE_LEAVE, NodeEventType.MOUSE_WHEEL];

function stopPropagation (event: Event) {
    event.propagationStopped = true;
}

/**
 * @en
 * This component will block all input events (mouse and touch) within the size of the node,
 * preventing the input from penetrating into the underlying node, typically for the background of the top UI.<br>
 * This component does not have any API interface and can be added directly to the scene to take effect.
 * @zh
 * 该组件将拦截所属节点尺寸内的所有输入事件（鼠标和触摸），防止输入穿透到下层节点，一般用于上层 UI 的背景。<br>
 * 该组件没有任何 API 接口，直接添加到场景即可生效。
 */
@ccclass('cc.BlockInputEvents')
@help('i18n:cc.BlockInputEvents')
@menu('Event/BlockInputEvents')
export class BlockInputEvents extends Component {
    onEnable () {
        for (let i = 0; i < BlockEvents.length; i++) {
            // supply the 'this' parameter so that the callback could be added and removed correctly,
            // even if the same component is added more than once to a Node.
            this.node.on(BlockEvents[i], stopPropagation, this);
        }
    }

    onDisable () {
        for (let i = 0; i < BlockEvents.length; i++) {
            this.node.off(BlockEvents[i], stopPropagation, this);
        }
    }
}
