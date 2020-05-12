/**
 * @hidden
 */

import * as debug from './platform/debug';
import { _normalize, basename, changeBasename, changeExtname, dirname, extname, getSeperator, join, mainFileName, stripSep } from './utils/path';
import { legacyGlobalExports } from './global-exports';
// import Pipeline from './load-pipeline/pipeline';
// import Url from './load-pipeline/url';

// cc.Pipeline = Pipeline;
// cc.url = Url;
// cc.AssetLibrary = AssetLibrary;

// CCDebug.js
legacyGlobalExports.log = debug.log;
legacyGlobalExports.warn = debug.warn;
legacyGlobalExports.error = debug.error;
legacyGlobalExports.assert = debug.assert;
legacyGlobalExports._throw = debug._throw;
legacyGlobalExports.logID = debug.logID;
legacyGlobalExports.warnID = debug.warnID;
legacyGlobalExports.errorID = debug.errorID;
legacyGlobalExports.assertID = debug.assertID;
legacyGlobalExports.debug = debug;

// path.js
legacyGlobalExports.path = {
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
