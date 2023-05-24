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

import { ActionInstant } from './actions/action-instant';

export class SetAction extends ActionInstant {
    private _props: any;

    constructor (props?: any) {
        super();
        this._props = {};
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        props !== undefined && this.init(props);
    }

    init (props) {
        for (const name in props) {
            this._props[name] = props[name];
        }
        return true;
    }

    update () {
        const props = this._props;
        const target = this.target;
        for (const name in props) {
            target![name] = props[name];
        }
    }

    clone () {
        const action = new SetAction();
        action.init(this._props);
        return action;
    }
}
