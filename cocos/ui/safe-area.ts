/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

/**
 * @packageDocumentation
 * @module ui
 */

import { ccclass, help, executionOrder, menu, executeInEditMode, requireComponent } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { screenAdapter } from 'pal/screen-adapter';
import { Component } from '../core/components';
import { UITransform } from '../2d/framework';
import { view, sys } from '../core/platform';
import { Widget } from './widget';
import { widgetManager } from './widget-manager';

/**
 * @en
 * This component is used to adjust the layout of current node to respect the safe area of a notched mobile device such as the iPhone X.
 * It is typically used for the top node of the UI interaction area. For specific usage, refer to the official [test-cases-3d/assets/cases/ui/20.safe-area/safe-area.scene](https://github.com/cocos-creator/test-cases-3d).
 *
 * The concept of safe area is to give you a fixed inner rectangle in which you can safely display content that will be drawn on screen.
 * You are strongly discouraged from providing controls outside of this area. But your screen background could embellish edges.
 *
 * This component internally uses the API `sys.getSafeAreaRect();` to obtain the safe area of the current iOS or Android device,
 * and implements the adaptation by using the Widget component and set anchor.
 *
 * @zh
 * 该组件会将所在节点的布局适配到 iPhone X 等异形屏手机的安全区域内，通常用于 UI 交互区域的顶层节点，具体用法可参考官方范例 [test-cases-3d/assets/cases/ui/20.safe-area/safe-area.scene](https://github.com/cocos-creator/test-cases-3d)。
 *
 * 该组件内部通过 API `sys.getSafeAreaRect();` 获取到当前 iOS 或 Android 设备的安全区域，并通过 Widget 组件实现适配。
 *
 */

@ccclass('cc.SafeArea')
@help('i18n:cc.SafeArea')
@executionOrder(110)
@executeInEditMode
@menu('UI/SafeArea')
@requireComponent(Widget)
export class SafeArea extends Component {
    public onEnable () {
        this.updateArea();
        // IDEA: need to delay the callback on Native platform ?
        screenAdapter.on('resolution-change', this.updateArea, this);
        screenAdapter.on('orientation-change', this.updateArea, this);
    }

    public onDisable () {
        screenAdapter.off('resolution-change', this.updateArea, this);
        screenAdapter.off('orientation-change', this.updateArea, this);
    }

    /**
     * @en Adapt to safe area
     * @zh 立即适配安全区域
     * @method updateArea
     * @example
     * let safeArea = this.node.addComponent(cc.SafeArea);
     * safeArea.updateArea();
     */
    public updateArea () {
        // TODO Remove Widget dependencies in the future
        const widget = this.node.getComponent(Widget) as Widget;
        const uiTransComp = this.node.getComponent(UITransform) as UITransform;
        if (!widget || !uiTransComp) {
            return;
        }

        if (EDITOR) {
            widget.top = widget.bottom = widget.left = widget.right = 0;
            widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
            return;
        }
        // IMPORTANT: need to update alignment to get the latest position
        widget.updateAlignment();
        const lastPos = this.node.position.clone();
        const lastAnchorPoint = uiTransComp.anchorPoint.clone();
        //
        widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
        const visibleSize = view.getVisibleSize();
        const screenWidth = visibleSize.width;
        const screenHeight = visibleSize.height;
        const safeArea = sys.getSafeAreaRect();
        widget.top = screenHeight - safeArea.y - safeArea.height;
        widget.bottom = safeArea.y;
        widget.left = safeArea.x;
        widget.right = screenWidth - safeArea.x - safeArea.width;
        widget.updateAlignment();
        // set anchor, keep the original position unchanged
        const curPos = this.node.position.clone();
        const anchorX = lastAnchorPoint.x - (curPos.x - lastPos.x) / uiTransComp.width;
        const anchorY = lastAnchorPoint.y - (curPos.y - lastPos.y) / uiTransComp.height;
        uiTransComp.setAnchorPoint(anchorX, anchorY);
        // IMPORTANT: restore to lastPos even if widget is not ALWAYS
        widgetManager.add(widget);
    }
}
