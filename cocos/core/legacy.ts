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

import * as debug from './platform/debug';
import { _normalize, basename, changeBasename, changeExtname, dirname, extname, getSeperator, join, mainFileName, stripSep } from './utils/path';
import { legacyCC } from './global-exports';

// CCDebug.js
legacyCC.log = debug.log;
legacyCC.warn = debug.warn;
legacyCC.error = debug.error;
legacyCC.assert = debug.assert;
legacyCC._throw = debug._throw;
legacyCC.logID = debug.logID;
legacyCC.warnID = debug.warnID;
legacyCC.errorID = debug.errorID;
legacyCC.assertID = debug.assertID;
legacyCC.debug = debug;

// path.js
legacyCC.path = {
    join,
    extname,
    mainFileName,
    basename,
    dirname,
    changeExtname,
    changeBasename,
    _normalize,
    stripSep,
    get sep () {
        return getSeperator();
    },
};
