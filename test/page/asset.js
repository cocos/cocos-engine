var _assetUrls = [
    { uuid: "", url: getAssetsPath('12/123456/1.jpg') },
    { uuid: "", url: getAssetsPath('91/91048d06-d998-4499-94c3-a5e0eccd40cf/1.fnt') }
];

describe( 'test asset', function () {

    it( 'cc.Texture2D.createNodeByInfo', function (done) {

        cc.Texture2D.createNodeByInfo(_assetUrls[0].url, function (err, node) {
            if (err) throw err;

            assert( node );
            assert( node.texture );
            expect( node.texture.url ).equal( _assetUrls[0].url );
            expect( node instanceof _ccsg.Sprite );

            done();
        });

    });

    it( 'cc.BitmapFont.createNodeByInfo', function (done) {
        cc.BitmapFont.createNodeByInfo(_assetUrls[1].url, function (err, node) {
            if (err) throw err;

            expect( node._fntFile ).equal( _assetUrls[1].url );

            done();
        });
    });
});
