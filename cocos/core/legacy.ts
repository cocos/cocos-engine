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

import * as debug from '@base/debug';
import { cclegacy } from '@base/global';
import { _normalize, basename, changeBasename, changeExtname, dirname, extname, getSeperator, join, mainFileName, stripSep } from './utils/path';

// CCDebug.js
cclegacy.log = debug.log;
cclegacy.warn = debug.warn;
cclegacy.error = debug.error;
cclegacy.assert = debug.assert;
cclegacy._throw = debug._throw;
cclegacy.logID = debug.logID;
cclegacy.warnID = debug.warnID;
cclegacy.errorID = debug.errorID;
cclegacy.assertID = debug.assertID;
cclegacy.debug = debug;

// path.js
cclegacy.path = {
    join,
    extname,
    mainFileName,
    basename,
    dirname,
    changeExtname,
    changeBasename,
    _normalize,
    stripSep,
    get sep (): string {
        return getSeperator();
    },
};
