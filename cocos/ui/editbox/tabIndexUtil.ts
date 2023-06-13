/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { EditBoxImpl } from './edit-box-impl';

export class tabIndexUtil {
    public static _tabIndexList: EditBoxImpl[] = [];

    public static add (editBoxImpl: EditBoxImpl): void {
        const list = this._tabIndexList;
        const index = list.indexOf(editBoxImpl);
        if (index === -1) {
            list.push(editBoxImpl);
        }
    }

    public static remove (editBoxImpl: EditBoxImpl): void {
        const list = this._tabIndexList;
        const index = list.indexOf(editBoxImpl);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }

    public static resort (): void {
        this._tabIndexList.sort((a: EditBoxImpl, b: EditBoxImpl) => a._delegate!.tabIndex - b._delegate!.tabIndex);
    }

    public static next (editBoxImpl: EditBoxImpl): void {
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
