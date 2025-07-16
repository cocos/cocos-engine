import { Node } from '../../cocos/core/scene-graph/node';
import { AnimationClip, AnimationState } from '../../cocos/core/animation';

test('curve types', function () {
    var entity = new Node();

    var clip = new AnimationClip();
    clip.duration = 3;
    clip.sample = 10;
    clip.curveDatas = {
        '/' : {
            props: {
                'position': {
                    keys: 0,
                    // easingMethod: "cubicInOut",
                    values: [
                        {
                            "__type__": "cc.Vec3",
                            "x": 0,
                            "y": 0,
                            "z": 0
                        },
                        {
                            "__type__": "cc.Vec3",
                            "x": 100,
                            "y": 0,
                            "z": 0
                        },
                        {
                            "__type__": "cc.Vec3",
                            "x": 200,
                            "y": 0,
                            "z": 0
                        },
                        {
                            "__type__": "cc.Vec3",
                            "x": 300,
                            "y": 0,
                            "z": 0
                        },
                    ]
                }
            }
        }
    };
    clip.updateCurveDatas();

    var state = new AnimationState(clip);

    state.update(0);

    state.update(0.2);
    expect(entity.position.x).toBeCloseTo(0.2 * 100);

    state.update(1.2);
    // expect(entity.position.x).toBeCloseTo([0, 0.5, 0.5, 1], 0.4) * 100 + 100, 0.0001, 'should wrap time by bezierByTime');

    state.update(1.3);
    // strictEqual(entity.x, 0.7 * 100 + 200, 'should wrap time by linear');
});

// test('DynamicAnimCurve', function () {
//     var DynamicAnimCurve = cc._Test.DynamicAnimCurve;
//     var anim = new DynamicAnimCurve();
//     var target = {
//         height: 1,
//         position: v2(123, 456),
//         foo: {
//             bar: color(128, 128, 128, 128),
//         }
//     };
//     anim.target = target;
//     anim.prop = 'height';
//     anim.values = [10, 100];
//     anim.ratios = [0.5, 1.0];
//     anim.sample(null, 0.1, null);

//     strictEqual(target.height, 10, 'The keyframe value whose ratio is out of ranges should just clamped');

//     anim.prop = 'position';
//     anim.subProps = ['x'];
//     anim.values = [50, 100];
//     anim.ratios = [0.0, 1.0];
//     anim.sample(null, 0.1, null);

//     deepEqual(target.position, v2(55, 456), 'The composed position should animated');

//     anim.target = target;
//     anim.prop = 'foo';
//     anim.subProps = ['bar', 'a'];
//     anim.values = [128, 256];
//     anim.ratios = [0.0, 1.0];
//     anim.sample(null, 0.1, null);

//     deepEqual(target.foo, { bar: color(128, 128, 128, 140) }, 'The composed color should animated');
// });

// test('AnimationState.getWrappedInfo', function () {
//     var info;
//     var animation = new cc.AnimationState();

//     animation.duration = 2;
//     animation.wrapMode = cc.WrapMode.PingPong;
//     animation.repeatCount = Infinity;

//     function deepClose (actual, expected, maxDifference, message) {
//         close(actual.time, expected.time, maxDifference, message + '[time]');
//         close(actual.ratio, expected.ratio, maxDifference, message + '[ratio]');
//         close(actual.direction, expected.direction, maxDifference, message + '[direction]');
//         close(actual.stopped, expected.stopped, maxDifference, message + '[stopped]');
//         close(actual.iterations, expected.iterations, maxDifference, message + '[iterations]');
//     }

//     info = animation.getWrappedInfo(0);
//     deepClose(info, {
//         time: 0,
//         ratio: 0,
//         direction: 1,
//         stopped: false,
//         iterations: 0
//     }, 0.00001, 'should start at time 0');

//     info = animation.getWrappedInfo(2);
//     deepClose(info, {
//         time: 2,
//         ratio: 1,
//         direction: 1,
//         stopped: false,
//         iterations: 1
//     }, 0.00001, 'should at the end of first loop');

//     info = animation.getWrappedInfo(2.1);
//     deepClose(info, {
//         time: 1.9,
//         ratio: 0.95,
//         direction: -1,
//         stopped: false,
//         iterations: 1.05
//     }, 0.00001, 'should at 2nd loop');

//     info = animation.getWrappedInfo(4.0);
//     deepClose(info, {
//         time: 0,
//         ratio: 0,
//         direction: -1,
//         stopped: false,
//         iterations: 2
//     }, 0.00001, 'should at the end of second loop');

