var Path = require('fire-path');

describe('core level', function () {
    it ('should success', function () {
        // simple init
        Editor.require( 'unpack://engine-framework/src' );

        // simple init
        if ( !Editor.assets ) Editor.assets = {};
        if ( !Editor.metas ) Editor.metas = {};
        if ( !Editor.inspectors ) Editor.inspectors = {};

        // init asset-db
        var AssetDB = Editor.require('app://asset-db');
        Editor.assetdb = new AssetDB({
            'cwd': Path.join( __dirname, 'playground' ),
            'library': 'library',
        });

        Editor.require( 'unpack://engine' );
    });
});
