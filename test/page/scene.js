describe( 'test scene wrapper', function () {
    var scene,
        wrapper;

    var assets = [
        { url: 'sprite.jpg' },
        { url: 'bitmap-font.png' },
        { url: 'bitmap-font.fnt' }
    ];

    beforeEach(function () {
        scene = new _ccsg.Scene();
        wrapper = cc.getWrapper(scene);
    });

    it( 'scene wrapper exists', function () {
        var wrapperType = cc.getWrapperType(scene);

        assert( scene );
        assert( wrapper );
        assert( wrapperType );
    });

    it( 'childrenN', function () {
        assert( wrapper.childrenN );

        var node  = new _ccsg.Node();
        var node2 = new _ccsg.Node();

        scene.addChild(node);
        scene.addChild(node2);

        expect( wrapper.childrenN.length ).equal( 2 );
    });

    it( 'position', function () {
        wrapper.position = new cc.Vec2( 100, 200);

        expect( wrapper.position.x ).equal( 100 );
        expect( wrapper.position.y ).equal( 200 );
    });

    it( 'scale', function() {
        wrapper.scale = new cc.Vec2( 2, 3);

        expect( wrapper.scale.x ).equal( 2 );
        expect( wrapper.scale.y ).equal( 3 );
    });

    it( 'world transform', function () {
        wrapper.worldPosition = new cc.Vec2( 100, 200);
        wrapper.worldScale = new cc.Vec2( 1, 2);
        wrapper.worldRotation = 30;

        expect( wrapper.worldPosition.x ).equal( 100 );
        expect( wrapper.worldPosition.y ).equal( 200 );
        expect( wrapper.worldScale.x ).equal( 1 );
        expect( wrapper.worldScale.y ).equal( 2 );
        expect( wrapper.worldRotation ).equal( 30 );
    });

    it( 'preloadAssets', function ( done ) {

        assets = assets.map( function (asset) {
            return {url: window.getAssetsPath(asset.url)};
        });

        wrapper.preloadAssets( assets, [], done);
    });

    it( 'preloadAssets when cc.director paused', function ( done ) {

        cc.director.pause();

        assets = assets.map( function (asset) {
            return {url: window.getAssetsPath(asset.url)};
        });

        wrapper.preloadAssets( assets, [], function () {
            cc.director.resume();

            done();
        });
    });

    it( 'simple serialize', function () {
        wrapper.onBeforeSerialize();

        expect( wrapper._position ).to.deep.equal( [0, 0] );
        expect( wrapper._scale ).to.deep.equal( [1, 1] );
    });

    it( 'serialize with property', function () {

        wrapper.position = new cc.Vec2(11, 22);
        wrapper.scale    = new cc.Vec2(2, 3);

        wrapper.onBeforeSerialize();

        expect( wrapper._position ).to.deep.equal( [11, 22] );
        expect( wrapper._scale ).to.deep.equal( [2, 3] );
    });

    it( 'createNode', function () {
        var node = wrapper.createNode();

        assert( node instanceof _ccsg.Scene );

        expect( node.x ).equal( 0 );
        expect( node.y ).equal( 0 );
        expect( node.scaleX ).equal( 1 );
        expect( node.scaleY ).equal( 1 );
    });

    it( 'createNode with onBeforeSerialize called', function () {
        wrapper.position = new cc.Vec2(11, 22);
        wrapper.scale    = new cc.Vec2(2, 3);

        wrapper.onBeforeSerialize();

        var node = wrapper.createNode();

        assert( node instanceof _ccsg.Scene );

        expect( wrapper._position ).to.deep.equal( [11, 22] );
        expect( wrapper._scale ).to.deep.equal( [2, 3] );
    });
});
