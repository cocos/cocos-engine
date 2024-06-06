/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
****************************************************************************/

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { Texture } from '../../gfx';

export interface HBAO {
    enabled: boolean; /*false*/
    radiusScale: number; /*1*/
    angleBiasDegree: number; /*10*/
    blurSharpness: number; /*3*/
    aoSaturation: number; /*1*/
    needBlur: boolean; /*false*/
    [name: string]: unknown;
}

export function makeHBAO (): HBAO {
    return {
        enabled: false,
        radiusScale: 1,
        angleBiasDegree: 10,
        blurSharpness: 3,
        aoSaturation: 1,
        needBlur: false,
    };
}

export interface DepthOfField {
    enabled: boolean; /*false*/
    focusDistance: number; /*0*/
    focusRange: number; /*0*/
    bokehRadius: number; /*1*/
    [name: string]: unknown;
}

export function makeDepthOfField (): DepthOfField {
    return {
        enabled: false,
        focusDistance: 0,
        focusRange: 0,
        bokehRadius: 1,
    };
}

export interface Bloom {
    enabled: boolean; /*false*/
    enableAlphaMask: boolean; /*false*/
    useHdrIlluminance: boolean; /*false*/
    iterations: number; /*3*/
    threshold: number; /*0.8*/
    intensity: number; /*2.3*/
    [name: string]: unknown;
}

export function makeBloom (): Bloom {
    return {
        enabled: false,
        enableAlphaMask: false,
        useHdrIlluminance: false,
        iterations: 3,
        threshold: 0.8,
        intensity: 2.3,
    };
}

export interface ColorGrading {
    enabled: boolean; /*false*/
    contribute: number; /*0*/
    /*refcount*/ colorGradingMap?: Texture;
    [name: string]: unknown;
}

export function makeColorGrading (): ColorGrading {
    return {
        enabled: false,
        contribute: 0,
    };
}

export interface FSR {
    enabled: boolean; /*false*/
    sharpness: number; /*0.8*/
    [name: string]: unknown;
}

export function makeFSR (): FSR {
    return {
        enabled: false,
        sharpness: 0.8,
    };
}

export interface FXAA {
    enabled: boolean; /*false*/
    [name: string]: unknown;
}

export function makeFXAA (): FXAA {
    return {
        enabled: false,
    };
}

export interface PipelineSettings {
    readonly depthOfField: DepthOfField;
    readonly bloom: Bloom;
    readonly colorGrading: ColorGrading;
    readonly fsr: FSR;
    readonly fxaa: FXAA;
    [name: string]: unknown;
}

export function makePipelineSettings (): PipelineSettings {
    return {
        depthOfField: makeDepthOfField(),
        bloom: makeBloom(),
        colorGrading: makeColorGrading(),
        fsr: makeFSR(),
        fxaa: makeFXAA(),
    };
}
