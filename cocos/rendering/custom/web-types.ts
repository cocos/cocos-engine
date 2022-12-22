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
import { Attribute, Shader, ShaderInfo } from '../../gfx';
import { IProgramInfo } from '../../render-scene/core/program-lib';

export class ProgramInfo {
    constructor (
        programInfo: IProgramInfo,
        shaderInfo: ShaderInfo,
        attributes: Attribute[],
        blockSizes: number[],
        handleMap: Record<string, number>,
    ) {
        this.programInfo = programInfo;
        this.shaderInfo = shaderInfo;
        this.attributes = attributes;
        this.blockSizes = blockSizes;
        this.handleMap = handleMap;
    }
    readonly programInfo: IProgramInfo;
    readonly shaderInfo: ShaderInfo;
    readonly attributes: Attribute[];
    readonly blockSizes: number[];
    readonly handleMap: Record<string, number>;
}

export class ProgramHost {
    constructor (program: Shader) {
        this.program = program;
    }
    /*refcount*/ program: Shader;
}

export class ProgramGroup {
    readonly programInfos: Map<string, ProgramInfo> = new Map<string, ProgramInfo>();
    readonly programHosts: Map<string, ProgramHost> = new Map<string, ProgramHost>();
}
