/**
 * @hidden
 */

import * as debug from './platform/debug';
import { _normalize, basename, changeBasename, changeExtname, dirname, extname, getSeperator, join, mainFileName, stripSep } from './utils/path';
import { legacyCC } from './global-exports';
// import Pipeline from './load-pipeline/pipeline';
// import Url from './load-pipeline/url';

// cc.Pipeline = Pipeline;
// cc.url = Url;
// cc.AssetLibrary = AssetLibrary;

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
