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
import { ShaderCollector, ShaderCollectorFactory } from './collector';
import { ShaderCompiler, ShaderCompilerFactory } from './compiler';
import { ShaderCollectExportOptions } from './def';

export class ShaderPrecompile {
    private get isNewPipeline (): boolean {
        return !!cclegacy.rendering;
    }

    private get collector (): ShaderCollector {
        return ShaderCollectorFactory.getCollector(this.isNewPipeline);
    }

    private get compiler (): ShaderCompiler {
        return ShaderCompilerFactory.getShaderCompiler(this.isNewPipeline);
    }

    startCollect (): void {
        this.collector.start();
    }

    export (options?: ShaderCollectExportOptions): string | Uint8Array {
        return this.collector.export(options);
    }

    import (content: string | Uint8Array, compress = false): void {
        this.compiler.import(content, compress);
    }

    compileAll (): void {
        this.compiler.compileAll();
    }

    precompile (content: string | Uint8Array, compress = false): void {
        this.compiler.precompile(content, compress);
    }

    getShadersCount (): number {
        return this.compiler.getShadersCount();
    }
}
