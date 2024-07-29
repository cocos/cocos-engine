/*
 Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com

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
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { Material, Texture2D, gfx } from 'cc';

const { SampleCount } = gfx;

export class MSAA {
    enabled = false;
    sampleCount: gfx.SampleCount = SampleCount.X4;
}

export function fillRequiredMSAA(value: MSAA): void {
    value.enabled ??= false;
    value.sampleCount ??= SampleCount.X4;
}

export class HBAO {
    enabled = false;
    radiusScale = 1;
    angleBiasDegree = 10;
    blurSharpness = 3;
    aoSaturation = 1;
    needBlur = false;
}

export function fillRequiredHBAO(value: HBAO): void {
    value.enabled ??= false;
    value.radiusScale ??= 1;
    value.angleBiasDegree ??= 10;
    value.blurSharpness ??= 3;
    value.aoSaturation ??= 1;
    value.needBlur ??= false;
}

export class DepthOfField {
    enabled = false;
    /* refcount */ material: Material | null = null;
    focusDistance = 0;
    focusRange = 0;
    bokehRadius = 1;
}

export function fillRequiredDepthOfField(value: DepthOfField): void {
    value.enabled ??= false;
    value.material ??= null;
    value.focusDistance ??= 0;
    value.focusRange ??= 0;
    value.bokehRadius ??= 1;
}

export class Bloom {
    enabled = false;
    /* refcount */ material: Material | null = null;
    enableAlphaMask = false;
    iterations = 3;
    threshold = 0.8;
    intensity = 2.3;
}

export function fillRequiredBloom(value: Bloom): void {
    value.enabled ??= false;
    value.material ??= null;
    value.enableAlphaMask ??= false;
    value.iterations ??= 3;
    value.threshold ??= 0.8;
    value.intensity ??= 2.3;
}

export class ColorGrading {
    enabled = false;
    /* refcount */ material: Material | null = null;
    contribute = 1;
    /* refcount */ colorGradingMap: Texture2D | null = null;
}

export function fillRequiredColorGrading(value: ColorGrading): void {
    value.enabled ??= false;
    value.material ??= null;
    value.contribute ??= 1;
    value.colorGradingMap ??= null;
}

export class FSR {
    enabled = false;
    /* refcount */ material: Material | null = null;
    sharpness = 0.8;
}

export function fillRequiredFSR(value: FSR): void {
    value.enabled ??= false;
    value.material ??= null;
    value.sharpness ??= 0.8;
}

export class FXAA {
    enabled = false;
    /* refcount */ material: Material | null = null;
}

export function fillRequiredFXAA(value: FXAA): void {
    value.enabled ??= false;
    value.material ??= null;
}

export class ToneMapping {
    /* refcount */ material: Material | null = null;
}

export function fillRequiredToneMapping(value: ToneMapping): void {
    value.material ??= null;
}

export class PipelineSettings {
    readonly msaa: MSAA = new MSAA();
    enableShadingScale = false;
    shadingScale = 0.5;
    readonly depthOfField: DepthOfField = new DepthOfField();
    readonly bloom: Bloom = new Bloom();
    readonly toneMapping: ToneMapping = new ToneMapping();
    readonly colorGrading: ColorGrading = new ColorGrading();
    readonly fsr: FSR = new FSR();
    readonly fxaa: FXAA = new FXAA();
}

export function fillRequiredPipelineSettings(value: PipelineSettings): void {
    if (!value.msaa) {
        (value.msaa as MSAA) = new MSAA();
    } else {
        fillRequiredMSAA(value.msaa);
    }
    value.enableShadingScale ??= false;
    value.shadingScale ??= 0.5;
    if (!value.depthOfField) {
        (value.depthOfField as DepthOfField) = new DepthOfField();
    } else {
        fillRequiredDepthOfField(value.depthOfField);
    }
    if (!value.bloom) {
        (value.bloom as Bloom) = new Bloom();
    } else {
        fillRequiredBloom(value.bloom);
    }
    if (!value.toneMapping) {
        (value.toneMapping as ToneMapping) = new ToneMapping();
    } else {
        fillRequiredToneMapping(value.toneMapping);
    }
    if (!value.colorGrading) {
        (value.colorGrading as ColorGrading) = new ColorGrading();
    } else {
        fillRequiredColorGrading(value.colorGrading);
    }
    if (!value.fsr) {
        (value.fsr as FSR) = new FSR();
    } else {
        fillRequiredFSR(value.fsr);
    }
    if (!value.fxaa) {
        (value.fxaa as FXAA) = new FXAA();
    } else {
        fillRequiredFXAA(value.fxaa);
    }
}