//     info = animation.getWrappedInfo(4.2);
//     deepClose(info, {
//         time: 0.2,
//         ratio: 0.1,
//         direction: 1,
//         stopped: false,
//         iterations: 2.1
//     }, 0.00001, 'should at 3rd loop');

// });


// test('createBatchedProperty', function () {
//     var createBatchedProperty = cc._Test.createBatchedProperty;

//     function test(path, mainValue, animValue) {
//         return createBatchedProperty(path, path.indexOf('.'), mainValue, animValue);
//     }

//     var pos = v2(123, 456);
//     var actual = test('position.y', pos, 321);
//     ok(actual !== pos, 'should clone a new value');
//     deepEqual(actual, v2(123, 321), 'checking value x');

//     actual = test('p.x', pos, 321);
//     deepEqual(actual, v2(321, 456), 'checking value y');

//     var MyValue = cc.Class({
//         extends: cc.ValueType,
//         ctor: function () {
//             this.abc = {
//                 def: {
//                     gh: arguments[0]
//                 }
//             };
//         },
//         clone: function () {
//             return new MyValue(this.abc.def.gh);
//         }
//     });
//     var myValue = new MyValue(520);
//     actual = test('myValue.abc.def.gh', myValue, 521);
//     strictEqual(actual.abc.def.gh, 521, 'checking value gh');
// });

// test('initClipData', function () {
//     var initClipData = cc._Test.initClipData;

//     var entity = new cc.Node();
//     entity.name = 'foo';
//     var renderer = entity.addComponent(cc.Sprite);
//     renderer.testColor = Color.BLACK;

//     var childEntity = new cc.Node();
//     childEntity.name = 'bar';
//     var childRenderer = childEntity.addComponent(cc.Sprite);
//     childRenderer.testColor = Color.BLACK;

//     entity.addChild(childEntity);

//     var clip = new cc.AnimationClip();
//     var state = new cc.AnimationState(clip);
//     initClipData(entity, state);
//     strictEqual(state.curves.length, 0, 'should create empty animation');

//     clip = new cc.AnimationClip();
//     clip._duration = 10;
//     clip.curveData = {
//         props: {
//             pos: [
//                 { frame: 0, value: v2(50, 100) },
//                 { frame: 5, value: v2(100, 75) },
//                 { frame: 10, value: v2(100, 50) }
//             ],
//             'scale.x': [
//                 { frame: 0, value: 10 },
//                 { frame: 10, value: 20 }
//             ],
//             'scale.y': [
//                 { frame: 0, value: 10 },
//                 { frame: 5, value: 12 },
//                 { frame: 10, value: 20 }
//             ]
//         },

//         comps: {
//             'cc.Sprite': {
//                 'testColor.a': [
//                     { frame: 0, value: 1 },
//                     { frame: 10, value: 0 }
//                 ]
//             }
//         },

//         paths: {
//             'bar': {
//                 props: {
//                     pos: [
//                         { frame: 0, value: v2(50, 100) },
//                         { frame: 5, value: v2(100, 75) },
//                         { frame: 10, value: v2(100, 50) },
//                     ]
//                 },

//                 comps: {
//                     'cc.Sprite': {
//                         'testColor.a': [
//                             { frame: 0, value: 1 },
//                             { frame: 10, value: 0 }
//                         ]
//                     }
//                 }
//             }
//         }
//     };

//     state = new cc.AnimationState(clip);
//     initClipData(entity, state);

//     var posCurve = state.curves[0];
//     var scaleCurveX = state.curves[1];
//     var scaleCurveY = state.curves[2];
//     var colorCurve = state.curves[3];

//     strictEqual(state.curves.length, 6, 'should create 6 curve');
//     strictEqual(posCurve.target, entity, 'target of posCurve should be transform');
//     strictEqual(posCurve.prop, 'pos', 'propName of posCurve should be pos');
//     strictEqual(scaleCurveX.target, entity, 'target of scaleCurve should be transform');
//     strictEqual(scaleCurveX.prop, 'scale', 'propName of scaleCurve should be scale');
//     strictEqual(colorCurve.target, renderer, 'target of colorCurve should be sprite renderer');
//     strictEqual(colorCurve.prop, 'testColor', 'propName of colorCurve should be testColor');

//     deepEqual(posCurve.values, [v2(50, 100), v2(100, 75), v2(100, 50)], 'values of posCurve should equals keyFrames');

//     deepEqual(scaleCurveY.values, [10, 12, 20], 'values of scaleCurve should equals keyFrames');

