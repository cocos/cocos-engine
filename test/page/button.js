
describe( 'test button wrapper', function () {
    var Async = require('async');

    var node,
        wrapper,
        asset,
        uuid = '223459',
        url = window.getAssetsPath('button.png');

    before( function (done) {
        cc.AssetLibrary.loadAsset(uuid, function (err, a) {
            if (err) throw err;

            asset = a;
            done();
        });
    });

    beforeEach(function () {
        node = new ccui.Button();
        wrapper = cc.getWrapper(node);
    });

    it( 'normalTexture', function () {
        wrapper._normalTexture = url;

        expect( wrapper._normalTexture ).equal( url );
    });

    it( 'pressedTexture', function () {
        wrapper._pressedTexture = url;

        expect( wrapper._pressedTexture ).equal( url );
    });

    it( 'disabledTexture', function () {
        wrapper._disabledTexture = url;

        expect( wrapper._disabledTexture ).equal( url );
    });

    it( 'simple serialize', function () {
        wrapper.onBeforeSerialize();

        expect( wrapper._normalTexture ).equal( '' );
        expect( wrapper._pressedTexture ).equal( '' );
        expect( wrapper._disabledTexture ).equal( '' );

        expect( wrapper._text ).equal( '' );
        expect( wrapper._fontSize ).equal( 16 );
        expect( wrapper._font ).equal( null );
        expect( wrapper._fontFamily ).equal( 'Arial' );
    });

    it( 'serialize with property', function () {
        wrapper._normalTexture = url;
        wrapper._pressedTexture = url;
        wrapper._disabledTexture = url;

        wrapper.text = 'Text';
        wrapper.fontSize = 30;
        wrapper._font = asset;

        wrapper.onBeforeSerialize();

        expect( wrapper._normalTexture ).equal( url );
        expect( wrapper._pressedTexture ).equal( url );
        expect( wrapper._disabledTexture ).equal( url );

        expect( wrapper._text ).equal( 'Text' );
        expect( wrapper._fontSize ).equal( 30 );
        expect( wrapper._font._uuid ).equal( uuid );
    });

    it( 'simple createNode', function () {
        var node = wrapper.createNode();

        assert( node instanceof ccui.Button );
        expect( node.titleText ).equal( 'Button' );
        expect( node.titleFontName ).equal('Arial');
        expect( node.titleFontSize ).equal(16);
    });

    it( 'createNode with onBeforeSerialize called', function () {

        wrapper.text = 'Text';
        wrapper.fontSize = 30;

        wrapper.onBeforeSerialize();

        wrapper._normalTexture = url;
        wrapper._pressedTexture = url;
        wrapper._disabledTexture = url;
        wrapper._font = asset;

        var node = wrapper.createNode();

        assert( node instanceof ccui.Button );
        expect( node.titleText ).equal( 'Text' );
        expect( node.titleFontSize ).equal(30);
    });
});
