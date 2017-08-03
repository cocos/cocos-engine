/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

require('./CCParticleAsset');
require('./CCSGParticleSystem');
require('./CCSGParticleSystemCanvasRenderCmd');
require('./CCSGParticleSystemWebGLRenderCmd');
require('./CCParticleBatchNode');
require('./CCParticleBatchNodeCanvasRenderCmd');
require('./CCParticleBatchNodeWebGLRenderCmd');

var BlendFactor = cc.BlendFunc.BlendFactor;
/**
 * !#en Enum for emitter modes
 * !#zh 发射模式
 * @enum ParticleSystem.EmitterMode
 */
var EmitterMode = cc.Enum({
    /**
     * !#en Uses gravity, speed, radial and tangential acceleration.
     * !#zh 重力模式，模拟重力，可让粒子围绕一个中心点移近或移远。
     * @property {Number} GRAVITY
     */
    GRAVITY: 0,
    /**
     * !#en Uses radius movement + rotation.
     * !#zh 半径模式，可以使粒子以圆圈方式旋转，它也可以创造螺旋效果让粒子急速前进或后退。
     * @property {Number} RADIUS - Uses radius movement + rotation.
     */
    RADIUS: 1
});

/**
 * !#en Enum for particles movement type.
 * !#zh 粒子位置类型
 * @enum ParticleSystem.PositionType
 */
var PositionType = cc.Enum({
    /**
     * !#en
     * Living particles are attached to the world and are unaffected by emitter repositioning.
     * !#zh
     * 自由模式，相对于世界坐标，不会随粒子节点移动而移动。（可产生火焰、蒸汽等效果）
     * @property {Number} FREE
     */
    FREE: 0,

    /**
     * !#en
     * Living particles are attached to the world but will follow the emitter repositioning.<br/>
     * Use case: Attach an emitter to an sprite, and you want that the emitter follows the sprite.
     * !#zh
     * 相对模式，粒子会随父节点移动而移动，可用于制作移动角色身上的特效等等。（该选项在 Creator 中暂时不支持）
     * @property {Number} RELATIVE
     */
    RELATIVE: 1,

    /**
     * !#en
     * Living particles are attached to the emitter and are translated along with it.
     * !#zh
     * 整组模式，粒子跟随发射器移动。（不会发生拖尾）
     * @property {Number} GROUPED
     */
    GROUPED: 2
});

/**
 * @class ParticleSystem
 */

