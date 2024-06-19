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
import { CCBoolean, CCFloat, CCInteger, cclegacy } from '../../../core';
import { ccclass, disallowMultiple, editable, executeInEditMode,
    menu, range, rangeMax, rangeMin, requireComponent, serializable, slide, tooltip, type } from '../../../core/data/decorators';
import { Camera } from '../../../misc/camera-component';
import { Component } from '../../../scene-graph';
import { fillRequiredPipelineSettings, makePipelineSettings, PipelineSettings } from '../settings';
import { property } from '../../../core/data/decorators/property';
import { Material, Texture2D } from '../../../asset/assets';

@ccclass('cc.BuiltinPipelineSettings')
@menu('Rendering/BuiltinPipelineSettings')
@requireComponent(Camera)
@disallowMultiple
@executeInEditMode
export class BuiltinPipelineSettings extends Component {
    @serializable
    readonly settings: PipelineSettings = makePipelineSettings();

    // Enable/Disable
    onEnable (): void {
        fillRequiredPipelineSettings(this.settings);

        const cameraComponent = this.getComponent(Camera) as Camera;
        const camera = cameraComponent.camera;
        camera.pipelineSettings = this.settings;

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

    // Editor Preview
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
        if (cclegacy.rendering === undefined) {
            return;
        }
        if (this._editorPreview) {
            const camera = (this.getComponent(Camera) as Camera).camera;
            cclegacy.rendering.setEditorPipelineSettings(this.settings, camera);
        } else {
            this._disableEditorPreview();
        }
    }
    private _disableEditorPreview (): void {
        if (cclegacy.rendering === undefined) {
            return;
        }
        const current = cclegacy.rendering.getEditorPipelineSettings();
        if (current === this.settings) {
            cclegacy.rendering.setEditorPipelineSettings(null);
        }
    }

