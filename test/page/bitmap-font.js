
var _text = 'test bitmap-font';

describe( 'test BitmapFont wrapper', function () {
    var node,
        wrapper,
        url = window.getAssetsPath('bitmap-font.fnt');

    beforeEach(function () {
        node = new cc.LabelBMFont();
        wrapper = cc.getWrapper(node);
    });

    it( 'BitmapFont wrapper exists', function () {
        assert( node );
        assert( wrapper );

        expect( wrapper.align ).equal( cc.TextAlignment.LEFT );
        expect( wrapper.anchor ).equal( cc._TextAnchor.MiddleCenter );
    });

    it( 'anchor', function () {
        wrapper.anchor = cc._TextAnchor.TopRight;

        var anchorPoint = node.getAnchorPoint();

        expect( anchorPoint.x ).equal( 1 );
        expect( anchorPoint.y ).equal( 1 );
        expect( wrapper.anchor ).equal( cc._TextAnchor.TopRight );

        wrapper.anchor = cc._TextAnchor.BottomLeft;

        anchorPoint = node.getAnchorPoint();

        expect( anchorPoint.x ).equal( 0 );
        expect( anchorPoint.y ).equal( 0 );
        expect( wrapper.anchor ).equal( cc._TextAnchor.BottomLeft );

        wrapper.anchor = cc._TextAnchor.MiddleCenter;

        anchorPoint = node.getAnchorPoint();

        expect( anchorPoint.x ).equal( 0.5 );
        expect( anchorPoint.y ).equal( 0.5 );
        expect( wrapper.anchor ).equal( cc._TextAnchor.MiddleCenter );
    });

    it( 'align', function () {
        wrapper.align = cc.TextAlignment.LEFT;

        expect( wrapper.align ).equal( cc.TextAlignment.LEFT );
        expect( node._alignment ).equal( cc.TextAlignment.LEFT );
    });

    it( 'text', function () {
        wrapper.text = 'tttt';

        expect( wrapper.text ).equal( 'tttt' );
        expect( node.string ).equal( 'tttt' );
    });

    it( 'change font', function () {

        wrapper.bitmapFont = url;

        expect( wrapper.bitmapFont ).equal( url );
        expect( node._fntFile ).equal( url );
    });

    it( 'simple serialize', function () {
        wrapper.onBeforeSerialize();

        expect( wrapper._text ).equal( '' );
        expect( wrapper._anchor ).equal( cc._TextAnchor.MiddleCenter );
        expect( wrapper._align ).equal( cc.TextAlignment.LEFT );
        expect( wrapper._bitmapFont ).equal( '' );
    });

    it( 'serialize with property', function () {

        wrapper.text = _text;
        wrapper.anchor = cc._TextAnchor.BottomRight;
        wrapper.align = cc.TextAlignment.RIGHT;
        wrapper.bitmapFont = url;

        wrapper.onBeforeSerialize();

        expect( wrapper._text ).equal( _text );
        expect( wrapper._anchor ).equal( cc._TextAnchor.BottomRight );
        expect( wrapper._align ).equal( cc.TextAlignment.RIGHT );
        expect( wrapper.bitmapFont ).equal( url );
    });

    it( 'simple createNode', function() {

        var node = wrapper.createNode();

        assert( node instanceof cc.LabelBMFont );
        expect( node._fntFile ).equal( '' );
        expect( node.string ).equal( '' );
        expect( node.textAlign ).equal( cc.TextAlignment.LEFT );
    });

    it( 'createNode with onBeforeSerialize called', function () {
        wrapper.text = _text;
        wrapper.anchor = cc._TextAnchor.BottomRight;
        wrapper.align = cc.TextAlignment.RIGHT;
        wrapper.bitmapFont = url;
        wrapper._bitmapFontToLoad = url;

        wrapper.onBeforeSerialize();

        var node = wrapper.createNode();

        assert( node instanceof cc.LabelBMFont );
        expect( node._fntFile ).equal( url );
        expect( node.string ).equal( _text );
        expect( node.textAlign ).equal( cc.TextAlignment.RIGHT );
    });
});