//     deepEqual(colorCurve.values, [1, 0], 'values of colorCurve should equals keyFrames');

//     deepEqual(posCurve.ratios, [0, 0.5, 1], 'ratios of posCurve should equals keyFrames');
//     deepEqual(colorCurve.ratios, [0, 1], 'ratios of colorCurve should equals keyFrames');
// });


// test('Animation Component', function () {
//     var entity = new cc.Node();
//     var animation = entity.addComponent(cc.Animation);

//     entity.x = 400;

//     cc.director.getScene().addChild(entity);

//     var clip = new cc.AnimationClip();
//     clip._duration = 10;
//     clip._name = 'test';
//     clip.curveData = {
//         props: {
//             x: [
//                 { frame: 0, value: 0 },
//                 { frame: 5, value: 50 },
//                 { frame: 10, value: 100 }
//             ]
//         }
//     };

//     animation.addClip(clip);

//     strictEqual(animation.getClips().length, 1, 'should add 1 clip');

//     var state = animation.getAnimationState('test');
//     strictEqual(state.clip, clip, 'should create state with clip');

//     strictEqual(state.duration, 10, 'should get state duration');

//     animation.play('test');
//     animation.sample();
//     strictEqual(entity.x, 0, 'target property should equals value in frame 0s');

//     animation.play('test', 5);
//     animation.sample();
//     strictEqual(entity.x, 50, 'target property should equals value in frame 5s');

//     animation.play('test', 10);
//     animation.sample();
//     strictEqual(entity.x, 100, 'target property should equals value in frame 10s');

//     animation.removeClip(clip, true);
//     strictEqual(animation.getClips().length, 0, 'should remove clip');
//     strictEqual(animation.getAnimationState('test'), null, 'should remove state');

//     animation.stop();

//     animation.addClip(clip);
//     animation.play('test');
//     cc.director.runSceneImmediate(new cc.Scene());
//     strictEqual(!!(animation._animator && animation._animator.isPlaying), false, 'animation should be stopped after load scene');
// });


// test('sampleMotionPaths', function () {
//     var sampleMotionPaths = cc._Test.sampleMotionPaths;

//     var data = {
//         prop: 'position',
//         ratios: [
//             0,
//             0.198,
//             1
//         ],
//         values: [
//             [0, 480],
//             [0, 0],
//             [640, 480]
//         ],
//         types: [
//             null,
//             null,
//             null
//         ]
//     };

//     var motionPaths = [
//         null,
//         [[320, 240, 0, 240, 640, 240], [640, 0, 400, 0, 1000, 0]],
//         null
//     ];

//     sampleMotionPaths(motionPaths, data, 2, 60);

//     var values = data.values;
//     var ratios = data.ratios;

//     strictEqual(values.length, 120 + 1, 'motionPath length should be 121');
//     strictEqual(values[0] instanceof cc.Vec2, true, 'motionPath item should be cc.Vec2');

//     close(values[0].x, 0, 0.0001, 'value[0].x should equal value');
//     close(values[0].y, 480, 0.0001, 'value[0].y should equal value');

//     close(values[120].x, 640, 0.0001, 'value[119].x should equal value');
//     close(values[120].y, 480, 0.0001, 'value[119].x should equal value');

//     var index = ( (0.198 / (1/120)) | 0 ) + 1;
//     close(values[index].x, 0.1327874, 0.0001, 'value[index].x should equal value');
//     close(values[index].y, 3.8064457, 0.0001, 'value[index].x should equal value');

//     var betweenRatio = 1 / (values.length - 1);

//     for (var i = 0; i < values.length - 1; i++) {
//         close(ratios[i + 1] - ratios[i], betweenRatio, 0.0001, 'betweenRatio should be same');
//     }
// });

// test('SampledAnimCurve', function () {
//     var initClipData = cc._Test.initClipData;

//     var entity = new cc.Node();

//     var clip = new cc.AnimationClip();
//     clip._name = 'test';
//     clip._duration = 1;
//     clip.sample = 60;
//     clip.curveData = {
//         props: {
//             position: [
//                 {frame: 0.2, value: [0, 0]},
//                 {frame: 0.7, value: [100, 100]}
//             ],
//             test: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };

//     state = new cc.AnimationState(clip);
//     initClipData(entity, state);

//     state.time = 0.2;
//     state.sample();

//     deepEqual(entity.position, v2(0, 0), 'entity position should be (0,0)');

//     state.time = 0.7;
//     state.sample();

//     deepEqual(entity.position, v2(100, 100), 'entity position should be (100, 100)');

