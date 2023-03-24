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
import { Color, Pool, Rect, Size, Vec2 } from '../../../core';
import { Font, SpriteFrame } from '../../assets';
import { FontAtlas } from '../../assets/bitmap-font';
import { LetterAtlas } from './font-utils';
import { IRenderData } from './text-processing';

// 作为上下层数据的交换中心，负责联通处理器和上层数据
// 可认为是为 文本相关 组件定制的数据存储结构
// 谁持有？相关组件，会不会导致组件体积变大
export class TextProcessData {
    constructor () {

    }

    // 字体资源
    public _font: Font | null = null;
    public _fontFamily = 'Arial'; // ttf // fontFamily 只有名字不是资源
    public declare _fontAtlas: FontAtlas | LetterAtlas | null; // 是否为 bmfont 资源
    public _isSystemFontUsed = false; // 用于处理标签

    // 字体表现效果
    public _fontDesc: string; // 描述集，包含 字体 和 style // 上层可以不用这个
    public _fontStyle: string; // 或者为枚举，格式统一即可 // style 包含了 bold,italic // 需要能够反解出分量的位运算
    public _fontSize = 40; // 用户输入的 fonSize
    public _actualFontSize = 0; // 在 shrink 模式下实际最终的 font size // 我们不一定需要 shrink 模式，直接 auto 就ok // 记得同步
    public declare _material: Material | null; // 要使用的材质，虽然可以上层不可知，但可能要暴露// 好像和处理层无关，但之后可能会有关系

    // 后效参数 // 做一次数据合并吧，正解反解都需要
    // 需要考虑后效参数对hash信息是否会产生影响
    // bold // 应对属于 style
    public isBold = false;
    // Italic // 应对属于 style
    public isItalic = false;
    // under line // 应当属于 style
    public isUnderline = false;
    public underlineHeight = 1;
    // outline style
    public _isOutlined = false;
    public _outlineColor = Color.WHITE.clone();
    public outlineWidth = 1;
    // shadowStyle
    public _hasShadow = false;
    public shadowColor = Color.BLACK.clone();
    public shadowBlur = 2;
    public shadowOffsetX = 0;
    public shadowOffsetY = 0;

    public _color = Color.WHITE.clone();

    // Layout
    // alignment
    public _hAlign = 0;// Enum
    public _vAlign = 0;// Enum

    public _wrapping = true; // 是否换行
    public _overFlow = 0;// Enum

    public _maxWidth = 0;
    public _lineHeight = 10;

    public _hash: string; // 处理器用于辨别图集使用的哈希值

    // Process Output
    public quadCount = 0;
    public vertexBuffer: IRenderData[] = [];// 数组
    public _texture: Texture2D | SpriteFrame | null;

    // string before process
    public inputString = '';
    // string after process
    public parsedString: string[] = [];
    public parsedStringStyle; // 用于 richText 配合解析过后的 string 使用

    // Node 的相关信息
    // 由于上层的组件化设计，data 需要保存并使用 contentSize
    public _canvasSize = new Size(); // 处理过后的需要的 contentSize
    public _nodeContentSize = Size.ZERO.clone(); // 未曾换行的 原始宽度

    public _canvasPadding = new Rect(); // 存储由于受到 style 影响而导致的 padding
    public _contentSizeExtend = Size.ZERO.clone(); // 额外多出的宽

    // 绘制的额外信息？
    public _startPosition = Vec2.ZERO.clone(); // 绘制的起始位置，canvas 要的

    // 还需要保存 anchor???
    public uiTransAnchorX = 0.5;
    public uiTransAnchorY = 0.5;
}
