
describe( 'cc.Scale9SpriteWrapper', function () {
    var sprite,
        wrapper,
        url = window.getAssetsPath('sprite.jpg');

    beforeEach(function () {
        sprite = new ccui.ImageView();
        wrapper = cc.getWrapper(sprite);
    });

    it( 'should exists', function () {
        assert( sprite );
        assert( wrapper );
    });

    it( 'texture', function () {

        wrapper.texture_ = url;
        expect( wrapper.texture_ ).equal( url );

        assert( sprite._imageRenderer.texture );
        expect( sprite._imageRenderer.texture.url ).equal( url );
    });


    it( 'simple serialize', function () {
        wrapper.onBeforeSerialize();

        expect( wrapper.texture ).equal( '' );
    });

    it( 'serialize with property', function () {

        wrapper.texture_ = url;

        wrapper.onBeforeSerialize();

        expect( wrapper.texture ).to.equal( url );
    });

    it( 'simple createNode', function () {
        var node = wrapper.createNode();

        assert( node instanceof ccui.ImageView );
    });

    it( 'createNode with onBeforeSerialize called', function() {

        wrapper.texture_ = url;

        wrapper.onBeforeSerialize();

        var node = wrapper.createNode();

        assert( node instanceof ccui.ImageView );

        assert( node._imageRenderer.texture );
        expect( node._imageRenderer.texture.url ).equal( url );

    });
});
