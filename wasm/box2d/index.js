
let Utils = require('../utils');

function initWasmBox2D() {
    window.b2 = {
        isWasm: true
    };
    
    for (var k in Box2D) {
        if (k.indexOf('b2') !== 0) {
            continue;
        }

        var name = k.replace('b2', '');
        b2[name] = Box2D[k];
    }

    b2.maxPolygonVertices = 8;
    b2.maxManifoldPoints = 2;

    [
        b2.AABB,
        b2.Vec2,

        b2.BodyDef,
        b2.FixtureDef,
        b2.Filter,
        
        b2.DistanceJointDef,
        b2.MotorJointDef,
        b2.MouseJointDef,
        b2.PrismaticJointDef,
        b2.RevoluteJointDef,
        b2.RopeJointDef,
        b2.WeldJointDef,
        b2.WheelJointDef,

        b2.CircleShape,

        b2.WorldManifold,
        b2.Manifold,
        b2.ManifoldPoint,

        b2.JointEdge
    ].forEach(function (cls) {
        var p = cls.prototype;
        for (var key in p) {
            if (key.indexOf('set_') === 0) {
                var name = key.replace('set_', '');
                Utils.getset(p, name, p['get_'+name], p[key]);
            }
        }
    });

    Box2D.createVerticesBuffer = function (vertices) {
        var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
        var offset = 0;
        for (var i=0; i<vertices.length; i++) {
            Box2D.setValue(buffer+(offset), vertices[i].get_x(), 'float'); // x
            Box2D.setValue(buffer+(offset+4), vertices[i].get_y(), 'float'); // y
            offset += 8;
        }            
        var ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
        return ptr_wrapped;
    }
}

module.exports = {
    load (useWasm, cb) {
        var src = '';
        var box2dModule = {};

        if (window._CCSettings.debug) {
            src = './wasm/box2d.js';
            if (useWasm) {
                src = './wasm/box2d.wasm.js';
                box2dModule.wasmBinaryFile = './wasm/box2d.wasm.wasm';
            }
        }
        else {
            src = './wasm/box2d.min.js';
            if (useWasm) {
                src = './wasm/box2d.wasm.min.js';
                box2dModule.wasmBinaryFile = './wasm/box2d.wasm.min.wasm';
            }
        }
        
        Utils.loadScript(src, function () {
            if (useWasm) {
                var postrun = [finishLoad];
                Object.defineProperty(box2dModule, 'postRun', {
                    get: function () {
                        return postrun;
                    },
                    set: function (value) {

                    },
                    enumerable: false
                });

                Box2D = Box2D(box2dModule);

                function finishLoad () {
                    initWasmBox2D();
                    cb();
                }
            }
            else {
                cb();
            }
        });
    }
};