//     state.time = 0.9;
//     state.sample();

//     deepEqual(entity.position, v2(100, 100), 'entity position should be (100, 100)');
// });


// test('EventAnimCurve', function () {
//     var initClipData = cc._Test.initClipData;

//     var manager = cc.director.getAnimationManager();

//     var calls = [];
//     var state;

//     var MyComp = cc.Class({
//         name: 'MyComp',
//         extends: cc.Component,

//         func1: function (arg1) {
//             calls.push({
//                 func: 'func1',
//                 args: [arg1]
//             });
//         },

//         func2: function (arg1, arg2) {
//             calls.push({
//                 func: 'func2',
//                 args: [arg1, arg2]
//             });
//         },

//         func3: function (arg1) {
//             calls.push({
//                 func: 'func3',
//                 args: [arg1]
//             });
//         }
//    });

//     var entity = new cc.Node();
//     entity.addComponent(MyComp);

//     cc.director.getScene().addChild(entity);

//     var animation = entity.addComponent(cc.Animation);

//     var clip = new cc.AnimationClip();
//     clip._duration = 2;
//     clip._name = 'test';
//     clip.sample = 10;
//     clip.events = [
//         {frame: 0.2, func: 'func1', params: ['Frame 0 Event triggered']},
//         {frame: 0.4, func: 'func2', params: [1, 2]},
//         {frame: 0.4, func: 'func3', params: ['Second event on frame 0.4']},
//         {frame: 1, func: 'func1', params: ['Frame 2 Event triggered']},
//         {frame: 1.2, func: 'func1', params: ['Frame 3 Event triggered']},
//         {frame: 1.4, func: 'func1', params: ['Frame 4 Event triggered']},
//         {frame: 1.8, func: 'func1', params: ['Frame 5 Event triggered']}
//     ];

//     animation.addClip(clip);
//     state = animation.getAnimationState('test');

//     animation.play('test');
//     // play best first frame
//     manager.update(0);
//     manager.update(0.1);
//     deepEqual(calls, [], 'should not triggered events');

//     manager.update(0.1);
//     deepEqual(calls, [{
//         func: 'func1',
//         args: ['Frame 0 Event triggered']
//     }], 'func1 should called with args');


//     calls = [];
//     manager.update(0.1);
//     deepEqual(calls, [], 'next event should not be triggered');

//     manager.update(0.2);
//     manager.update(0.2);
//     deepEqual(calls, [
//         {
//             func: 'func2',
//             args: [1, 2]
//         },
//         {
//             func: 'func3',
//             args: ['Second event on frame 0.4']
//         }
//     ], 'next event should be triggered once');


//     calls = [];
//     manager.update(1);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 2 Event triggered']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 3 Event triggered']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 4 Event triggered']
//         }
//     ], 'should triggered frame 3 event in sequence');


//     calls = [];
//     manager.update(10);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 5 Event triggered']
//         }
//     ], 'should triggered last event once');


//     animation.stop('test');
//     animation.play('test');
//     state.wrapMode = cc.WrapMode.Loop;
//     state.repeatCount = Infinity;
//     manager.update(0);
//     manager.update(1.7);
//     calls = [];
//     manager.update(0.3);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 5 Event triggered']
//         }
//     ], 'should only triggered last event if wrapMode is Loop');

//     calls = [];
//     manager.update(0.1);
//     deepEqual(calls, [], 'should not triggered event');


//     animation.stop('test');
//     animation.play('test');
//     state.wrapMode = cc.WrapMode.Loop;
//     state.repeatCount = Infinity;
//     manager.update(0);
//     manager.update(1.7);
//     calls = [];
//     manager.update(0.5);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 5 Event triggered']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ], 'should triggered last and first event if wrapMode is Loop');


//     animation.stop('test');
//     animation.play('test');
//     state.wrapMode = cc.WrapMode.Reverse;
//     state.repeatCount = 1;
//     manager.update(0);
//     calls = [];
//     manager.update(0.1);
//     deepEqual(calls, [], 'should triggered no events if wrapMode is Reverse');

//     calls = [];
//     manager.update(0.1);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 5 Event triggered']
//         }
//     ], 'should triggered last event if wrapMode is Reverse');

//     calls = [];
//     manager.update(0.1);
//     deepEqual(calls, [], 'should triggered no events if wrapMode is Reverse');

//     calls = [];
//     manager.update(1);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 4 Event triggered']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 3 Event triggered'],
//         },
//         {
//             func: 'func1',
//             args: ['Frame 2 Event triggered'],
//         }
//     ], 'should triggered no events if wrapMode is Reverse');

