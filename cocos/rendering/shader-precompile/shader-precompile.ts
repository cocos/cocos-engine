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

/**
 * @en Shader precompilation manager. Provides functionality for collecting shader compilation info during runtime and precompiling shaders for optimization.
 * @zh 着色器预编译管理器。提供运行时收集着色器编译信息和预编译着色器优化功能。
 */
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

    /**
     * @en Start collecting shader compilation information
     * @zh 开始收集着色器编译信息
     */
    startCollect (): void {
        this.collector.start();
    }

    /**
     * @en Export collected shader data
     * @zh 导出收集的着色器数据
     */
    export (options?: ShaderCollectExportOptions): string | Uint8Array {
        return this.collector.export(options);
    }

    /**
     * @en Import shader data for precompilation
     * @zh 导入用于预编译的着色器数据
     */
    import (content: string | Uint8Array, compress = false): void {
        this.compiler.import(content, compress);
    }

    /**
     * @en Compile all imported shaders
     * @zh 编译所有导入的着色器
     */
    compileAll (): void {
        this.compiler.compileAll();
    }

    /**
     * @en Import and compile shaders in one step
     * @zh 一步完成导入和编译着色器
     */
    precompile (content: string | Uint8Array, compress = false): void {
        this.compiler.precompile(content, compress);
    }

    /**
     * @en Get the count of compiled shaders
     * @zh 获取已编译着色器的数量
     */
    getShadersCount (): number {
        return this.compiler.getShadersCount();
    }
}