var properties = {

    /**
     * !#en Play particle in edit mode.
     * !#zh 在编辑器模式下预览粒子，启用后选中粒子时，粒子将自动播放。
     * @property {Boolean} preview
     * @default false
     */
    preview: {
        default: true,
        editorOnly: true,
        notify: CC_EDITOR && function () {
            this._sgNode.resetSystem();
            if ( !this.preview ) {
                this._sgNode.stopSystem();
            }
            cc.engine.repaintInEditMode();
        },
        animatable: false,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.preview'
    },

    /**
     * !#en
     * If set custom to true, then use custom properties insteadof read particle file.
     * !#zh 是否自定义粒子属性。
     * @property {Boolean} custom
     * @default false
     */
    _custom: false,
    custom: {
        get: function () {
            return this._custom;
        },
        set: function (value) {
            if (CC_EDITOR && !value && !this._file) {
                return cc.warnID(6000);
            }
            if (this._custom !== value) {
                this._custom = value;
                if (value) {
                    this._applyCustoms();
                }
                else {
                    this._applyFile();
                }
                if (CC_EDITOR) {
                    cc.engine.repaintInEditMode();
                //    self.preview = self.preview;
                }
            }
        },
        animatable: false,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.custom'
    },

    /**
     * !#en The plist file.
     * !#zh plist 格式的粒子配置文件。
     * @property {string} file
     * @default ""
     */
    _file: {
        default: '',
        url: cc.ParticleAsset
    },
    file: {
        get: function () {
            return this._file;
        },
        set: function (value, force) {
            if (this._file !== value || (CC_EDITOR && force)) {
                this._file = value;
                if (value) {
                    this._applyFile();
                    if (CC_EDITOR) {
                        cc.engine.repaintInEditMode();
                        //self.preview = self.preview;
                    }
                }
                else {
                    this.custom = true;
                }
            }
        },
        animatable: false,
        url: cc.ParticleAsset,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.file'
    },

    /**
     * !#en Texture of Particle System。
     * !#zh 粒子贴图。
     * @property {Texture2D} texture.
     */
    _texture: {
        default: '',
        url: cc.Texture2D
    },
    texture: {
        get: function () {
            return this._texture;
        },
        set: function (value) {
            this._texture = value;
            this._sgNode.texture = value ? cc.textureCache.addImage( value ) : null;
            if (!value && this._file) {
                // fallback to plist
                this._applyFile();
            }
        },
        url: cc.Texture2D,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.texture'
    },

    /**
     * !#en Current quantity of particles that are being simulated.
     * !#zh 当前播放的粒子数量。
     * @property {Number} particleCount
     */
    particleCount: {
        get: function () {
            return this._sgNode.particleCount;
        },
        set: function (value) {
            this._sgNode.particleCount = value;
        },
        visible: false,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.particleCount'
    },

    /**
     * !#en Specify the source Blend Factor.
     * !#zh 指定原图混合模式。
     * @property srcBlendFactor
     * @type {BlendFactor}
     */
    _srcBlendFactor : BlendFactor.SRC_ALPHA,
    srcBlendFactor: {
        get: function() {
            return this._srcBlendFactor;
        },
        set: function(value) {
            this._srcBlendFactor = value;
            this._blendFunc.src = value;
            this._sgNode.setBlendFunc(this._blendFunc);
        },
        animatable: false,
        type:BlendFactor,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.srcBlendFactor'
    },

    /**
     * !#en Specify the destination Blend Factor.
     * !#zh 指定目标的混合模式。
     * @property dstBlendFactor
     * @type {BlendFactor}
     */
    _dstBlendFactor : BlendFactor.ONE_MINUS_SRC_ALPHA,
    dstBlendFactor: {
        get: function() {
            return this._dstBlendFactor;
        },
        set: function(value) {
            this._dstBlendFactor = value;
            this._blendFunc.dst = value;
            this._sgNode.setBlendFunc(this._blendFunc);
        },
        animatable: false,
        type: BlendFactor,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.dstBlendFactor'
    },

    /**
     * !#en If set to true, the particle system will automatically start playing on onLoad.
     * !#zh 如果设置为 true 运行时会自动发射粒子。
     * @property playOnLoad
     * @type {boolean}
     * @default true
     */
    playOnLoad: true,

    /**
     * !#en Indicate whether the owner node will be auto-removed when it has no particles left.
     * !#zh 粒子播放完毕后自动销毁所在的节点。
     * @property {Boolean} autoRemoveOnFinish
     */
    _autoRemoveOnFinish: false,
    autoRemoveOnFinish: {
        get: function () {
            return this._autoRemoveOnFinish;
        },
        set: function (value) {
            if (this._autoRemoveOnFinish !== value) {
                this._autoRemoveOnFinish = value;
                if (!CC_EDITOR || cc.engine.isPlaying) {
                    this._applyAutoRemove();
                }
            }
        },
        animatable: false,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.autoRemoveOnFinish'
    },

    /**
     * !#en Indicate whether the particle system is activated.
     * !#zh 是否激活粒子。
     * @property {Boolean} active
     * @readonly
     */
    active: {
        get: function () {
            return this._sgNode ? this._sgNode.isActive() : false;
        },
        visible: false
    }
};