//     calls = [];
//     manager.update(10);
//     deepEqual(calls, [
//         {
//             func: 'func2',
//             args: [1, 2],
//         },
//         {
//             func: 'func3',
//             args: ['Second event on frame 0.4']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ], 'should triggered no events if wrapMode is Reverse');


//     animation.stop('test');
//     animation.play('test');
//     state.wrapMode = cc.WrapMode.PingPong;
//     state.repeatCount = Infinity;
//     manager.update(0);
//     manager.update(1.7);
//     calls = [];
//     manager.update(0.5);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 5 Event triggered']
//         }
//     ], 'should triggered frame 5 event once if wrapMode is PingPong');

//     calls = [];
//     manager.update(0.2);
//     deepEqual(calls, [], 'should triggered no events if wrapMode is PingPong');

//     calls = [];
//     manager.update(0.3);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 4 Event triggered']
//         }
//     ], 'should triggered frame 4 event once if wrapMode is PingPong');

//     animation.stop('test');
//     animation.play('test');
//     state.wrapMode = cc.WrapMode.PingPongReverse;
//     state.repeatCount = Infinity;
//     manager.update(0);
//     manager.update(1.7);
//     calls = [];
//     manager.update(0.5);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ], 'should triggered frame 0 event once if wrapMode is PingPongReverse');

//     animation.stop('test');
//     animation.play('test');
//     state.speed = -1;
//     state.wrapMode = cc.WrapMode.Normal;
//     state.repeatCount = Infinity;
//     manager.update(0);
//     calls = [];
//     manager.update(0.5);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 5 Event triggered']
//         }
//     ], 'should triggered frame 5 event once if speed is -1');



//     animation.stop('test');
//     animation.play('test');
//     state.speed = -1;
//     state.wrapMode = cc.WrapMode.PingPongReverse;
//     state.repeatCount = Infinity;
//     manager.update(0);
//     manager.update(1.7);
//     calls = [];
//     manager.update(0.5);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 5 Event triggered']
//         }
//     ], 'should triggered frame 5 event once if speed is -1');


//     state.speed = 1;
//     state.wrapMode = cc.WrapMode.Normal;
//     animation.stop('test');
//     animation.play('test', 1.1);
//     calls = [];
//     manager.update(0);
//     manager.update(1);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 3 Event triggered']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 4 Event triggered']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 5 Event triggered']
//         }
//     ], 'should triggered from frame 3 to frame 5');


//     state.wrapMode = cc.WrapMode.Reverse;
//     animation.stop('test');
//     animation.play('test', 1.1);
//     calls = [];
//     manager.update(0);
//     manager.update(1);
//     deepEqual(calls, [
//         {
//             func: 'func2',
//             args: [1,2]
//         },
//         {
//             func: 'func3',
//             args: ['Second event on frame 0.4']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ], 'should triggered from frame 2 to frame 0');


//     // new clip
//     clip = new cc.AnimationClip();
//     clip._duration = 2;
//     clip._name = 'test';
//     clip.sample = 10;
//     clip.events = [
//         {frame: 2, func: 'func1', params: ['Frame 0 Event triggered']},
//     ];

//     animation.addClip(clip);
//     state = animation.getAnimationState('test');

//     // loop and single frame at last
//     state.wrapMode = cc.WrapMode.Loop;
//     state.repeatCount = Infinity;
//     animation.play('test');
//     manager.update(0);

//     calls = [];
//     manager.update(1);
//     manager.update(2);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ]);

//     // pingpong and single frame at last
//     animation.stop('test');
//     animation.play('test');
//     state.wrapMode = cc.WrapMode.PingPong;
//     state.setTime(0);
//     manager.update(0);
//     calls = [];
//     manager.update(1);
//     manager.update(2);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ]);

//     calls = [];
//     manager.update(2);
//     deepEqual(calls, [
//     ]);

//     // loop reverse and single frame at last
//     animation.stop('test');
//     animation.play('test');
//     state.wrapMode = cc.WrapMode.LoopReverse;
//     state.setTime(0);
//     calls = [];
//     manager.update(0);
//     manager.update(2);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ]);

//     calls = [];
//     manager.update(2);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ]);


//     // new clip
//     clip = new cc.AnimationClip();
//     clip._duration = 1;
//     clip._name = 'test';
//     clip.sample = 10;
//     clip.events = [
//         {frame: 0, func: 'func1', params: ['Frame 0 Event triggered']},
//     ];

