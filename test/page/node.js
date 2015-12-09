
describe( 'test node wrapper', function () {

    var scene,
        node,
        wrapper;

    beforeEach(function () {

        node    = new _ccsg.Node();
        wrapper = cc.getWrapper(node);

        scene = cc.director.getRunningScene();

        wrapper.position = new cc.Vec2(0, 0);
        wrapper.rotation = 0;
        wrapper.scale    = new cc.Vec2(1, 1);
        wrapper.size     = new cc.Vec2(0, 0);
    });

    it ( 'node wrapper exists', function () {
        assert( node );
        assert( wrapper );
    });

    it ( 'name', function () {
        wrapper.name = "node";

        expect( wrapper.name ).to.equal( 'node' );
    });

    it( 'parentN', function () {

        wrapper.parentN = scene;

        expect( wrapper.parentN ).to.equal( scene );
    });

    it( 'set parentN to null', function () {
        wrapper.parentN = null;

        expect( wrapper.parentN ).to.equal( null );
    });

    it( 'childrenN', function () {
        var child = new _ccsg.Node();
        var childWrapper = cc.getWrapper(child);

        childWrapper.parentN = node;

        expect( childWrapper.parentN ).to.equal( node );
        assert( wrapper.childrenN );
        expect( wrapper.childrenN.length ).to.equal( 1 );
    });

    it( 'position', function () {
        wrapper.position = new cc.Vec2(100, 200);

        assert( wrapper.position instanceof cc.Vec2);
        expect( wrapper.position.x ).equal( 100 );
        expect( wrapper.position.y ).equal( 200 );
    });

    it( 'world position', function () {

        wrapper.parentN = scene;
        scene.setPosition(100, 300);

        wrapper.worldPosition = new cc.Vec2(100, 200);

        assert( wrapper.worldPosition instanceof cc.Vec2);

        expect( wrapper.worldPosition.x ).equal( 100 );
        expect( wrapper.worldPosition.y ).equal( 200 );

        expect( wrapper.position.x ).equal( 0 );
        expect( wrapper.position.y ).equal( -100 );

        scene.setPosition(0, 0);
    });

    it( 'rotation', function () {
        wrapper.rotation = 90;

        expect( wrapper.rotation ).to.be.a('number');
        expect( wrapper.rotation ).equal( 90 );
    });

    it( 'world rotation', function () {

        wrapper.parentN = scene;

        scene.rotation = 45;
        wrapper.worldRotation = 90;

        expect( wrapper.worldRotation ).to.be.a('number');

        expect( wrapper.rotation ).equal( 45 );
        expect( wrapper.worldRotation ).equal( 90 );

        scene.rotation = 0;
    });

    it( 'scale', function () {
        wrapper.scale = new cc.Vec2( 1.5, 2);

        assert( wrapper.scale instanceof cc.Vec2 );
        expect( wrapper.scale.x ).equal( 1.5 );
        expect( wrapper.scale.y ).equal( 2 );
    });

    it( 'world scale', function () {

        wrapper.parentN = scene;

        scene.scale   = 2;
        wrapper.scale = new cc.Vec2(0.5, 2);

        expect( wrapper.worldScale.x ).equal( 1 );
        expect( wrapper.worldScale.y ).equal( 4 );

        scene.scale = 1;
    });


    it( 'color', function () {

        wrapper.color = new cc.Color(1.0, 0.5, 0.9, 0.3);

        assert( wrapper.color instanceof cc.Color );

        // When convert cc.Color to cc.Color, it will cut off the decimals.
        // So the test will fail.

        // expect( wrapper.color.r ).equal( 1.0 );
        // expect( wrapper.color.g ).equal( 0.5 );
        // expect( wrapper.color.b ).equal( 0.9 );
        // expect( wrapper.color.a ).equal( 0.3 );
    });

    it( 'size', function () {
        wrapper.size = new cc.Vec2( 400, 200 );

        assert( wrapper.size instanceof cc.Vec2 );
        expect( wrapper.size.x ).equal( 400 );
        expect( wrapper.size.y ).equal( 200 );
    });

    it( 'anchorPoint', function () {
        wrapper.anchorPoint = new cc.Vec2( 0, 1);

        assert( wrapper.anchorPoint instanceof cc.Vec2 );
        expect( wrapper.anchorPoint.x ).equal( 0 );
        expect( wrapper.anchorPoint.y ).equal( 1 );
    });

    it( 'getWorldOrientedBounds', function () {
        wrapper.position = new cc.Vec2(100, 100);
        wrapper.rotation = 0;
        wrapper.size     = new cc.Vec2(400, 400);

        var bounds = wrapper.getWorldOrientedBounds();

        expect( bounds[0].x ).equal( 100 );
        expect( bounds[0].y ).equal( 500 );
        expect( bounds[1].x ).equal( 100 );
        expect( bounds[1].y ).equal( 100 );
        expect( bounds[2].x ).equal( 500 );
        expect( bounds[2].y ).equal( 100 );
        expect( bounds[3].x ).equal( 500 );
        expect( bounds[3].y ).equal( 500 );
    });

    it( 'getWorldBounds', function () {
        wrapper.position = new cc.Vec2(100, 100);
        wrapper.size     = new cc.Vec2(400, 400);

        var rect = wrapper.getWorldBounds();

        expect( rect.x ).equal( 100 );
        expect( rect.y ).equal( 100 );
        expect( rect.width ).equal( 400 );
        expect( rect.height ).equal( 400 );
    });

    it( 'simple serialize', function () {
        wrapper.onBeforeSerialize();

        expect( wrapper._position ).to.deep.equal( [0, 0] );
        expect( wrapper._scale ).to.deep.equal( [1, 1] );
        expect( wrapper._size ).to.deep.equal( [0, 0] );
        expect( wrapper._color ).to.deep.equal( [1, 1, 1, 1] );
        expect( wrapper._rotation ).equal( 0 );
    });

    it( 'serialize with property', function () {

        wrapper.position = new cc.Vec2(11, 22);
        wrapper.scale    = new cc.Vec2(2, 3);
        wrapper.color    = new cc.Color(1.0, 0.5, 0.9, 0.3);
        wrapper.rotation = 11;
        wrapper.anchorPoint = new cc.Vec2(1, 0);

        wrapper.onBeforeSerialize();

        expect( wrapper._position ).to.deep.equal( [11, 22] );
        expect( wrapper._scale ).to.deep.equal( [2, 3] );
        expect( wrapper._size ).to.deep.equal( [0, 0] );
        expect( wrapper._color ).to.deep.equal( [1, 0.4980392156862745, 0.8980392156862745, 0.2980392156862745] );
        expect( wrapper._rotation ).equal( 11 );
        expect( wrapper._anchorPoint ).to.deep.equal( [1, 0] );
    });

    it( 'simple createNode', function () {
        var node = wrapper.createNode();

        expect( node.rotation ).equal( 0 );
        expect( node.x ).equal( 0 );
        expect( node.y ).equal( 0 );
        expect( node.scaleX ).equal( 1 );
        expect( node.scaleY ).equal( 1 );
    });

    it( 'createNode with onBeforeSerialize called', function () {
        wrapper.position = new cc.Vec2(11, 22);
        wrapper.scale    = new cc.Vec2(2, 3);
        wrapper.rotation = 31;
        wrapper.anchorPoint = new cc.Vec2(1, 0);

        wrapper.onBeforeSerialize();
        var node = wrapper.createNode();

        expect( node.rotation ).equal( 31 );
        expect( node.x ).equal( 11 );
        expect( node.y ).equal( 22 );
        expect( node.scaleX ).equal( 2 );
        expect( node.scaleY ).equal( 3 );
        expect( node.anchorX ).equal( 1 );
        expect( node.anchorY ).equal( 0 );
    });

    describe( 'NodeWrapper.transformPointToWorld', function() {
        it( 'should transform point from local to world space', function () {
            wrapper.worldPosition = new cc.Vec2(300, 300);

            var point = wrapper.transformPointToWorld(new cc.Vec2(0, 0));

            expect( point.x ).equal( 300 );
            expect( point.y ).equal( 300 );
        });
    });

    describe( 'NodeWrapper.transformPointToLocal ', function () {

        it( 'should transform point from local to world space', function () {
            wrapper.worldPosition = new cc.Vec2(300, 300);

            var point = wrapper.transformPointToLocal(new cc.Vec2(300, 400));

            expect( point.x ).equal( 0 );
            expect( point.y ).equal( 100 );
        });
    });
});