    // MSAA
    @type(CCBoolean)
    set MsaaEnable (value: boolean) {
        this.settings.msaa.enabled = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get MsaaEnable (): boolean {
        return this.settings.msaa.enabled;
    }

    @range([2, 8, 2])
    @property
    set msaaSampleCount (value: number) {
        value = 2 ** Math.ceil(Math.log2(Math.max(value, 2)));
        value = Math.min(value, 8);
        this.settings.msaa.sampleCount = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get msaaSampleCount (): number {
        return this.settings.msaa.sampleCount;
    }

    // Shading Scale
    @type(CCBoolean)
    set shadingScaleEnable (value: boolean) {
        this.settings.enableShadingScale = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get shadingScaleEnable (): boolean {
        return this.settings.enableShadingScale;
    }

    @tooltip('i18n:postprocess.shadingScale')
    @slide
    @range([0.01, 4, 0.01])
    @property
    set shadingScale (value: number) {
        this.settings.shadingScale = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get shadingScale (): number {
        return this.settings.shadingScale;
    }

    // DepthOfField
    @type(CCBoolean)
    set ppDofEnable (value: boolean) {
        this.settings.depthOfField.enabled = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get ppDofEnable (): boolean {
        return this.settings.depthOfField.enabled;
    }

    @editable
    @type(Material)
    set ppDofMaterial (value: Material) {
        this.settings.depthOfField.material = value;
    }
    get ppDofMaterial (): Material {
        return this.settings.depthOfField.material!;
    }

    @rangeMin(0)
    @type(CCFloat)
    set ppDofFocusDistance (value: number) {
        this.settings.depthOfField.focusDistance = value;
    }
    get ppDofFocusDistance (): number {
        return this.settings.depthOfField.focusDistance;
    }

    @rangeMin(0)
    @type(CCFloat)
    set ppDofFocusRange (value: number) {
        this.settings.depthOfField.focusRange = value;
    }
    get ppDofFocusRange (): number {
        return this.settings.depthOfField.focusRange;
    }

    @slide
    @range([1, 10, 0.01])
    @rangeMin(1.0)
    @type(CCFloat)
    set ppDofBokehRadius (value: number) {
        this.settings.depthOfField.bokehRadius = value;
    }
    get ppDofBokehRadius (): number {
        return this.settings.depthOfField.bokehRadius;
    }

    // Bloom
    @type(CCBoolean)
    set ppBloomEnable (value: boolean) {
        this.settings.bloom.enabled = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get ppBloomEnable (): boolean {
        return this.settings.bloom.enabled;
    }

    @editable
    @type(Material)
    set ppBloomMaterial (value: Material) {
        this.settings.bloom.material = value;
    }
    get ppBloomMaterial (): Material {
        return this.settings.bloom.material!;
    }

    @tooltip('i18n:bloom.enableAlphaMask')
    @type(CCBoolean)
    set ppBloomEnableAlphaMask (value: boolean) {
        this.settings.bloom.enableAlphaMask = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get ppBloomEnableAlphaMask (): boolean {
        return this.settings.bloom.enableAlphaMask;
    }

    @tooltip('i18n:bloom.iterations')
    @slide
    @range([1, 6, 1])
    @type(CCInteger)
    set ppBloomIterations (value: number) {
        this.settings.bloom.iterations = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get ppBloomIterations (): number {
        return this.settings.bloom.iterations;
    }

    @tooltip('i18n:bloom.threshold')
    @rangeMin(0)
    @type(CCFloat)
    set ppBloomThreshold (value: number) {
        this.settings.bloom.threshold = value;
    }
    get ppBloomThreshold (): number {
        return this.settings.bloom.threshold;
    }

    @tooltip('i18n:bloom.intensity')
    @rangeMin(0)
    @type(CCFloat)
    set ppBloomIntensity (value: number) {
        this.settings.bloom.intensity = value;
    }
    get ppBloomIntensity (): number {
        return this.settings.bloom.intensity;
    }

    // Color Grading (LDR)
    @type(CCBoolean)
    set ppLdrColorGradingEnable (value: boolean) {
        this.settings.colorGrading.enabled = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get ppLdrColorGradingEnable (): boolean {
        return this.settings.colorGrading.enabled;
    }

    @editable
    @type(Material)
    set ppLdrColorGradingMaterial (value: Material) {
        this.settings.colorGrading.material = value;
    }
    get ppLdrColorGradingMaterial (): Material {
        return this.settings.colorGrading.material!;
    }

    @tooltip('i18n:color_grading.contribute')
    @slide
    @range([0, 1, 0.01])
    @type(CCFloat)
    set ppLdrColorGradingContribute (value: number) {
        this.settings.colorGrading.contribute = value;
    }
    get ppLdrColorGradingContribute (): number {
        return this.settings.colorGrading.contribute;
    }

    @tooltip('i18n:color_grading.originalMap')
    @type(Texture2D)
    set ppLdrColorGradingMap (val: Texture2D) {
        this.settings.colorGrading.colorGradingMap = val;
    }
    get ppLdrColorGradingMap (): Texture2D {
        return this.settings.colorGrading.colorGradingMap!;
    }

    // FXAA
    @type(CCBoolean)
    set ppFxaaEnable (value: boolean) {
        this.settings.fxaa.enabled = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get ppFxaaEnable (): boolean {
        return this.settings.fxaa.enabled;
    }

    @editable
    @type(Material)
    set ppFxaaMaterial (value: Material) {
        this.settings.fxaa.material = value;
    }
    get ppFxaaMaterial (): Material {
        return this.settings.fxaa.material!;
    }

    // FSR
    @type(CCBoolean)
    set fsrEnable (value: boolean) {
        this.settings.fsr.enabled = value;
        if (EDITOR) {
            this._tryEnableEditorPreview();
        }
    }
    get fsrEnable (): boolean {
        return this.settings.fsr.enabled;
    }

    @editable
    @type(Material)
    set ppFsrMaterial (value: Material) {
        this.settings.fsr.material = value;
    }
    get ppFsrMaterial (): Material {
        return this.settings.fsr.material!;
    }

    @slide
    @range([0, 1, 0.01])
    @rangeMin(0)
    @rangeMax(1)
    @type(CCFloat)
    set fsrSharpness (value: number) {
        this.settings.fsr.sharpness = value;
    }
    get fsrSharpness (): number {
        return this.settings.fsr.sharpness;
    }

    @editable
    @type(Material)
    set copyMaterial (value: Material) {
        this.settings.copyMaterial = value;
    }
    get copyMaterial (): Material {
        return this.settings.copyMaterial!;
    }
}
