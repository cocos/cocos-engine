/****************************************************************************
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
 ****************************************************************************/

import Asset from './CCAsset';
import _decorator from '../core/data/class-decorator';
const {ccclass} = _decorator;

/**
 * !#en Class for script handling.
 * !#zh Script 资源类。
 * @class _Script
 * @extends Asset
 *
 * @private
 */
@ccclass
class Script extends Asset {
    get name () { return 'Script'; }
}
cc._Script = Script;

/**
 * !#en Class for JavaScript handling.
 * !#zh JavaScript 资源类。
 * @class _JavaScript
 * @extends Asset
 *
 */
@ccclass
export class JavaScript extends Script {
    get name () { return 'JavaScript'; }
}
cc._JavaScript = JavaScript;

/**
 * !#en Class for TypeScript handling.
 * !#zh TypeScript 资源类。
 * @class TypeScript
 * @extends Asset
 *
 */
@ccclass
export class TypeScript extends Script {
    get name () { return 'TypeScript'; }
}
cc._TypeScript = TypeScript;