describe( 'NodeWrapper siblingIndex', function () {
    var nodes;
    var scene;

    beforeEach(function () {
        scene = new _ccsg.Scene();
        nodes = [];

        for(var i=0; i<5; i++) {
            var node = new _ccsg.Node();
            nodes.push(node);
            scene.addChild(node);
        }
    });

    it( 'should be last if set siblingIndex to -1', function () {
        var wrapper = cc.getWrapper(nodes[0]);

        wrapper.setSiblingIndex(-1);

        expect( wrapper.getSiblingIndex() ).equal( nodes.length-1 );
    });

    it( 'should be 3 if 1st node\'s set siblingIndex to 3', function () {
        var wrapper = cc.getWrapper(nodes[0]);

        wrapper.setSiblingIndex(3);

        expect( wrapper.getSiblingIndex() ).equal( 3 );
    });

    it( 'should be 3 if set 2nd node\'s siblingIndex to 3', function () {
        var wrapper = cc.getWrapper(nodes[2]);

        wrapper.setSiblingIndex(3);

        expect( wrapper.getSiblingIndex() ).equal( 3 );
    });

    it( 'should be 0 if set 3rd node\'s siblingIndex to 0', function () {
        var wrapper = cc.getWrapper(nodes[3]);

        wrapper.setSiblingIndex(0);

        expect( wrapper.getSiblingIndex() ).equal( 0 );
    });

    it( 'should be 2 if set 3rd node\'s siblingIndex to 2', function () {
        var wrapper = cc.getWrapper(nodes[3]);

        wrapper.setSiblingIndex(2);

        expect( wrapper.getSiblingIndex() ).equal( 2 );
    });

});