var CustomProps = (function () {
    var DefaultValues = {
        /**
         * !#en Maximum particles of the system.
         * !#zh 粒子最大数量。
         * @property {Number} totalParticles
         * @default 150
         */
        totalParticles: 150,
        /**
         * !#en How many seconds the emitter wil run. -1 means 'forever'.
         * !#zh 发射器生存时间，单位秒，-1表示持续发射。
         * @property {Number} duration
         * @default ParticleSystem.DURATION_INFINITY
         */
        duration: -1,
        /**
         * !#en Emission rate of the particles.
         * !#zh 每秒发射的粒子数目。
         * @property {Number} emissionRate
         * @default 10
         */
        emissionRate: 10,
        /**
         * !#en Life of each particle setter.
         * !#zh 粒子的运行时间。
         * @property {Number} life
         * @default 1
         */
        life: 1,
        /**
         * !#en Variation of life.
         * !#zh 粒子的运行时间变化范围。
         * @property {Number} lifeVar
         * @default 0
         */
        lifeVar: 0,

        /**
         * !#en Start color of each particle.
         * !#zh 粒子初始颜色。
         * @property {Color} startColor
         * @default cc.Color.WHITE
         */
        startColor: cc.Color.WHITE,
        /**
         * !#en Variation of the start color.
         * !#zh 粒子初始颜色变化范围。
         * @property {Color} startColorVar
         * @default cc.Color.BLACK
         */
        startColorVar: cc.Color.BLACK,
        /**
         * !#en Ending color of each particle.
         * !#zh 粒子结束颜色。
         * @property {Color} endColor
         * @default new cc.Color(255, 255, 255, 0)
         */
        endColor: cc.color(255, 255, 255, 0),
        /**
         * !#en Variation of the end color.
         * !#zh 粒子结束颜色变化范围。
         * @property {Color} endColorVar -
         * @default Color.TRANSPARENT
         */
        endColorVar: cc.color(0, 0, 0, 0),

        /**
         * !#en Angle of each particle setter.
         * !#zh 粒子角度。
         * @property {Number} angle
         * @default 90
         */
        angle: 90,
        /**
         * !#en Variation of angle of each particle setter.
         * !#zh 粒子角度变化范围。
         * @property {Number} angleVar
         * @default 20
         */
        angleVar: 20,
        /**
         * !#en Start size in pixels of each particle.
         * !#zh 粒子的初始大小。
         * @property {Number} startSize
         * @default 50
         */
        startSize: 50,
        /**
         * !#en Variation of start size in pixels.
         * !#zh 粒子初始大小的变化范围。
         * @property {Number} startSizeVar
         * @default 0
         */
        startSizeVar: 0,
        /**
         * !#en End size in pixels of each particle.
         * !#zh 粒子结束时的大小。
         * @property {Number} endSize
         * @default 0
         */
        endSize: 0,
        /**
         * !#en Variation of end size in pixels.
         * !#zh 粒子结束大小的变化范围。
         * @property {Number} endSizeVar
         * @default 0
         */
        endSizeVar: 0,
        /**
         * !#en Start angle of each particle.
         * !#zh 粒子开始自旋角度。
         * @property {Number} startSpin
         * @default 0
         */
        startSpin: 0,
        /**
         * !#en Variation of start angle.
         * !#zh 粒子开始自旋角度变化范围。
         * @property {Number} startSpinVar
         * @default 0
         */
        startSpinVar: 0,
        /**
         * !#en End angle of each particle.
         * !#zh 粒子结束自旋角度。
         * @property {Number} endSpin
         * @default 0
         */
        endSpin: 0,
        /**
         * !#en Variation of end angle.
         * !#zh 粒子结束自旋角度变化范围。
         * @property {Number} endSpinVar
         * @default 0
         */
        endSpinVar: 0,

        /**
         * !#en Source position of the emitter.
         * !#zh 发射器位置。
         * @property {Vec2} sourcePos
         * @default cc.Vec2.ZERO
         */
        sourcePos: cc.p(0, 0),

        /**
         * !#en Variation of source position.
         * !#zh 发射器位置的变化范围。（横向和纵向）
         * @property {Vec2} posVar
         * @default cc.Vec2.ZERO
         */
        posVar: cc.p(0, 0),

        /**
         * !#en Particles movement type.
         * !#zh 粒子位置类型。
         * @property {ParticleSystem.PositionType} positionType
         * @default ParticleSystem.PositionType.FREE
         */
        positionType: PositionType.FREE,
        /**
         * !#en Particles emitter modes.
         * !#zh 发射器类型。
         * @property {ParticleSystem.EmitterMode} emitterMode
         * @default ParticleSystem.EmitterMode.GRAVITY
         */
        emitterMode: EmitterMode.GRAVITY,

        // GRAVITY MODE

        /**
         * !#en Gravity of the emitter.
         * !#zh 重力。
         * @property {Vec2} gravity
         * @default cc.Vec2.ZERO
         */
        gravity: cc.p(0, 0),
        /**
         * !#en Speed of the emitter.
         * !#zh 速度。
         * @property {Number} speed
         * @default 180
         */
        speed: 180,
        /**
         * !#en Variation of the speed.
         * !#zh 速度变化范围。
         * @property {Number} speedVar
         * @default 50
         */
        speedVar: 50,
        /**
         * !#en Tangential acceleration of each particle. Only available in 'Gravity' mode.
         * !#zh 每个粒子的切向加速度，即垂直于重力方向的加速度，只有在重力模式下可用。
         * @property {Number} tangentialAccel
         * @default 80
         */
        tangentialAccel: 80,
        /**
         * !#en Variation of the tangential acceleration.
         * !#zh 每个粒子的切向加速度变化范围。
         * @property {Number} tangentialAccelVar
         * @default 0
         */
        tangentialAccelVar: 0,
        /**
         * !#en Acceleration of each particle. Only available in 'Gravity' mode.
         * !#zh 粒子径向加速度，即平行于重力方向的加速度，只有在重力模式下可用。
         * @property {Number} radialAccel
         * @default 0
         */
        radialAccel: 0,
        /**
         * !#en Variation of the radial acceleration.
         * !#zh 粒子径向加速度变化范围。
         * @property {Number} radialAccelVar
         * @default 0
         */
        radialAccelVar: 0,

        /**
         * !#en Indicate whether the rotation of each particle equals to its direction. Only available in 'Gravity' mode.
         * !#zh 每个粒子的旋转是否等于其方向，只有在重力模式下可用。
         * @property {Boolean} rotationIsDir
         * @default false
         */
        rotationIsDir: false,

        // RADIUS MODE

        /**
         * !#en Starting radius of the particles. Only available in 'Radius' mode.
         * !#zh 初始半径，表示粒子出生时相对发射器的距离，只有在半径模式下可用。
         * @property {Number} startRadius
         * @default 0
         */
        startRadius: 0,
        /**
         * !#en Variation of the starting radius.
         * !#zh 初始半径变化范围。
         * @property {Number} startRadiusVar
         * @default 0
         */
        startRadiusVar: 0,
        /**
         * !#en Ending radius of the particles. Only available in 'Radius' mode.
         * !#zh 结束半径，只有在半径模式下可用。
         * @property {Number} endRadius
         * @default 0
         */
        endRadius: 0,
        /**
         * !#en Variation of the ending radius.
         * !#zh 结束半径变化范围。
         * @property {Number} endRadiusVar
         * @default 0
         */
        endRadiusVar: 0,
        /**
         * !#en Number of degress to rotate a particle around the source pos per second. Only available in 'Radius' mode.
         * !#zh 粒子每秒围绕起始点的旋转角度，只有在半径模式下可用。
         * @property {Number} rotatePerS
         * @default 0
         */
        rotatePerS: 0,
        /**
         * !#en Variation of the degress to rotate a particle around the source pos per second.
         * !#zh 粒子每秒围绕起始点的旋转角度变化范围。
         * @property {Number} rotatePerSVar
         * @default 0
         */
        rotatePerSVar: 0
    };
    var props = Object.keys(DefaultValues);

    for (var i = 0; i < props.length; ++i) {
        var prop = props[i];
        (function (prop, defaultValue) {
            var internalProp = '_' + prop;
            properties[internalProp] = defaultValue;

            var type = defaultValue.constructor;
            var propDef = properties[prop] = {};

            if (cc.isChildClassOf(type, cc.ValueType)) {
                propDef.get = function () {
                    return new type(this[internalProp]);
                };
                propDef.type = type;
            }
            else {
                propDef.get = function () {
                    return this[internalProp];
                };
            }

            if (cc.isChildClassOf(type, cc.ValueType)) {
                propDef.set = function (value) {
                    this[internalProp] = new type(value);
                    this._sgNode[prop] = value;
                };
            }
            else if (CC_EDITOR && typeof defaultValue === "number") {
                propDef.set = function (value) {
                    this[internalProp] = value;
                    if (!isNaN(value)) {
                        this._sgNode[prop] = value;
                    }
                    else {
                        cc.errorID(6001, prop);
                    }
                };
            }
            else {
                propDef.set = function (value) {
                    this[internalProp] = value;
                    this._sgNode[prop] = value;
                };
            }
        })(prop, DefaultValues[prop]);
    }
    return props;
})();

