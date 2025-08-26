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

import { MacroRecord } from '../../render-scene/core/pass-utils';

/**
 * @en Shader compilation information interface
 * @zh 着色器编译信息接口
 */
export interface IShaderCompileInfo {
    /**
     * @en Shader name
     * @zh 着色器名称
     */
    name: string;
    /**
     * @en Macro definitions for conditional compilation
     * @zh 用于条件编译的宏定义
     */
    defines: MacroRecord;
    /**
     * @en Unique key for caching and deduplication
     * @zh 用于缓存和去重的唯一键
     */
    key?: string;
    /**
     * @en Timestamp offset from collection start time (milliseconds)
     * @zh 相对于收集开始时间的时间戳偏移量（毫秒）
     */
    timestamp?: number;
}

/**
 * @en Shader compilation information for legacy rendering pipeline
 * @zh 旧渲染管线的着色器编译信息
 */
export interface IOldShaderCompileInfo extends IShaderCompileInfo {}

/**
 * @en Shader compilation information for new rendering pipeline
 * @zh 新渲染管线的着色器编译信息
 */
export interface INewShaderCompileInfo extends IOldShaderCompileInfo {
    /**
     * @en Rendering phase ID
     * @zh 渲染阶段ID
     */
    phaseID: number;
}

/**
 * @en Export options for shader collection data
 * @zh 着色器收集数据的导出选项
 */
export interface ShaderCollectExportOptions {
    /**
     * @en Whether to compress the exported data
     * @zh 是否压缩导出数据
     */
    compress?: boolean,
    /**
     * @en Whether to include timestamp information in exported data
     * @zh 导出数据中是否包含时间戳信息
     */
    containTime?: boolean,
    /**
     * @en Whether to include shader keys in exported data
     * @zh 导出数据中是否包含着色器键值
     */
    containKey?: boolean
}
