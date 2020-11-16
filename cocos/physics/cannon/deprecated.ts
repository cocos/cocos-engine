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

import { replaceProperty, Vec3 } from "../../core";
import { CannonContactEquation } from "./cannon-contact-equation";

replaceProperty(CannonContactEquation.prototype, 'IContactEquation.prototype', [
    {
        'name': 'contactA',
        'newName': 'getLocalPointOnA',
        'customGetter': function (this: CannonContactEquation) {
            const out = new Vec3();
            CannonContactEquation.prototype.getLocalPointOnA.call(this, out);
            return out;
        }
    },
    {
        'name': 'contactB',
        'newName': 'getLocalPointOnB',
        'customGetter': function (this: CannonContactEquation) {
            const out = new Vec3();
            CannonContactEquation.prototype.getLocalPointOnB.call(this, out);
            return out;
        }
    },
    {
        'name': 'normal',
        'newName': 'getLocalNormalOnB',
        'customGetter': function (this: CannonContactEquation) {
            const out = new Vec3();
            CannonContactEquation.prototype.getLocalNormalOnB.call(this, out);
            return out;
        }
    },
])
