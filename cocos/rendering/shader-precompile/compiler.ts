/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

import { cclegacy } from '../../core';
import { Device } from '../../gfx';
import { programLib as oldProgramLib } from '../../render-scene/core/program-lib';
import { MacroRecord } from '../../render-scene/core/pass-utils';
import { programLib as newProgramLib } from '../custom/program-lib';
import { PipelineRuntime } from '../custom';
import { WebProgramLibrary } from '../custom/web-program-library';
import { ShaderDataSerializerFactory } from './serializer';
import { INewShaderCompileInfo, IOldShaderCompileInfo, IShaderCompileInfo } from './def';

const PLATFORM_SPECIFIC_MACROS_FOR_NEW_PIPELINE = [
    'CC_SHADOWMAP_FORMAT',
    'CC_SHADOWMAP_USE_LINEAR_DEPTH',
    'CC_SUPPORT_CASCADED_SHADOW_MAP',
    'CC_USE_DEBUG_VIEW',
    'CC_PIPELINE_TYPE',
    'CC_SUPPORT_FLOAT_TEXTURE',
];

const PLATFORM_SPECIFIC_MACROS_FOR_OLD_PIPELINE = [
    'CC_SHADOWMAP_FORMAT',
    'CC_SHADOWMAP_USE_LINEAR_DEPTH',
    'CC_SUPPORT_CASCADED_SHADOW_MAP',
];

export abstract class ShaderCompiler<T extends IShaderCompileInfo = IShaderCompileInfo> {
    private records: T[] = [];

    protected abstract compile(record: T): void;
    abstract getShadersCount(): number;

    import (content: string | Uint8Array, compress = false): void {
        const serializer = ShaderDataSerializerFactory.getSerializer(compress);
        this.records ??= [];
        this.records.push(...(serializer.deserialize(content) as T[]));
    }

    compileAll (): void {
        this.records.forEach((record) => {
            this.compile(record);
        });
        this.records = [];
    }

    precompile (content: string | Uint8Array, compress = false): void {
        this.import(content, compress);
        this.compileAll();
    }

    protected assignPlatformMacro (defines: MacroRecord, pipelineMacro: MacroRecord, platformMacroList: string[]): void {
        platformMacroList.forEach((macro) => {
            if (macro in defines && macro in pipelineMacro) {
                defines[macro] = pipelineMacro[macro];
            }
        });
    }
}

class OldShaderCompiler extends ShaderCompiler<IOldShaderCompileInfo> {
    protected compile (info: IOldShaderCompileInfo): void {
        const { device, pipeline } = cclegacy.director.root as { device: Device, pipeline: PipelineRuntime };
        const { name, defines } = info;

        this.assignPlatformMacro(defines, pipeline.macros, PLATFORM_SPECIFIC_MACROS_FOR_OLD_PIPELINE);
        oldProgramLib.compile(device, name, defines, pipeline);
    }

    getShadersCount (): number {
        return oldProgramLib.getShadersCount();
    }
}

class NewShaderCompiler extends ShaderCompiler<INewShaderCompileInfo> {
    protected compile (info: INewShaderCompileInfo): void {
        const { device, pipeline } = cclegacy.director.root as { device: Device, pipeline: PipelineRuntime };
        const { phaseID, name, defines, key } = info;

        this.assignPlatformMacro(defines, pipeline.macros, PLATFORM_SPECIFIC_MACROS_FOR_NEW_PIPELINE);
        NewShaderCompiler.programLib.compile(device, phaseID, name, defines, key);
    }

    getShadersCount (): number {
        return NewShaderCompiler.programLib.getShadersCount();
    }

    // TODO: 正龙，这里需要修改
    private static get programLib (): WebProgramLibrary {
        return newProgramLib as WebProgramLibrary;
    }
}

export class ShaderCompilerFactory {
    private static oldShaderCompiler = new OldShaderCompiler();
    private static newShaderCompiler = new NewShaderCompiler();

    static getShaderCompiler (isNewPipeline: boolean): ShaderCompiler<IShaderCompileInfo> {
        return isNewPipeline ? this.newShaderCompiler : this.oldShaderCompiler;
    }
}
