// import AssetLibrary from './assets/CCAssetLibrary';
import * as debug from './core/platform/CCDebug';
import { _normalize, basename, changeBasename, changeExtname, dirname, extname, getSeperator, join, mainFileName, stripSep } from './core/utils/path';
// import Pipeline from './load-pipeline/pipeline';
// import Url from './load-pipeline/url';

// cc.Pipeline = Pipeline;
// cc.url = Url;
// cc.AssetLibrary = AssetLibrary;

// CCDebug.js
cc.log = debug.log;
cc.warn = debug.warn;
cc.error = debug.error;
cc.assert = debug.assert;
cc._throw = debug._throw;
cc.logID = debug.logID;
cc.warnID = debug.warnID;
cc.errorID = debug.errorID;
cc.assertID = debug.assertID;
cc.debug = debug;

// path.js
cc.path = {
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
