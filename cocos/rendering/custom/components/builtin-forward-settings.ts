/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.
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

import { EDITOR } from 'internal:constants';
import { CCFloat, cclegacy } from '../../../core';
import { ccclass, disallowMultiple, executeInEditMode,
    menu, range, rangeMin, requireComponent, serializable, slide, type } from '../../../core/data/decorators';
import { Camera } from '../../../misc/camera-component';
import { Component } from '../../../scene-graph';
import { makePipelineSettings, PipelineSettings } from '../settings';
import { property } from '../../../core/data/decorators/property';

@ccclass('cc.BuiltinPipelineSettings')
@menu('Rendering/BuiltinPipelineSettings')
@requireComponent(Camera)
@disallowMultiple
@executeInEditMode
export class BuiltinPipelineSettings extends Component {
    settings: PipelineSettings = makePipelineSettings();

    @serializable
    protected _editorPreview = false;
    @property
    get editorPreview (): boolean {
        return this._editorPreview;
    }
    set editorPreview (v: boolean) {
        this._editorPreview = v;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    private _tryEnableEditorPreview (): void {
        if (this._editorPreview) {
            const camera = (this.getComponent(Camera) as Camera).camera;
            cclegacy.rendering.setEditorPipelineSettings(this.settings, camera);
        } else {
            this._disableEditorPreview();
        }
    }
    private _disableEditorPreview (): void {
        const current = cclegacy.rendering.getEditorPipelineSettings();
        if (current === this.settings) {
            cclegacy.rendering.setEditorPipelineSettings(null);
        }
    }
    // Enable/Disable
    onEnable (): void {
        const cameraComponent = this.getComponent(Camera) as Camera;
        const camera = cameraComponent.camera;
        camera.pipelineSettings = this.settings;

        this.settings.bloom.enabled = true;
        this.settings.depthOfField.enabled = true;

        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    onDisable (): void {
        const cameraComponent = this.getComponent(Camera) as Camera;
        const camera = cameraComponent.camera;
        camera.pipelineSettings = null;

        if (EDITOR) {
            this._disableEditorPreview();
        }
    }
    // DepthOfField
    @rangeMin(0)
    @type(CCFloat)
    set focusDistance (value: number) {
        this.settings.depthOfField.focusDistance = value;
    }
    get focusDistance (): number {
        return this.settings.depthOfField.focusDistance;
    }

    @rangeMin(0)
    @type(CCFloat)
    set focusRange (value: number) {
        this.settings.depthOfField.focusRange = value;
    }
    get focusRange (): number {
        return this.settings.depthOfField.focusRange;
    }

    @slide
    @range([1, 10, 0.01])
    @rangeMin(1.0)
    @type(CCFloat)
    set bokehRadius (value: number) {
        this.settings.depthOfField.bokehRadius = value;
    }
    get bokehRadius (): number {
        return this.settings.depthOfField.bokehRadius;
    }
}
