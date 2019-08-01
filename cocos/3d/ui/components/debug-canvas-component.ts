/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
/**
 * @category ui
 * @hidden
 */
/** */

import { ccclass, executionOrder, requireComponent } from '../../../core/data/class-decorator';
import { Vec3 } from '../../../core/math';
import { GFXClearFlag } from '../../../gfx/define';
import { CanvasComponent } from './canvas-component';
import { UITransformComponent } from './ui-transfrom-component';
import { Node } from '../../../scene-graph';

const _worldPos = new Vec3();

/**
 * @zh
 * 性能显示面板类。
 */
@ccclass('cc.DebugCanvasComponent')
@executionOrder(100)
@requireComponent(UITransformComponent)
export class DebugCanvasComponent extends CanvasComponent {
    constructor () {
        super();
        this._thisOnResized = this.alignWithScreen.bind(this);
    }

    public __preload () {
        const cameraNode = new Node('UICamera_Debug');
        cameraNode.setPosition(0, 0, 1000);

        this._camera = cc.director.root.ui.renderScene.createCamera({
            name: 'ui_Debug',
            node: cameraNode,
            projection: cc.CameraComponent.ProjectionType.ORTHO,
            priority: this._priority,
            isUI: true,
            flows: ['UIFlow'],
        });

        this._camera!.fov = 45;
        this._camera!.clearFlag = GFXClearFlag.COLOR | GFXClearFlag.DEPTH | GFXClearFlag.STENCIL;

        const device = cc.director.root.device;
        this._camera!.resize(device.width, device.height);

        cc.view.on('design-resolution-changed', this._thisOnResized);

        this.alignWithScreen();

        if (cc.director.root && cc.director.root.ui) {
            cc.director.root.ui.debugScreen = this;
        }
    }

    // don't remove
    public onEnable () {
    }

    // don't remove
    public onDisable () {
    }

    public onDestroy () {
        if (this._camera) {
            this._getRenderScene().destroyCamera(this._camera);
        }

        cc.view.off('design-resolution-changed', this._thisOnResized);
        if (cc.director.root && cc.director.root.ui) {
            cc.director.root.ui.debugScreen = null;
        }
    }

    public alignWithScreen () {
        const canvasSize = cc.visibleRect;
        const nodeSize = canvasSize;
        const designSize = cc.view.getDesignResolutionSize();
        const policy = cc.view.getResolutionPolicy();
        // const clipTopRight = !this.fitHeight && !this.fitWidth;
        const clipTopRight = policy === cc.ResolutionPolicy.NO_BORDER;
        let offsetX = 0;
        let offsetY = 0;
        if (clipTopRight) {
            // offset the canvas to make it in the center of screen
            offsetX = (designSize.width - canvasSize.width) * 0.5;
            offsetY = (designSize.height - canvasSize.height) * 0.5;
        }
        this.node.setPosition(canvasSize.width * 0.5 + offsetX, canvasSize.height * 0.5 + offsetY, 1);

        if (this.node.width !== nodeSize.width) {
            this.node.width = nodeSize.width;
        }

        if (this.node.height !== nodeSize.height) {
            this.node.height = nodeSize.height;
        }

        this.node.getWorldPosition(_worldPos);
        if (this._camera) {
            const size = cc.view.getVisibleSize();
            this._camera.resize(size.width, size.height);
            this._camera.orthoHeight = this._camera.height / 2;
            this._camera.node.setPosition(_worldPos.x, _worldPos.y, 1000);
            this._camera.update();
        }
    }

    // don't remove
    public applySettings () {
    }

}

cc.DebugCanvasComponent = DebugCanvasComponent;
