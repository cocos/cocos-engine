describe( 'test engine', function () {

    it( 'pause when init runtime', function () {
        expect(cc.game.isPaused()).to.be.true;
    });

    it( 'pause runtime', function () {
        cc.game.pause();

        expect( cc.game.isPaused() ).to.be.true;
    });

    it( 'resume runtime', function() {
        cc.game.resume();

        expect( cc.game.isPaused() ).to.be.false;
    });

    it( 'getRunningScene', function () {
        assert( cc.director.getRunningScene() );
    });
});


describe( 'cc.engine.getIntersectionList', function () {
    var scene;
    var nodes;
    var wrappers;

    var oldScene;

    before(function () {
        oldScene = cc.director.getRunningScene();
    });

    after(function () {
        cc.director.runScene(oldScene);
    });

    beforeEach(function () {
        scene = new _ccsg.Scene();
        cc.director.runScene(scene);

        nodes = [];
        wrappers = [];

        for(var i = 0; i<2; i++) {
            var node = new _ccsg.Node();
            var wrapper = cc.getWrapper(node);
            node.setAnchorPoint(0.5, 0.5);

            scene.addChild(node);
            wrapper.size = new cc.Vec2(100, 100);

            nodes.push(node);
            wrappers.push(wrapper);
        }

        wrappers[0].position = new cc.Vec2(100, 100);
        wrappers[1].position = new cc.Vec2(200, 200);
    });


    it( 'should get an empty array if not intersects any node', function () {
        var rect = new cc.Rect(0,0, 49,49);
        var list = cc.engine.getIntersectionList(rect);

        expect( list.length ).to.equal( 0 );
    });

    it( 'should get an array with a node if intersects a node', function () {
        var rect = new cc.Rect(0,0, 50,50);
        var list = cc.engine.getIntersectionList(rect);

        expect( list.length ).to.equal( 1 );
    });

    it( 'should not get the node if the node rotate and not intersects it', function () {
        wrappers[0].rotation = 45;

        var rect = new cc.Rect(0,0, 64,64);
        var list = cc.engine.getIntersectionList(rect);

        expect( list.length ).to.equal( 0 );
    });

    it( 'should get the node if the node rotate and intersects it', function () {
        wrappers[0].rotation = 45;

        var rect = new cc.Rect(0,0, 65,65);
        var list = cc.engine.getIntersectionList(rect);

        expect( list.length ).to.equal( 1 );
    });

    it( 'should get an array with two nodes if intersects two nodes', function () {

        var rect = new cc.Rect(0,0, 200,200);
        var list = cc.engine.getIntersectionList(rect);

        expect( list.length ).to.equal( 2 );
    });

});
