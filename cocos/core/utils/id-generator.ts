/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { EDITOR } from 'internal:constants';

const NonUuidMark = '.';

/**
 * @en
 * ID generator for runtime.
 *
 * @zh
 * 运行时 ID 生成器
 */
export default class IDGenerator {
    /**
    * @en
    * The global id generator might have a conflict problem once every 365 days,
    * if the game runs at 60 FPS and each frame 4760273 counts of new id are requested.
    *
    * @zh
    * 全局的 id 生成器，如果游戏以 60 FPS 运行，每帧获取 4760273 个新 id, 则可能在 365 天后发生冲突。
    */
    public static global = new IDGenerator('global');

    public id: number;

    public prefix: string;

    /**
     * @en Construct a new id generator
     * @zh 构造一个新的 id 生成器
     *
     * @param [category] @en You can specify a unique category to avoid id collision with other instance of IdGenerator. @zh 你能指定一个唯一的标识用于避免与其他 id 生成器冲突
     */
    constructor (category?: string) {
        // Tnit with a random id to emphasize that the returns id should not be stored in persistence data.
        this.id = 0 | (Math.random() * 998);
        this.prefix = category ? (category + NonUuidMark) : '';
    }

    public getNewId () {
        if (EDITOR && (this.prefix === 'Node.' || this.prefix === 'Comp.')) {
            return EditorExtends.UuidUtils.uuid();
        }
        return this.prefix + (++this.id);
    }
}
