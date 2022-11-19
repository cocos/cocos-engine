/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { EditBoxImpl } from './edit-box-impl';

export class tabIndexUtil {
    public static _tabIndexList: EditBoxImpl[] = [];

    public static add (editBoxImpl: EditBoxImpl) {
        const list = this._tabIndexList;
        const index = list.indexOf(editBoxImpl);
        if (index === -1) {
            list.push(editBoxImpl);
        }
    }

    public static remove (editBoxImpl: EditBoxImpl) {
        const list = this._tabIndexList;
        const index = list.indexOf(editBoxImpl);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }

    public static resort () {
        this._tabIndexList.sort((a: EditBoxImpl, b: EditBoxImpl) => a._delegate!.tabIndex - b._delegate!.tabIndex);
    }

    public static next (editBoxImpl: EditBoxImpl) {
        const list = this._tabIndexList;
        const index = list.indexOf(editBoxImpl);
        editBoxImpl.setFocus(false);
        if (index !== -1) {
            const nextImpl = list[index + 1];
            if (nextImpl && nextImpl._delegate!.tabIndex >= 0) {
                nextImpl.setFocus(true);
            }
        }
    }
}
