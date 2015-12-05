
describe( 'cc.LabelTTFWrapper', function () {
    var Async = require('async');

    var node,
        wrapper,
        asset,
        uuid = '223459';

    before( function (done) {
        cc.AssetLibrary.loadAsset(uuid, function (err, a) {
            if (err) throw err;

            asset = a;
            done();
        });
    });

    beforeEach(function () {
        node = new cc.LabelTTF();
        wrapper = cc.getWrapper(node);
    });


    it( 'simple serialize should success', function () {
        wrapper.onBeforeSerialize();

        expect( wrapper._fontSize ).equal( 16 );
        expect( wrapper.font ).equal( null );
        expect( wrapper._fontFamily ).equal( 'Arial' );
        expect( wrapper._text ).equal( '' );
        expect( wrapper._align ).equal( cc.TextAlignment.LEFT );
        expect( wrapper._verticalAlign ).equal( cc.VerticalTextAlignment.TOP );
        expect( wrapper._boundingBox ).deep.equal( [0,0] );
        expect( wrapper._lineHeight ).equal( 18 );

    });

    it( 'serialize with property should success', function () {

        wrapper.text = 'Text';
        wrapper.fontSize = 30;
        wrapper.font = asset;
        wrapper.align = cc.TextAlignment.CENTER;
        wrapper.verticalAlign = cc.TextAlignment.CENTER;
        wrapper.lineHeight = 100;
        wrapper.boundingBox = new cc.Vec2(100, 100);

        wrapper.onBeforeSerialize();

        expect( wrapper._text ).equal( 'Text' );
        expect( wrapper._fontSize ).equal( 30 );
        expect( wrapper.font._uuid ).equal( uuid );
        expect( wrapper._fontFamily ).equal( 'Abberancy' );
        expect( wrapper._align ).equal( cc.TextAlignment.CENTER );
        expect( wrapper._verticalAlign ).equal( cc.TextAlignment.CENTER );
        expect( wrapper._lineHeight ).equal( 100 );
        expect( wrapper._boundingBox ).deep.equal( [100,100] );
    });

    it( 'simple createNode should success', function () {
        var node = wrapper.createNode();

        assert( node instanceof cc.LabelTTF );
        expect( node.string ).equal( 'Label' );
        expect( node.fontName ).equal('Arial');
        expect( node.fontSize ).equal(16);
    });

    it( 'createNode with onBeforeSerialize called', function () {

        wrapper.text = 'Text';
        wrapper.fontSize = 30;
        wrapper.font = asset;
        wrapper.align = cc.TextAlignment.CENTER;
        wrapper.verticalAlign = cc.TextAlignment.CENTER;
        wrapper.lineHeight = 100;
        wrapper.boundingBox = new cc.Vec2(100, 100);

        wrapper.onBeforeSerialize();
        var node = wrapper.createNode();

        assert( node instanceof cc.LabelTTF );
        expect( node.string ).equal( 'Text' );
        expect( node.fontName ).equal('Abberancy');
        expect( node.fontSize ).equal(30);
        expect( node.textAlign ).equal( cc.TextAlignment.CENTER );
        expect( node.verticalAlign ).equal( cc.TextAlignment.CENTER );
        expect( node.getLineHeight() ).equal( 100 );
        expect( node.boundingWidth ).equal(100);
        expect( node.boundingHeight ).equal(100);
    });
});
