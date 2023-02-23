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

import { Material, Texture2D } from '../../../asset/assets';
import { Color } from '../../../core';

// 作为上下层数据的交换中心，负责联通处理器和上层数据
// 可认为是为 文本相关 组件定制的数据存储结构
// 谁持有？相关组件，会不会导致组件体积变大
export class TextProcessData {
    // 字体资源
    public _fontFamily: string; // ttf？
    public _fontAtlas: FontAtlas | LetterAtlas | null; // 是否为 bmfont 资源

    // 字体表现效果
    public _fontDesc: string; // 描述集，包含 字体 和 style // 上层可以不用这个
    public _fontStyle: string; // 或者为枚举，格式统一即可 // Enum
    public _fontSize: number;
    public _material: Material | null; // 要使用的材质，虽然可以上层不可知，但可能要暴露

    public _isOutlined = false;
    public _outlineColor = Color.WHITE.clone();
    public _hasShadow = false;
    // public _shadowStyle

    public _color = Color.WHITE.clone();

    // Layout
    // alignment
    public _hAlign = 0;// Enum
    public _vAlign = 0;// Enum

    public _wrapping = true;
    public _overFlow = 0;// Enum

    public _maxWidth = 0;
    public _lineHeight = 10;

    public _hash: string; // 处理器用于辨别图集使用的哈希值

    // Process Output
    public vertexBUffer: Float32Array[] = [];// 数组
    public texture: Texture2D | null;

    // string after process
    public parsedString: string[] = [];
    public parsedStringStyle; // 用于 richText 配合解析过后的 string 使用
}