//     animation.addClip(clip);
//     state = animation.getAnimationState('test');

//     // loop and single frame at 0
//     state.wrapMode = cc.WrapMode.Loop;
//     state.repeatCount = Infinity;
//     animation.play('test');
//     manager.update(0);
//     manager.update(0.5);

//     calls = [];
//     manager.update(1);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ]);

//     calls = [];
//     manager.update(1);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ]);


//     // new clip
//     clip = new cc.AnimationClip();
//     clip._duration = 1;
//     clip._name = 'test';
//     clip.sample = 10;
//     clip.events = [
//         {frame: 0.5, func: 'func1', params: ['Frame 0 Event triggered']},
//         {frame: 1, func: 'func1', params: ['Frame 1 Event triggered']},
//     ];

//     animation.addClip(clip);
//     state = animation.getAnimationState('test');

//     // loop and single frame at 0
//     state.wrapMode = cc.WrapMode.PingPong;
//     state.repeatCount = Infinity;
//     animation.play('test');
//     manager.update(0);

//     calls = [];
//     manager.update(0.4);
//     manager.update(0.4);
//     manager.update(0.4);
//     manager.update(0.4);
//     manager.update(0.4);
//     manager.update(0.4);
//     manager.update(0.4);
//     deepEqual(calls, [
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 1 Event triggered']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         },
//         {
//             func: 'func1',
//             args: ['Frame 0 Event triggered']
//         }
//     ]);

//     animation.stop();
// });

// test('stop Animation', function () {
//     var entity = new cc.Node();
//     var animation = entity.addComponent(cc.Animation);
    
//     cc.director.getScene().addChild(entity);

//     var clip = new cc.AnimationClip();
//     clip._name = 'test';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };

//     var animationManager = cc.director.getAnimationManager();
//     animationManager._anims.array.length = 0;

//     animation.addClip(clip);
//     animation._init();

//     animation.play('test');

//     strictEqual(animationManager._anims.array.length, 1, 'playing animators should be 1');
//     strictEqual(animation._animator._anims.array.length, 1, 'playing anims should be 1');

//     animationManager.update(0);
//     animationManager.update(1);

//     strictEqual(animationManager._anims.array.length, 0, 'playing animators should be 0');
//     strictEqual(animation._animator._anims.array.length, 0, 'playing anims should be 0');

//     animation.play('test');
//     animationManager.update(0.5);

//     strictEqual(animationManager._anims.array.length, 1, 'playing animators should be 1');
//     strictEqual(animation._animator._anims.array.length, 1, 'playing anims should be 1');

//     animation.stop();

//     strictEqual(animationManager._anims.array.length, 0, 'playing animators should be 0');
//     strictEqual(animation._animator._anims.array.length, 0, 'playing anims should be 0');
// });

// test('play Animation', function () {
//     var entity = new cc.Node();
//     var animation = entity.addComponent(cc.Animation);

//     var clip = new cc.AnimationClip();
//     clip._name = 'move';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };
//     animation.addClip(clip);

//     clip = new cc.AnimationClip();
//     clip._name = 'rotate';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             rotation: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 90}
//             ]
//         }
//     };
//     animation.addClip(clip);

//     clip = new cc.AnimationClip();
//     clip._name = 'scale';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             scaleX: [
//                 {frame: 0, value: 1},
//                 {frame: 1, value: 2}
//             ]
//         }
//     };
//     animation.addClip(clip);

//     var moveState = animation.getAnimationState('move');
//     var rotateState = animation.getAnimationState('rotate');

//     strictEqual(moveState.isPlaying, false, 'move animation state should not be playing');
//     strictEqual(rotateState.isPlaying, false, 'rotate animation state should not be playing');

//     animation.play('move');
//     strictEqual(moveState.isPlaying, true, 'move animation state should be playing');
//     strictEqual(rotateState.isPlaying, false, 'rotate animation state should not be playing');

//     animation.play('rotate');
//     strictEqual(moveState.isPlaying, false, 'move animation state should not be playing');
//     strictEqual(rotateState.isPlaying, true, 'rotate animation state should be playing');

//     animation.playAdditive('move');
//     strictEqual(moveState.isPlaying, true, 'move animation state should be playing');
//     strictEqual(rotateState.isPlaying, true, 'rotate animation state should be playing');

//     animation.play('scale');
//     strictEqual(moveState.isPlaying, false, 'move animation state should not be playing');
//     strictEqual(rotateState.isPlaying, false, 'rotate animation state should be playing');

//     animation.stop();
// });

