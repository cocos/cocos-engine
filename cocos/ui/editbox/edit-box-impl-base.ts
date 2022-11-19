/*
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2012 James Chen
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import { EditBox } from './edit-box';

export class EditBoxImplBase {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _editing = false;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _delegate: EditBox | null = null;

    public init (delegate: EditBox) {}

    public onEnable () {}

    public update () { }

    public onDisable () {
        if (this._editing) {
            this.endEditing();
        }
    }

    public clear () {
        this._delegate = null;
    }

    public setTabIndex (index: number) {}

    public setSize (width: number, height: number) {}

    public setFocus (value) {
        if (value) {
            this.beginEditing();
        } else {
            this.endEditing();
        }
    }

    public isFocused () {
        return this._editing;
    }

    public beginEditing () {}

    public endEditing () {}
}
