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

/**
 * @en Direct Play enters and exits the control component: controls the following two APIs in Direct Play
        1. Monitor feed streams for entering/exiting mini game events,
        2. Cancel monitoring of feed streams entering/exiting mini game events.
        Can only run in a mini game environment
 *
 * @zh 直玩游戏进入退出管控组件： 管控直玩中的如下两个API.
        1.监听 Feed 流进入/退出小游戏事件,
        2.取消监听 Feed 流进入/退出小游戏事件。
        只能在小游戏环境运行
 */
import { _decorator } from '../core';
import { Component } from '../scene-graph/component';

const { ccclass } = _decorator;

declare const minigame: any;
@ccclass('FeedStatusController')
export class FeedStatusController extends Component {
    protected start (): void {
        if (minigame && minigame.onFeedStatusChange) {
            minigame.onFeedStatusChange(this.feedStatusChangeCallBack);
        }
    }

    protected feedStatusChangeCallBack (type: any): void {

    }

    protected onDestroy (): void {
        if (minigame && minigame.offFeedStatusChange) {
            minigame.offFeedStatusChange(this.feedStatusChangeCallBack);
        }
    }
}