// test('animation enabled/disabled', function () {
//     var scene = cc.director.getScene();
//     var entity = new cc.Node();
//     var animation = entity.addComponent(cc.Animation);

//     entity.parent = scene;

//     var clip = new cc.AnimationClip();
//     clip._name = 'move';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };
//     animation.addClip(clip);
//     animation.play('move');

//     animation.enabled = false;

//     strictEqual(animation._animator.isPlaying, true, 'move animation should be playing');
//     strictEqual(animation._animator.isPaused, true, 'move animation should be paused');

//     animation.enabled = true;

//     strictEqual(animation._animator.isPlaying, true, 'move animation should be playing');
//     strictEqual(animation._animator.isPaused, false, 'move animation should be resumed');

//     entity.parent = null;
// });

// test('animation removeClip', function () {
//     var entity = new cc.Node();
//     var animation = entity.addComponent(cc.Animation);

//     var clip1 = new cc.AnimationClip();
//     clip1._name = 'clip1';
//     clip1._duration = 1;
//     clip1.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };
//     animation.addClip(clip1);
//     animation._defaultClip = clip1;

//     var clip2 = new cc.AnimationClip();
//     clip2._name = 'clip2';
//     clip2._duration = 1;
//     clip2.curveData = {
//         props: {
//             y: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };
//     animation.addClip(clip2);

//     animation.removeClip(clip1);
//     strictEqual(animation._clips.indexOf(clip1), 0, 'clip1 will not be removed since clip1 is defaultClip');
    
//     animation.removeClip(clip1, true);
//     strictEqual(animation._clips.indexOf(clip1), -1, 'clip1 will be removed even it\'t defaultClip if force is true');
//     strictEqual(animation.defaultClip, null, 'defaultClip will be reset to null');

//     animation.play('clip2');
//     animation.removeClip(clip2);
//     strictEqual(animation._clips.indexOf(clip2), 0, 'clip2 will not be removed since clip2 is playing');

//     animation.removeClip(clip2, true);
//     strictEqual(animation._clips.indexOf(clip2), -1, 'clip2 will be removed even clip2 is playing if force is true');

//     animation.stop();
// });

// test('animation callback', function () {
//     var type; 

//     function callback (t, state) {
//         strictEqual(state instanceof cc.AnimationState, true);
//         strictEqual(state.name === 'move', true);

//         type = t;
//     }

//     var manager = cc.director.getAnimationManager();

//     var entity = new cc.Node();
//     var animation = entity.addComponent(cc.Animation);

//     cc.director.getScene().addChild(entity);

//     var clip = new cc.AnimationClip();
//     clip._name = 'move';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };
//     animation.addClip(clip);

//     var state = animation.getAnimationState('move');

//     animation.on('play', callback);
//     animation.on('pause', callback);
//     animation.on('resume', callback);
//     animation.on('stop', callback);

//     animation.play('move');
//     manager.update(0);
//     strictEqual(type === 'play', true, 'should trigger play callback');

//     animation.pause('move');
//     manager.update(0);
//     strictEqual(type === 'pause', true, 'should trigger pause callback');

//     animation.resume('move');
//     manager.update(0);
//     strictEqual(type === 'resume', true, 'should trigger resume callback');

//     manager.update(0);
//     manager.update(1);
//     strictEqual(type === 'stop', true, 'should trigger stop callback');

//     type = '';

//     animation.off('play', callback);

//     animation.play('move');
//     manager.update(0);
//     strictEqual(type === '', true, 'should not trigger callback');

//     animation.off('pause', callback);
//     animation.off('resume', callback);

//     animation.pause('move');
//     manager.update(0);
//     strictEqual(type === 'pause', false, 'should not trigger pause callback');

//     animation.on('resume', callback);
//     animation.resume('move');
//     manager.update(0);
//     strictEqual(type === 'resume', true, 'should trigger resume callback');

//     animation.on('finished', callback);
//     manager.update(1);
//     strictEqual(type === 'finished', true, 'should trigger finished callback');


//     clip = new cc.AnimationClip();
//     clip._name = 'move2';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };
//     animation.addClip(clip);

//     var list = [];
//     function callback2 (t, state) {
//         list.push([state.name, t]);
//     }

//     animation.play('move');
//     manager.update(0);

//     animation.on('play', callback2);
//     animation.on('stop', callback2);

//     animation.play('move2');
//     manager.update(0);
//     deepEqual(list, [['move2', 'play'], ['move', 'stop']]);

//     animation.stop();
// });

