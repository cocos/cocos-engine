/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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
import { TextProcessData } from './text-process-data';

// 其只负责数据的处理和组织，不负责和具体的组件交互
// 两种方案，句子模式和拼接模式，需要做到上层无感的切换
// 接口不论上层是什么组件，都和处理层无关
// 处理层拿到信息之后进行组织
// 之后返回回去，可以针对数据进行判断是否要进行更新
// 返回的应该是顶点数组和图，请针对它进行更新操作

// 所以需要一个 TextProcessingData 来作为上层数据的提供者和处理器的返回者
export class TextProcessing {
    // 两个接口
    // 排版一个，渲染一个
    public processingString (info: TextProcessData, out?: string[]) {
        // 返回处理过换行甚至是字间排版的数据？
        // 相通之处在于目前只需要存换好行的数据
        // 类似于 richText 的拆分
    }

    public generateRenderInfo (info: TextProcessData, out?: Float32Array[]) {
        // 处理 info 中的数据
        // 生成 渲染数据
        // 根据参数决定是否要 out
        // 会更新到 textProcessData 中的 vertexBUffer 中
    }
}
