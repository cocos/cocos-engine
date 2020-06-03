/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @category asset
 */

import { ccclass, property } from '../data/class-decorator';
import { Font } from './font';
import { SpriteFrame } from './sprite-frame';
import { legacyCC } from '../global-exports';

export interface IConfig {
    [key: string]: any;
}

/**
 * @en
 * Class for BitmapFont handling.
 *
 * @zh
 * 位图字体资源类。
 * 可通过 cc.BitmapFont 获取该组件。
 */
@ccclass('cc.BitmapFont')
export class BitmapFont extends Font {
    @property
    public fntDataStr = '';

    /**
     * @zh
     * bitmap font 依赖精灵。
     */
    @property({
        type: SpriteFrame,
    })
    public spriteFrame: SpriteFrame | null = null;

    /**
     * @zh
     * 文字尺寸。
     */
    @property
    public fontSize = -1;

    /**
     * @zh
     * 文字配置。
     */
    @property
    public fntConfig: IConfig | null = null;
}

legacyCC.BitmapFont = BitmapFont;