properties.positionType.type = PositionType;
properties.emitterMode.type = EmitterMode;

/**
 * Particle System base class. <br/>
 * Attributes of a Particle System:<br/>
 *  - emmision rate of the particles<br/>
 *  - Gravity Mode (Mode A): <br/>
 *  - gravity <br/>
 *  - direction <br/>
 *  - speed +-  variance <br/>
 *  - tangential acceleration +- variance<br/>
 *  - radial acceleration +- variance<br/>
 *  - Radius Mode (Mode B):      <br/>
 *  - startRadius +- variance    <br/>
 *  - endRadius +- variance      <br/>
 *  - rotate +- variance         <br/>
 *  - Properties common to all modes: <br/>
 *  - life +- life variance      <br/>
 *  - start spin +- variance     <br/>
 *  - end spin +- variance       <br/>
 *  - start size +- variance     <br/>
 *  - end size +- variance       <br/>
 *  - start color +- variance    <br/>
 *  - end color +- variance      <br/>
 *  - life +- variance           <br/>
 *  - blending function          <br/>
 *  - texture                    <br/>
 * <br/>
 * cocos2d also supports particles generated by Particle Designer (http://particledesigner.71squared.com/).<br/>
 * 'Radius Mode' in Particle Designer uses a fixed emit rate of 30 hz. Since that can't be guarateed in cocos2d,  <br/>
 * cocos2d uses a another approach, but the results are almost identical.<br/>
 * cocos2d supports all the variables used by Particle Designer plus a bit more:  <br/>
 *  - spinning particles (supported when using ParticleSystem)       <br/>
 *  - tangential acceleration (Gravity mode)                               <br/>
 *  - radial acceleration (Gravity mode)                                   <br/>
 *  - radius direction (Radius mode) (Particle Designer supports outwards to inwards direction only) <br/>
 * It is possible to customize any of the above mentioned properties in runtime. Example:   <br/>
 *
 * @example
 * emitter.radialAccel = 15;
 * emitter.startSpin = 0;
 *
 * @class ParticleSystem
 * @extends _RendererUnderSG
 */
