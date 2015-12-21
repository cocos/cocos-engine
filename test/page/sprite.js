
describe( 'test sprite wrapper', function () {
    var sprite,
        wrapper,
        url = window.getAssetsPath('sprite.jpg');

    beforeEach(function () {
        sprite = new _ccsg.Sprite();
        wrapper = cc.getWrapper(sprite);
    });

    it( 'sprite wrapper exists', function () {
        assert( sprite );
        assert( wrapper );
    });

    it( 'texture', function () {

        wrapper.texture = url;
        expect( wrapper.texture ).equal( url );

        assert( sprite.texture );
        expect( sprite.texture.url ).equal( url );
    });

    it( 'set texture to null', function () {

        wrapper.texture = null;

        assert( wrapper.texture === '');
        assert( sprite.texture === null);
    });

    it( 'simple serialize', function () {
        wrapper.onBeforeSerialize();

        expect( wrapper._position ).to.deep.equal( [0, 0] );
        expect( wrapper._scale ).to.deep.equal( [1, 1] );
        expect( wrapper._size ).to.deep.equal( [0, 0] );
        expect( wrapper._color ).to.deep.equal( [1, 1, 1, 1] );
        expect( wrapper._rotation ).equal( 0 );
        expect( wrapper.texture ).equal( '' );
    });

    it( 'serialize with property', function () {

        wrapper.texture = url;

        wrapper.position = new cc.Vec2(100, 100);
        wrapper.rotation = 78;
        wrapper.scale    = new cc.Vec2(3, 1);
        wrapper.color    = new cc.Color(0.3, 0.2, 0.9, 1);

        wrapper.name = 'sprite';

        wrapper.onBeforeSerialize();

        expect( wrapper._position ).to.deep.equal( [100, 100] );
        expect( wrapper._scale ).to.deep.equal( [3, 1] );
        expect( wrapper._size ).to.deep.equal( [256, 67] );
        expect( wrapper._color ).to.deep.equal( [0.2980392156862745, 0.2, 0.8980392156862745, 1] );
        expect( wrapper._rotation ).equal( 78 );
        expect( wrapper._name ).equal( 'sprite' );

    });

    it( 'simple createNode', function () {
        var node = wrapper.createNode();

        assert( node instanceof _ccsg.Sprite );

        expect( node.texture ).equal( null );

        expect( node.rotation ).equal( 0 );
        expect( node.x ).equal( 0 );
        expect( node.y ).equal( 0 );
        expect( node.scaleX ).equal( 1 );
        expect( node.scaleY ).equal( 1 );
    });

    it( 'createNode with onBeforeSerialize called', function() {

        wrapper.position = new cc.Vec2(11, 22);

        wrapper.texture = wrapper._texToLoad = url;

        wrapper.onBeforeSerialize();

        var node = wrapper.createNode();

        assert( node instanceof _ccsg.Sprite );
        expect( node.x ).equal( 11 );
        expect( node.y ).equal( 22 );

        assert( node.texture );
        expect( node.texture.url ).equal( url );
    });
});
