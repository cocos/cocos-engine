/*
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

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

import { Rect } from '../math';
import { legacyCC } from '../global-exports';

/**
 * @zh `visibleRect` is a singleton object which defines the actual visible rect of the current view.
 * @en `visibleRect` 是一个定义当前视图的实际可见矩形的单例对象。
 * @engineInternal
 */
export const visibleRect = {
    /**
     * @zh 与游戏场景有关的屏幕左上方坐标。
     * @en Top left coordinate of the screen related to the game scene.
     */
    topLeft: legacyCC.v2(0, 0),

    /**
     * @zh 与游戏场景有关的屏幕右上方坐标。
     * @en Top right coordinate of the screen related to the game scene.
     */
    topRight: legacyCC.v2(0, 0),

    /**
     * @zh 与游戏场景有关的屏幕上方中心坐标。
     * @en Top center coordinate of the screen related to the game scene.
     */
    top: legacyCC.v2(0, 0),

    /**
     * @zh 与游戏场景有关的屏幕左下坐标。
     * @en Bottom left coordinate of the screen related to the game scene.
     */
    bottomLeft: legacyCC.v2(0, 0),

    /**
     * @zh 与游戏场景有关的屏幕右下坐标。
     * @en Bottom right coordinate of the screen related to the game scene.
     */
    bottomRight: legacyCC.v2(0, 0),

    /**
     * @zh 与游戏场景有关的屏幕下方中心坐标。
     * @en Bottom center coordinate of the screen related to the game scene.
     */
    bottom: legacyCC.v2(0, 0),

    /**
     * @zh 与游戏场景有关的屏幕中心坐标。
     * @en Center coordinate of the screen related to the game scene.
     */
    center: legacyCC.v2(0, 0),

    /**
     * @zh 与游戏场景有关的屏幕左边中心坐标。
     * @en Left center coordinate of the screen related to the game scene.
     */
    left: legacyCC.v2(0, 0),

    /**
     * @zh 与游戏场景有关的屏幕右边中心坐标。
     * @en Right center coordinate of the screen related to the game scene.
     */
    right: legacyCC.v2(0, 0),

    /**
     * @zh 屏幕宽度。
     * @en Width of the screen.
     */
    width: 0,

    /**
     * @zh 屏幕高度。
     * @en Height of the screen.
     */
    height: 0,

    /**
     * @zh 初始化函数。
     * @en Initialization function.
     * @param visibleRect_ @zh 当前视图的实际可见区域。@en The actual visible area of the current view.
     * @NOTE: @zh 必须是有效的区域。例如区域大小不能为负数。@en It must be a valid region. For example, the region size cannot be negative.
     */
    init (visibleRect_: Rect): void {
        const w = this.width = visibleRect_.width;
        const h = this.height = visibleRect_.height;
        const l = visibleRect_.x;
        const b = visibleRect_.y;
        const t = b + h;
        const r = l + w;

        // top
        this.topLeft.x = l;
        this.topLeft.y = t;
        this.topRight.x = r;
        this.topRight.y = t;
        this.top.x = l + w / 2;
        this.top.y = t;

        // bottom
        this.bottomLeft.x = l;
        this.bottomLeft.y = b;
        this.bottomRight.x = r;
        this.bottomRight.y = b;
        this.bottom.x = l + w / 2;
        this.bottom.y = b;

        // center
        this.center.x = l + w / 2;
        this.center.y = b + h / 2;

        // left
        this.left.x = l;
        this.left.y = b + h / 2;

        // right
        this.right.x = r;
        this.right.y = b + h / 2;
    },
};

legacyCC.visibleRect = visibleRect;