// test('animation callback', function () {
//     var entity = new cc.Node();

//     var animation = entity.addComponent(cc.Animation);

//     clip = new cc.AnimationClip();
//     clip._name = 'test';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };

//     animation.addClip(clip);

//     animation.play('test');
//     animation.setCurrentTime(0.5,'test');
//     strictEqual(entity.x, 50, 'entity.x should be 50');

//     animation.setCurrentTime(0.7);
//     strictEqual(entity.x, 70, 'entity.x should be 70');

//     animation.stop();
// });

// test('animation delay', function () {
//     var entity = new cc.Node();

//     var animation = entity.addComponent(cc.Animation);

//     clip = new cc.AnimationClip();
//     clip._name = 'test';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };

//     animation.addClip(clip);

//     var state = animation.play('test');

//     state.delay = 5;

//     strictEqual(state._delayTime, 5, 'delay time should be 5');
    
//     state.update(3);
//     strictEqual(state._delayTime, 2, 'delay time should be 2');
//     strictEqual(entity.x, 0, 'entity should not changed during delay');

//     state.update(2);
//     strictEqual(state._delayTime === 0, true, 'delay time should be 0');

//     state.update(1);
//     strictEqual(entity.x, 100, 'entity should move to end');
//     strictEqual(state.isPlaying, false, 'animation should end.');

//     state = animation.play('test');

//     strictEqual(state._delayTime, 5, 'delay time should reset when replay');

//     animation.stop();
// });

// test('animation pause/resume', function () {
//     var entity = new cc.Node();
//     entity.parent = cc.director.getScene();

//     var animation = entity.addComponent(cc.Animation);

//     clip = new cc.AnimationClip();
//     clip._name = 'test';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };

//     animation.addClip(clip);

//     animation.play('test');

//     animation.pause();
//     strictEqual(animation._animator._isPaused, true, 'animation should be paused');

//     entity.active = false;
//     strictEqual(animation._animator._isPaused, true, 'animation should be paused');

//     entity.active = true;
//     strictEqual(animation._animator._isPaused, true, 'animation should be paused');

//     animation.resume();
//     strictEqual(animation._animator._isPaused, false, 'animation should not be paused');
    
//     entity.parent = null;
// });

// test('animation pause/resume should remove animation-actor from animation manager', function () {
//     var entity = new cc.Node();
//     entity.parent = cc.director.getScene();

//     var animation = entity.addComponent(cc.Animation);

//     clip = new cc.AnimationClip();
//     clip._name = 'test';
//     clip._duration = 1;
//     clip.curveData = {
//         props: {
//             x: [
//                 {frame: 0, value: 0},
//                 {frame: 1, value: 100}
//             ]
//         }
//     };

//     animation.addClip(clip);

//     var manager = cc.director.getAnimationManager();

//     var state = animation.play('test');
//     strictEqual(manager._anims.array.length, 1, 'should add 1 animation to animation manager');

//     animation.pause();
//     strictEqual(manager._anims.array.length, 0, 'should remove animation from animation manager');
//     strictEqual(state.animator, null, 'should unbind animator to animation state when pause animation');

//     animation.resume();
//     strictEqual(manager._anims.array.length, 1, 'should add 1 animation to animation manager');
//     strictEqual(state.animator, animation._animator, 'should rebind animator to animation state when pause animation');
    
//     animation.stop();
//     strictEqual(manager._anims.array.length, 0, 'should remove animation from animation manager');

//     // should not see error log in console
//     animation.play('test');
//     animation.pause();
//     animation.stop();

//     animation.play('test');
//     entity.parent = null;

//     strictEqual(manager._anims.array.length, 0, 'should remove animation from animation manager');
// });


// test('animation play on load', function () {
//     var entity = new cc.Node();

//     var animation = entity.addComponent(cc.Animation);
//     animation.playOnLoad = true;

//     var clip1 = new cc.AnimationClip();
//     clip1._name = 'clip1';
//     clip1._duration = 1;

//     var clip2 = new cc.AnimationClip();
//     clip2._name = 'clip2';
//     clip2._duration = 1;


//     animation.addClip(clip1);
//     animation.addClip(clip2);

//     animation._defaultClip = clip1;

//     animation.play('clip2');
    
//     entity.parent = cc.director.getScene();
//     animation.start();

//     strictEqual(animation.getAnimationState('clip1').isPlaying, false, 'default clip should not be played if there is playing animation');
//     strictEqual(animation.getAnimationState('clip2').isPlaying, true, 'should play the specified animation');

//     entity.parent = null;
// });
