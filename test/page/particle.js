
describe( 'test Particle wrapper', function () {
    var Async = require('async');

    var node,
        wrapper,
        particleUrl = window.getAssetsPath('particle.plist'),
        textureUrl = window.getAssetsPath('sprite.jpg');


    beforeEach(function () {
        node = new _ccsg.ParticleSystem();
        wrapper = cc.getWrapper(node);
    });

    function setShareProperties () {
        wrapper.maxParticles = 20;
        wrapper.duration = 30;
        wrapper.emissionRate = 40;
        wrapper.life = 50;
        wrapper.lifeVariance = 60;
        wrapper.startColor = new cc.Color(1, 0, 1, 1);
        wrapper.startColorVariance = new cc.Color(1, 0, 1, 1);
        wrapper.endColor = new cc.Color(1, 0, 1, 1);
        wrapper.endColorVariance =  new cc.Color(1, 0, 1, 1);
        wrapper.angle = 110;
        wrapper.angleVariance = 120;
        wrapper.startSize = 130;
        wrapper.startSizeVariance = 140;
        wrapper.endSize = 150;
        wrapper.endSizeVariance = 160;
        wrapper.startSpin = 170;
        wrapper.startSpinVariance = 180;
        wrapper.endSpin = 190;
        wrapper.endSpinVariance = 200;
        wrapper.sourcePosition = new cc.Vec2(100, 100);
        wrapper.sourcePositionVariance = new cc.Vec2(100, 100);
        wrapper.positionType = _ccsg.ParticleSystem.Type.FREE;
    }

    function setGravityModeProperties () {
        wrapper.emitterMode = _ccsg.ParticleSystem.Mode.GRAVITY;
        wrapper.gravity = new cc.Vec2(100, 100);
        wrapper.speed = 1;
        wrapper.speedVariance = 2;
        wrapper.tangentialAccel = 3;
        wrapper.tangentialAccelVariance = 4;
        wrapper.radialAccel = 5;
        wrapper.radialAccelVariance = 6;
        wrapper.rotationIsDir = 7;
    }

    function setRadiusProperties () {
        wrapper.emitterMode = _ccsg.ParticleSystem.Mode.RADIUS;
        wrapper.startRadius = 8;
        wrapper.startRadiusVariance = 9;
        wrapper.endRadius = 10;
        wrapper.endRadiusVariance = 11;
        wrapper.rotatePerSecond = 12;
        wrapper.rotatePerSecondVariance = 13;
    }


    it( 'Particle wrapper should exists', function () {
        assert( node );
        assert( wrapper);
    });

    it( 'particle file', function () {
        wrapper.file = particleUrl;

        expect( wrapper.file ).equal( particleUrl );
    });

    it( 'particle texture', function () {
        wrapper.texture = textureUrl;

        expect( wrapper.texture ).equal( textureUrl );
    });

    describe( 'serialize', function () {

        it( 'should success if no properties be set', function () {
            wrapper.onBeforeSerialize();

            expect( wrapper._file ).equal( '' );
        });

        it( 'should success if properties be set', function () {

            wrapper.file = particleUrl;
            setShareProperties();

            wrapper.onBeforeSerialize();

            expect( wrapper._file ).equal( particleUrl );
        });

        it( 'should not serialize custom properties if custom is false', function () {
            wrapper.custom = false;

            setShareProperties();
            setGravityModeProperties();

            wrapper.onBeforeSerialize();

            expect( wrapper._serializeObject ).to.equal( null );
        });

        it( 'should also keep .plist file if custom is true', function () {
            wrapper.file = particleUrl;
            wrapper.custom = true;

            wrapper.onBeforeSerialize();

            expect( wrapper._file ).to.equal( particleUrl );
        });


        it( 'should not serialize radius mode properties if emitterMode is gravity mode', function () {

            wrapper.custom = true;
            wrapper.file = particleUrl;

            setShareProperties();
            setGravityModeProperties();

            wrapper.onBeforeSerialize();

            expect( wrapper._serializeObject ).to.deep.equal( {
                maxParticles: 20,
                duration: 30,
                emissionRate: 40,
                life: 50,
                lifeVariance: 60,
                startColor: [ 1, 0, 1, 1 ],
                startColorVariance: [ 1, 0, 1, 1 ],
                endColor: [ 1, 0, 1, 1 ],
                endColorVariance: [ 1, 0, 1, 1 ],
                angle: 110,
                angleVariance: 120,
                startSize: 130,
                startSizeVariance: 140,
                endSize: 150,
                endSizeVariance: 160,
                startSpin: 170,
                startSpinVariance: 180,
                endSpin: 190,
                endSpinVariance: 200,
                sourcePosition: [ 100, 100 ],
                sourcePositionVariance: [ 100, 100 ],
                positionType: 0,
                emitterMode: 0,
                gravity: [ 100, 100 ],
                speed: 1,
                speedVariance: 2,
                tangentialAccel: 3,
                tangentialAccelVariance: 4,
                radialAccel: 5,
                radialAccelVariance: 6,
                rotationIsDir: 7
            });
        });

        it( 'should not serialize gravity mode properties if emitterMode is radius mode', function () {

            wrapper.custom = true;
            wrapper.file = particleUrl;

            setShareProperties();
            setRadiusProperties();

            wrapper.onBeforeSerialize();

            expect( wrapper._serializeObject ).to.deep.equal( {
                maxParticles: 20,
                duration: 30,
                emissionRate: 40,
                life: 50,
                lifeVariance: 60,
                startColor: [ 1, 0, 1, 1 ],
                startColorVariance: [ 1, 0, 1, 1 ],
                endColor: [ 1, 0, 1, 1 ],
                endColorVariance: [ 1, 0, 1, 1 ],
                angle: 110,
                angleVariance: 120,
                startSize: 130,
                startSizeVariance: 140,
                endSize: 150,
                endSizeVariance: 160,
                startSpin: 170,
                startSpinVariance: 180,
                endSpin: 190,
                endSpinVariance: 200,
                sourcePosition: [ 100, 100 ],
                sourcePositionVariance: [ 100, 100 ],
                positionType: 0,
                emitterMode: 1,
                startRadius: 8,
                startRadiusVariance: 9,
                endRadius: 10,
                endRadiusVariance: 11,
                rotatePerSecond: 12,
                rotatePerSecondVariance: 13
            });
        });

        it( 'should serialize texture if custom is true and texture be set', function () {
            wrapper.custom = true;
            wrapper.texture = textureUrl;

            wrapper.onBeforeSerialize();

            expect( wrapper._texture ).equal( textureUrl );
        });
    });

    describe( 'createNode', function () {

        it( 'should success if only call createNode', function() {

            var node = wrapper.createNode();

            expect( node._plistFile ).equal( '' );
        });

        it( 'should not set file to node but need keep file', function () {
            wrapper.file = wrapper._fileToLoad = particleUrl;
            wrapper.custom = true;

            wrapper.onBeforeSerialize();
            var node = wrapper.createNode();

            expect( node._plistFile ).equal( particleUrl );
        });

        it( 'should only deserialize gravity and share properties if emitterMode is gravity mode', function () {
            wrapper.custom = true;

            setShareProperties();
            setGravityModeProperties();

            wrapper.onBeforeSerialize();
            wrapper._file = particleUrl;

            var node = wrapper.createNode();

            expect( node.totalParticles ).equal( 20 );
            expect( node.gravity ).to.deep.equal( cc.p(100, 100) );

            expect( node.startRadius ).equal( 0 );
            expect( node.startRadiusVar ).equal( 0 );
        });


        it( 'should only deserialize radius and share properties if emitterMode is radius mode', function () {
            wrapper.custom = true;

            setShareProperties();
            setRadiusProperties();

            wrapper.onBeforeSerialize();
            wrapper._file = particleUrl;

            var node = wrapper.createNode();

            expect( node.totalParticles ).equal( 20 );

            expect( node.gravity ).to.deep.equal( cc.p(0, 0) );

            expect( node.startRadius ).equal( 8 );
            expect( node.startRadiusVar ).equal( 9 );
        });

        it( 'should deserialize texture if custom is true and texture be setted', function () {
            wrapper.texture = wrapper._texToLoad = textureUrl;
            wrapper.custom = true;

            wrapper.onBeforeSerialize();

            var node = wrapper.createNode();

            expect( node._texture.url ).equal( textureUrl );
        });
    })

});
