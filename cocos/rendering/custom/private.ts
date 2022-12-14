/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
****************************************************************************/

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { EffectAsset } from '../../asset/assets';
import { DescriptorSetLayout, Device, PipelineLayout, Shader, ShaderInfo } from '../../gfx';
import { MacroRecord } from '../../render-scene/core/pass-utils';
import { IProgramInfo } from '../../render-scene/core/program-lib';

export interface ProgramProxy {
    readonly name: string;
    readonly shader: Shader;
}

export interface ProgramLibrary {
    addEffect (effectAsset: EffectAsset): void;
    precompileEffect (device: Device, effectAsset: EffectAsset): void;
    getKey (phaseID: number, programName: string, defines: MacroRecord): string;
    getPipelineLayout (device: Device, phaseID: number, programName: string): PipelineLayout;
    getMaterialDescriptorSetLayout (device: Device, phaseID: number, programName: string): DescriptorSetLayout;
    getLocalDescriptorSetLayout (device: Device, phaseID: number, programName: string): DescriptorSetLayout;
    getProgramInfo (phaseID: number, programName: string): IProgramInfo;
    getShaderInfo (phaseID: number, programName: string): ShaderInfo;
    getProgramVariant (device: Device, phaseID: number, name: string, defines: MacroRecord, key: string | null): ProgramProxy | null;
    getProgramVariant (device: Device, phaseID: number, name: string, defines: MacroRecord/*, null*/): ProgramProxy | null;
    getBlockSizes (phaseID: number, programName: string): number[];
    getHandleMap (phaseID: number, programName: string): Record<string, number>;
}