var ParticleSystem = cc.Class({
    name: 'cc.ParticleSystem',
    extends: cc._RendererUnderSG,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/ParticleSystem',
        inspector: 'packages://inspector/inspectors/comps/particle-system.js',
        playOnFocus: true,
    },

    ctor: function () {
        this._previewTimer = null;
        this._focused = false;
        this._willStart = false;
        this._blendFunc = new cc.BlendFunc(0, 0);
        // prevent repeated rewriting 'onExit'
        this._originOnExit = null;
    },

    properties: properties,

    statics: {

        /**
         * !#en The Particle emitter lives forever.
         * !#zh 表示发射器永久存在
         * @property {Number} DURATION_INFINITY
         * @default -1
         * @static
         * @readonly
         */
        DURATION_INFINITY: -1,

        /**
         * !#en The starting size of the particle is equal to the ending size.
         * !#zh 表示粒子的起始大小等于结束大小。
         * @property {Number} START_SIZE_EQUAL_TO_END_SIZE
         * @default -1
         * @static
         * @readonly
         */
        START_SIZE_EQUAL_TO_END_SIZE: -1,

        /**
         * !#en The starting radius of the particle is equal to the ending radius.
         * !#zh 表示粒子的起始半径等于结束半径。
         * @property {Number} START_RADIUS_EQUAL_TO_END_RADIUS
         * @default -1
         * @static
         * @readonly
         */
        START_RADIUS_EQUAL_TO_END_RADIUS: -1,

        EmitterMode: EmitterMode,
        PositionType: PositionType,
    },

    // LIFE-CYCLE METHODS

    __preload: function () {
        this._super();
        // auto play
        if (!CC_EDITOR || cc.engine.isPlaying) {
            if (this.playOnLoad) {
                this.resetSystem();
            }
            this._applyAutoRemove();
        }
    },

    onDestroy: function () {
        if (this._autoRemoveOnFinish) {
            this.autoRemoveOnFinish = false;    // already removed
        }
        this._super();
    },

    onFocusInEditor: CC_EDITOR && function () {
        this._focused = true;
        if (this.preview) {
            this._sgNode.resetSystem();

            var self = this;
            this._previewTimer = setInterval(function () {
                // attemptToReplay
                if (self.particleCount === 0 && !self._willStart) {
                    self._willStart = true;
                    setTimeout(function () {
                        self._willStart = false;
                        if (self.preview && self._focused && !self.active && !cc.engine.isPlaying) {
                            self.resetSystem();
                        }
                    }, 600);
                }
            }, 100);
        }
    },

    onLostFocusInEditor: CC_EDITOR && function () {
        this._focused = false;
        if (this.preview) {
            this._sgNode.resetSystem();
            this._sgNode.stopSystem();
            this._sgNode.update();
            cc.engine.repaintInEditMode();
        }
        if (this._previewTimer) {
            clearInterval(this._previewTimer);
        }
    },

    // OVERRIDE METHODS

    _createSgNode: function () {
        return new _ccsg.ParticleSystem();
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;

        if (this._file) {
            if (this._custom) {
                var missCustomTexture = !this._texture;
                if (missCustomTexture) {
                    this._applyFile();
                }
                else {
                    this._applyCustoms();
                }
            }
            else {
                this._applyFile();
            }
        }
        else if (this._custom) {
            this._applyCustoms();
        }

        // stop by default
        sgNode.stopSystem();
    },

    // APIS

    /**
     * !#en Add a particle to the emitter.
     * !#zh 添加一个粒子到发射器中。
     * @method addParticle
     * @return {Boolean}
     */
    addParticle: function () {
        return this._sgNode.addParticle();
    },

    /**
     * !#en Stop emitting particles. Running particles will continue to run until they die.
     * !#zh 停止发射器发射粒子，发射出去的粒子将继续运行，直至粒子生命结束。
     * @method stopSystem
     * @example
     * // stop particle system.
     * myParticleSystem.stopSystem();
     */
    stopSystem: function () {
        this._sgNode.stopSystem();
    },

    /**
     * !#en Kill all living particles.
     * !#zh 杀死所有存在的粒子，然后重新启动粒子发射器。
     * @method resetSystem
     * @example
     * // play particle system.
     * myParticleSystem.resetSystem();
     */
    resetSystem: function () {
        this._sgNode.resetSystem();
    },

    /**
     * !#en Whether or not the system is full.
     * !#zh 发射器中粒子是否大于等于设置的总粒子数量。
     * @method isFull
     * @return {Boolean}
     */
    isFull: function () {
        return (this.particleCount >= this._totalParticles);
    },

    /**
     * !#en
     * <p> Sets a new CCSpriteFrame as particle.</br>
     * WARNING: this method is experimental. Use setTextureWithRect instead.
     * </p>
     * !#zh
     * <p> 设置一个新的精灵帧为粒子。</br>
     * 警告：这个函数只是试验，请使用 setTextureWithRect 实现。
     * </p>
     * @method setDisplayFrame
     * @param {SpriteFrame} spriteFrame
     */
    setDisplayFrame: function (spriteFrame) {
        if (!spriteFrame)
            return;

        var texture = spriteFrame.getTexture();
        if (texture) {
            this._texture = texture.url;
        }
        this._sgNode.setDisplayFrame(spriteFrame);
    },

    /**
     * !#en Sets a new texture with a rect. The rect is in texture position and size.
     * !#zh 设置一张新贴图和关联的矩形。
     * @method setTextureWithRect
     * @param {Texture2D} texture
     * @param {Rect} rect
     */
    setTextureWithRect: function (texture, rect) {
        if (texture instanceof cc.Texture2D) {
            this._texture = texture.url;
        }
        this._sgNode.setTextureWithRect(texture, rect);
    },

    // PRIVATE METHODS

    _applyFile: function () {
        var file = this._file;
        if (file) {
            var self = this;
            cc.loader.load(file, function (err, content) {
                if (err || !content) {
                    throw err || new Error('Unkown error');
                }
                if (!self.isValid) {
                    return;
                }

                var sgNode = self._sgNode;
                sgNode.particleCount = 0;

                var active = sgNode.isActive();

                if (CC_EDITOR) {
                    sgNode._plistFile = file;
                    sgNode.initWithDictionary(content, '');
                }
                else {
                    sgNode.initWithFile(file);
                }

                // To avoid it export custom particle data textureImageData too large,
                // so use the texutreUuid instead of textureImageData
                if (content.textureUuid) {
                    cc.AssetLibrary.queryAssetInfo(content.textureUuid, function (err, url, raw) {
                        if (err) {
                            cc.error(err);
                            return;
                        }
                        self.texture = url;
                    });
                }

                // For custom data export
                if (content.emissionRate) {
                    self.emissionRate = content.emissionRate;
                }

                // recover sgNode properties

                sgNode.setPosition(0, 0);

                if (!active) {
                    sgNode.stopSystem();
                }

                if (!CC_EDITOR || cc.engine.isPlaying) {
                    self._applyAutoRemove();
                }

                // if become custom after loading
                if (self._custom) {
                    self._applyCustoms();
                }
            });
        }
    },

    _applyCustoms: function () {
        var sgNode = this._sgNode;
        var active = sgNode.isActive();

        for (var i = 0; i < CustomProps.length; i++) {
            var prop = CustomProps[i];
            sgNode[prop] = this['_' + prop];
        }
        this._blendFunc.src = this._srcBlendFactor;
        this._blendFunc.dst = this._dstBlendFactor;
        sgNode.setBlendFunc(this._blendFunc);

        if (this._texture) {
            sgNode.texture = cc.textureCache.addImage(this._texture);
        }

        // recover sgNode properties
        if (!active) {
            sgNode.stopSystem();
        }

        if (!CC_EDITOR || cc.engine.isPlaying) {
            this._applyAutoRemove();
        }
    },

    _applyAutoRemove: function () {
        var sgNode = this._sgNode;
        var autoRemove = this._autoRemoveOnFinish;
        sgNode.autoRemoveOnFinish = autoRemove;
        if (autoRemove) {
            if (this._originOnExit) {
                return;
            }
            this._originOnExit = sgNode.onExit;
            var self = this;
            sgNode.onExit = function () {
                self._originOnExit.call(this);
                self.node.destroy();
            };
        }
        else if (this._originOnExit) {
            sgNode.onExit = this._originOnExit;
            this._originOnExit = null;
        }
    }
});

cc.ParticleSystem = module.exports = ParticleSystem;
