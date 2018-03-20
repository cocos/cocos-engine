/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const macro = require('../core/platform/CCMacro');
const ParticleAsset = require('./CCParticleAsset');
const RenderComponent = require('../core/components/CCRenderComponent');
const codec = require('../compression/ZipUtils');
const PNGReader = require('./CCPNGReader');
const tiffReader = require('./CCTIFFReader');
const textureUtil = require('../core/utils/texture-util');
const renderEngine = require('../core/renderer/render-engine');
const gfx = renderEngine.gfx;
const ParticleMaterial = renderEngine.ParticleMaterial;
const Particles = renderEngine.Particles;

var BlendFactor = macro.BlendFactor;

function getImageFormatByData (imgData) {
    // if it is a png file buffer.
    if (imgData.length > 8 && imgData[0] === 0x89
        && imgData[1] === 0x50
        && imgData[2] === 0x4E
        && imgData[3] === 0x47
        && imgData[4] === 0x0D
        && imgData[5] === 0x0A
        && imgData[6] === 0x1A
        && imgData[7] === 0x0A) {
        return macro.ImageFormat.PNG;
    }

    // if it is a tiff file buffer.
    if (imgData.length > 2 && ((imgData[0] === 0x49 && imgData[1] === 0x49)
        || (imgData[0] === 0x4d && imgData[1] === 0x4d)
        || (imgData[0] === 0xff && imgData[1] === 0xd8))) {
        return macro.ImageFormat.TIFF;
    }
    return macro.ImageFormat.UNKNOWN;
}

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
            this.resetSystem();
            if ( !this.preview ) {
                this.stopSystem();
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
                if (!value) {
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
        url: ParticleAsset
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
        url: ParticleAsset,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.file'
    },

    /**
     * !#en SpriteFrame used for particles display
     * !#zh 用于粒子呈现的 SpriteFrame
     * @property spriteFrame
     * @type {SpriteFrame}
     */
    _spriteFrame: {
        default: null,
        type: cc.SpriteFrame
    },
    spriteFrame: {
        get: function () {
            return this._spriteFrame;
        },
        set: function (value, force) {
            var lastSprite = this._spriteFrame;
            if (CC_EDITOR) {
                if (!force && lastSprite === value) {
                    return;
                }
            }
            else {
                if (lastSprite === value) {
                    return;
                }
            }
            this._spriteFrame = value;
            if ((lastSprite && lastSprite.getTexture()) !== (value && value.getTexture())) {
                this._texture = null;
                this._applySpriteFrame(lastSprite);
            }
            if (CC_EDITOR) {
                this.node.emit('spriteframe-changed', this);
            }
        },
        type: cc.SpriteFrame,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.spriteFrame'
    },

    /**
     * !#en Texture of Particle System, readonly, please use spriteFrame to setup new texture。
     * !#zh 粒子贴图，只读属性，请使用 spriteFrame 属性来替换贴图。
     * @property texture
     * @type {String}
     * @readonly
     */
    texture: {
        get: function () {
            return this._texture ? this._texture.url : "";
        },
        set: function (value) {
            cc.warnID(6017);
        },
        type: cc.Texture2D,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.texture',
        readonly: true,
        visible: false,
        animatable: false
    },

    /**
     * !#en Current quantity of particles that are being simulated, 
     * this function can be very slow currently, please don't use it frequently.
     * !#zh 当前播放的粒子数量。
     * 当前版本该函数性能不够好，请不要频繁调用（比如每帧检查）。
     * @property {Number} particleCount
     * @readonly
     */
    particleCount: {
        visible: false,
        get: function () {
            return this._vfx.particleCount;
        },
        readonly: true
    },

    /**
     * !#en Specify the source Blend Factor.
     * !#zh 指定原图混合模式。
     * @property srcBlendFactor
     * @type {macro.BlendFactor}
     */
    _srcBlendFactor : BlendFactor.SRC_ALPHA,
    srcBlendFactor: {
        get: function() {
            return this._srcBlendFactor;
        },
        set: function(value) {
            this._srcBlendFactor = value;
            this._updateBlendFunc();
        },
        animatable: false,
        type:BlendFactor,
        tooltip: CC_DEV && 'i18n:COMPONENT.particle_system.srcBlendFactor'
    },

    /**
     * !#en Specify the destination Blend Factor.
     * !#zh 指定目标的混合模式。
     * @property dstBlendFactor
     * @type {macro.BlendFactor}
     */
    _dstBlendFactor : BlendFactor.ONE_MINUS_SRC_ALPHA,
    dstBlendFactor: {
        get: function() {
            return this._dstBlendFactor;
        },
        set: function(value) {
            this._dstBlendFactor = value;
            this._updateBlendFunc();
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
            // TODO: check wether it's activated (not stopped)
            return this.enabledInHierarchy;
        },
        visible: false
    },

    /**
     * !#en Maximum particles of the system.
     * !#zh 粒子最大数量。
     * @property {Number} totalParticles
     * @default 150
     */
    _totalParticles: 150,
    totalParticles: {
        get () {
            return this._totalParticles;
        },
        set (val) {
            this._totalParticles = val;
            this._maxParticleDirty = true;
        }
    },
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
    _emissionRate: 10,
    emissionRate: {
        get () {
            return this._emissionRate;
        },
        set (val) {
            this._emissionRate = val;
            this._maxParticleDirty = true;
        }
    },
    /**
     * !#en Life of each particle setter.
     * !#zh 粒子的运行时间。
     * @property {Number} life
     * @default 1
     */
    _life: 1,
    life: {
        get () {
            return this._life;
        },
        set (val) {
            this._life = val;
            this._maxParticleDirty = true;
        }
    },
    /**
     * !#en Variation of life.
     * !#zh 粒子的运行时间变化范围。
     * @property {Number} lifeVar
     * @default 0
     */
    _lifeVar: 0,
    lifeVar: {
        get () {
            return this._lifeVar;
        },
        set (val) {
            this._lifeVar = val;
            this._maxParticleDirty = true;
        }
    },

    /**
     * !#en Start color of each particle.
     * !#zh 粒子初始颜色。
     * @property {Color} startColor
     * @default cc.Color.WHITE
     */
    _startColor: cc.Color.WHITE,
    startColor: {
        get () {
            return this._startColor;
        },
        set (val) {
            this._startColor.fromColor(val);
            this._vfx.startColor = val;
        }
    },
    /**
     * !#en Variation of the start color.
     * !#zh 粒子初始颜色变化范围。
     * @property {Color} startColorVar
     * @default cc.Color.BLACK
     */
    _startColorVar: cc.Color.BLACK,
    startColorVar: {
        get () {
            return this._startColorVar;
        },
        set (val) {
            this._startColorVar.fromColor(val);
            this._vfx.startColorVar = val;
        }
    },
    /**
     * !#en Ending color of each particle.
     * !#zh 粒子结束颜色。
     * @property {Color} endColor
     * @default new cc.Color(255, 255, 255, 0)
     */
    _endColor: cc.color(255, 255, 255, 0),
    endColor: {
        get () {
            return this._endColor;
        },
        set (val) {
            this._endColor.fromColor(val);
            this._vfx.endColor = val;
        }
    },
    /**
     * !#en Variation of the end color.
     * !#zh 粒子结束颜色变化范围。
     * @property {Color} endColorVar -
     * @default Color.TRANSPARENT
     */
    _endColorVar: cc.color(0, 0, 0, 0),
    endColorVar: {
        get () {
            return this._endColorVar;
        },
        set (val) {
            this._endColorVar.fromColor(val);
            this._vfx.endColorVar = val;
        }
    },

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
    _startSize: 50,
    startSize: {
        get () {
            return this._startSize;
        },
        set (val) {
            this._startSize = val;
            this._sizeScaleDirty = true;
        }
    },
    /**
     * !#en Variation of start size in pixels.
     * !#zh 粒子初始大小的变化范围。
     * @property {Number} startSizeVar
     * @default 0
     */
    _startSizeVar: 0,
    startSizeVar: {
        get () {
            return this._startSizeVar;
        },
        set (val) {
            this._startSizeVar = val;
            this._sizeScaleDirty = true;
        }
    },
    /**
     * !#en End size in pixels of each particle.
     * !#zh 粒子结束时的大小。
     * @property {Number} endSize
     * @default 0
     */
    _endSize: 0,
    endSize: {
        get () {
            return this._endSize;
        },
        set (val) {
            this._endSize = val;
            this._sizeScaleDirty = true;
        }
    },
    /**
     * !#en Variation of end size in pixels.
     * !#zh 粒子结束大小的变化范围。
     * @property {Number} endSizeVar
     * @default 0
     */
    _endSizeVar: 0,
    endSizeVar: {
        get () {
            return this._endSizeVar;
        },
        set (val) {
            this._endSizeVar = val;
            this._sizeScaleDirty = true;
        }
    },
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
    sourcePos: cc.v2(0, 0),

    /**
     * !#en Variation of source position.
     * !#zh 发射器位置的变化范围。（横向和纵向）
     * @property {Vec2} posVar
     * @default cc.Vec2.ZERO
     */
    posVar: cc.v2(0, 0),

    /**
     * !#en Particles movement type.
     * !#zh 粒子位置类型。
     * @property {ParticleSystem.PositionType} positionType
     * @default ParticleSystem.PositionType.FREE
     */
    positionType: {
        default: PositionType.FREE,
        type: PositionType
    },

    /**
     * !#en Particles emitter modes.
     * !#zh 发射器类型。
     * @property {ParticleSystem.EmitterMode} emitterMode
     * @default ParticleSystem.EmitterMode.GRAVITY
     */
    emitterMode: {
        default: EmitterMode.GRAVITY,
        type: EmitterMode
    },

    // GRAVITY MODE

    /**
     * !#en Gravity of the emitter.
     * !#zh 重力。
     * @property {Vec2} gravity
     * @default cc.Vec2.ZERO
     */
    gravity: cc.v2(0, 0),
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
    _tangentialAccel: 80,
    tangentialAccel: {
        get () {
            return this._tangentialAccel;
        },
        set (val) {
            this._tangentialAccel = val;
            this._accelScaleDirty = true;
        }
    },
    /**
     * !#en Variation of the tangential acceleration.
     * !#zh 每个粒子的切向加速度变化范围。
     * @property {Number} tangentialAccelVar
     * @default 0
     */
    _tangentialAccelVar: 0,
    tangentialAccelVar: {
        get () {
            return this._tangentialAccelVar;
        },
        set (val) {
            this._tangentialAccelVar = val;
            this._accelScaleDirty = true;
        }
    },
    /**
     * !#en Acceleration of each particle. Only available in 'Gravity' mode.
     * !#zh 粒子径向加速度，即平行于重力方向的加速度，只有在重力模式下可用。
     * @property {Number} radialAccel
     * @default 0
     */
    _radialAccel: 0,
    radialAccel: {
        get () {
            return this._radialAccel;
        },
        set (val) {
            this._radialAccel = val;
            this._accelScaleDirty = true;
        }
    },
    /**
     * !#en Variation of the radial acceleration.
     * !#zh 粒子径向加速度变化范围。
     * @property {Number} radialAccelVar
     * @default 0
     */
    _radialAccelVar: 0,
    radialAccelVar: {
        get () {
            return this._radialAccelVar;
        },
        set (val) {
            this._radialAccelVar = val;
            this._accelScaleDirty = true;
        }
    },

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
    _startRadius: 0,
    startRadius: {
        get () {
            return this._startRadius;
        },
        set (val) {
            this._startRadius = val;
            this._radiusScaleDirty = true;
        }
    },
    /**
     * !#en Variation of the starting radius.
     * !#zh 初始半径变化范围。
     * @property {Number} startRadiusVar
     * @default 0
     */
    _startRadiusVar: 0,
    startRadiusVar: {
        get () {
            return this._startRadiusVar;
        },
        set (val) {
            this._startRadiusVar = val;
            this._radiusScaleDirty = true;
        }
    },
    /**
     * !#en Ending radius of the particles. Only available in 'Radius' mode.
     * !#zh 结束半径，只有在半径模式下可用。
     * @property {Number} endRadius
     * @default 0
     */
    _endRadius: 0,
    endRadius: {
        get () {
            return this._endRadius;
        },
        set (val) {
            this._endRadius = val;
            this._radiusScaleDirty = true;
        }
    },
    /**
     * !#en Variation of the ending radius.
     * !#zh 结束半径变化范围。
     * @property {Number} endRadiusVar
     * @default 0
     */
    _endRadiusVar: 0,
    endRadiusVar: {
        get () {
            return this._endRadiusVar;
        },
        set (val) {
            this._endRadiusVar = val;
            this._radiusScaleDirty = true;
        }
    },
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
 * @extends Component
 */
var ParticleSystem = cc.Class({
    name: 'cc.ParticleSystem',
    extends: RenderComponent,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/ParticleSystem',
        inspector: 'packages://inspector/inspectors/comps/particle-system.js',
        playOnFocus: true,
        executeInEditMode: true
    },

    ctor: function () {
        this._previewTimer = null;
        this._focused = false;
        this._willStart = false;
        this._texture = null;

        // Material update caches
        this._uv = {
            l: 0.0,
            b: 0.0,
            r: 0.0,
            t: 0.0
        };
        this._statesize = {
            x: 0.0,
            y: 0.0
        };
        this._quadsize = {
            x: 0.0,
            y: 0.0
        };
        
        // vfx handle real particle step process based on GPU shaders
        this._vfx = new Particles(cc.renderer.device, cc.renderer._forward, this);
        this._vertexFormat = this._vfx.vertexFormat;

        // Config update flags, vfx constructor has updated with the current config, so not dirty
        this._maxParticleDirty = false;
        this._sizeScaleDirty = false;
        this._radiusScaleDirty = false;
        this._accelScaleDirty = false;
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
        if (this._file) { 
            if (this._custom) { 
                var missCustomTexture = !this._texture; 
                if (missCustomTexture) { 
                    this._applyFile();
                } 
                this._applyCustoms(); 
            } 
            else { 
                this._applyFile(); 
            } 
        } 
        else if (this._custom) { 
            this._applyCustoms(); 
        } 
        // auto play
        if (!CC_EDITOR || cc.engine.isPlaying) {
            if (this.playOnLoad) {
                this.resetSystem();
            }
        }
    },

    onEnable: function () {
        this._super();
        this._updateMaterial();
    },

    onDestroy: function () {
        // TODO: do we need to release memory created by vfx
        this._vfx = null;
        if (this._autoRemoveOnFinish) {
            this.autoRemoveOnFinish = false;    // already removed
        }
        this._super();
    },

    onFocusInEditor: CC_EDITOR && function () {
        this._focused = true;
        if (this.preview) {
            this.resetSystem();

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
            this.resetSystem();
            this.stopSystem();
            cc.engine.repaintInEditMode();
        }
        if (this._previewTimer) {
            clearInterval(this._previewTimer);
        }
    },

    // APIS

    /*
     * !#en Add a particle to the emitter.
     * !#zh 添加一个粒子到发射器中。
     * @method addParticle
     * @return {Boolean}
     */
    addParticle: function () {
        // Not implemented
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
        this._vfx.stopSystem();
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
        this._vfx.resetSystem();
    },

    /**
     * !#en Whether or not the system is full.
     * !#zh 发射器中粒子是否大于等于设置的总粒子数量。
     * @method isFull
     * @return {Boolean}
     */
    isFull: function () {
        return (this.particleCount >= this.totalParticles);
    },

    /**
     * !#en Sets a new texture with a rect. The rect is in texture position and size.
     * Please use spriteFrame property instead, this function is deprecated since v1.9
     * !#zh 设置一张新贴图和关联的矩形。
     * 请直接设置 spriteFrame 属性，这个函数从 v1.9 版本开始已经被废弃
     * @method setTextureWithRect
     * @param {Texture2D} texture
     * @param {Rect} rect
     * @deprecated
     */
    setTextureWithRect: function (texture, rect) {
        if (texture instanceof cc.Texture2D) {
            this.spriteFrame = new cc.SpriteFrame(texture, rect);
        }
    },

    // PRIVATE METHODS

    _applyFile: function () {
        var file = this._file;
        if (file) {
            var self = this;
            cc.loader.load(file, function (err, content) {
                if (err || !content) {
                    throw err || new Error(cc._getError(6029));
                }
                if (!self.isValid) {
                    return;
                }

                self._plistFile = file;
                if (self._custom) {
                    self._initTextureWithDictionary(content);
                }
                else {
                    self._initWithDictionary(content);
                }
            });
        }
    },

    _applyCustoms: function () {
        // trigger vfx config update after deserialize
        this._maxParticleDirty = true;
        this._sizeScaleDirty = true;
        this._radiusScaleDirty = true;
        this._accelScaleDirty = true;
        let vfx = this._vfx;
        vfx.startColor = this.startColor;
        vfx.startColorVar = this.startColorVar;
        vfx.endColor = this.endColor;
        vfx.endColorVar = this.endColorVar;
    },

    _initTextureWithDictionary: function (dict) {
        var imgPath = cc.path.changeBasename(this._plistFile, dict["textureFileName"]);
        // texture
        if (dict["textureFileName"]) {
            // Try to get the texture from the cache
            var tex = textureUtil.loadImage(imgPath);
            // TODO: Use cc.loader to load asynchronously the SpriteFrame object, avoid using textureUtil
            this.spriteFrame = new cc.SpriteFrame(tex);
        } else if (dict["textureImageData"]) {
            var textureData = dict["textureImageData"];

            if (textureData && textureData.length > 0) {
                var buffer = codec.unzipBase64AsArray(textureData, 1);
                if (!buffer) {
                    cc.logID(6010);
                    return false;
                }

                var imageFormat = getImageFormatByData(buffer);
                if (imageFormat !== macro.ImageFormat.TIFF && imageFormat !== macro.ImageFormat.PNG) {
                    cc.logID(6011);
                    return false;
                }

                var canvasObj = document.createElement("canvas");
                if(imageFormat === macro.ImageFormat.PNG){
                    var myPngObj = new PNGReader(buffer);
                    myPngObj.render(canvasObj);
                } else {
                    tiffReader.parseTIFF(buffer,canvasObj);
                }

                var tex = textureUtil.cacheImage(imgPath, canvasObj);
                if (!tex)
                    cc.logID(6012);
                // TODO: Use cc.loader to load asynchronously the SpriteFrame object, avoid using textureUtil
                this.spriteFrame = new cc.SpriteFrame(tex);
            }
            else {
                return false;
            }
        }
        return true;
    },

    // parsing process
    _initWithDictionary: function (dict) {
        this.totalParticles = parseInt(dict["maxParticles"] || 0);

        // life span
        this.life = parseFloat(dict["particleLifespan"] || 0);
        this.lifeVar = parseFloat(dict["particleLifespanVariance"] || 0);

        // emission Rate
        this.emissionRate = this.totalParticles / this.life;

        // duration
        this.duration = parseFloat(dict["duration"] || 0);

        // blend function
        this.srcBlendFactor = parseInt(dict["blendFuncSource"] || macro.SRC_ALPHA);
        this.dstBlendFactor = parseInt(dict["blendFuncDestination"] || macro.ONE_MINUS_SRC_ALPHA);

        // color
        var locStartColor = this.startColor;
        locStartColor.r = parseFloat(dict["startColorRed"] || 1) * 255;
        locStartColor.g = parseFloat(dict["startColorGreen"] || 1) * 255;
        locStartColor.b = parseFloat(dict["startColorBlue"] || 1) * 255;
        locStartColor.a = parseFloat(dict["startColorAlpha"] || 1) * 255;

        var locStartColorVar = this.startColorVar;
        locStartColorVar.r = parseFloat(dict["startColorVarianceRed"] || 1) * 255;
        locStartColorVar.g = parseFloat(dict["startColorVarianceGreen"] || 1) * 255;
        locStartColorVar.b = parseFloat(dict["startColorVarianceBlue"] || 1) * 255;
        locStartColorVar.a = parseFloat(dict["startColorVarianceAlpha"] || 1) * 255;

        var locEndColor = this.endColor;
        locEndColor.r = parseFloat(dict["finishColorRed"] || 1) * 255;
        locEndColor.g = parseFloat(dict["finishColorGreen"] || 1) * 255;
        locEndColor.b = parseFloat(dict["finishColorBlue"] || 1) * 255;
        locEndColor.a = parseFloat(dict["finishColorAlpha"] || 1) * 255;

        var locEndColorVar = this.endColorVar;
        locEndColorVar.r = parseFloat(dict["finishColorVarianceRed"] || 1) * 255;
        locEndColorVar.g = parseFloat(dict["finishColorVarianceGreen"] || 1) * 255;
        locEndColorVar.b = parseFloat(dict["finishColorVarianceBlue"] || 1) * 255;
        locEndColorVar.a = parseFloat(dict["finishColorVarianceAlpha"] || 1) * 255;

        // particle size
        this.startSize = parseFloat(dict["startParticleSize"] || 0);
        this.startSizeVar = parseFloat(dict["startParticleSizeVariance"] || 0);
        this.endSize = parseFloat(dict["finishParticleSize"] || 0);
        this.endSizeVar = parseFloat(dict["finishParticleSizeVariance"] || 0);

        // position
        this.sourcePos.x = parseFloat(dict["sourcePositionx"] || 0);
        this.sourcePos.y = parseFloat(dict["sourcePositiony"] || 0);
        this.posVar.x = parseFloat(dict["sourcePositionVariancex"] || 0);
        this.posVar.y = parseFloat(dict["sourcePositionVariancey"] || 0);
        
        // angle
        this.angle = parseFloat(dict["angle"] || 0);
        this.angleVar = parseFloat(dict["angleVariance"] || 0);

        // Spinning
        this.startSpin = parseFloat(dict["rotationStart"] || 0);
        this.startSpinVar = parseFloat(dict["rotationStartVariance"] || 0);
        this.endSpin = parseFloat(dict["rotationEnd"] || 0);
        this.endSpinVar = parseFloat(dict["rotationEndVariance"] || 0);

        this.emitterMode = parseInt(dict["emitterType"] || EmitterMode.GRAVITY);

        // Mode A: Gravity + tangential accel + radial accel
        if (this.emitterMode === EmitterMode.GRAVITY) {
            // gravity
            this.gravity.x = parseFloat(dict["gravityx"] || 0);
            this.gravity.y = parseFloat(dict["gravityy"] || 0);

            // speed
            this.speed = parseFloat(dict["speed"] || 0);
            this.speedVar = parseFloat(dict["speedVariance"] || 0);

            // radial acceleration
            this.radialAccel = parseFloat(dict["radialAcceleration"] || 0);
            this.radialAccelVar = parseFloat(dict["radialAccelVariance"] || 0);

            // tangential acceleration
            this.tangentialAccel = parseFloat(dict["tangentialAcceleration"] || 0);
            this.tangentialAccelVar = parseFloat(dict["tangentialAccelVariance"] || 0);

            // rotation is dir
            var locRotationIsDir = dict["rotationIsDir"] || "";
            if (locRotationIsDir !== null) {
                locRotationIsDir = locRotationIsDir.toString().toLowerCase();
                this._rotationIsDir = (locRotationIsDir === "true" || locRotationIsDir === "1");
            }
            else {
                this._rotationIsDir = false;
            }
        } else if (this._emitterMode === _ccsg.ParticleSystem.Mode.RADIUS) {
            // or Mode B: radius movement
            this.startRadius = parseFloat(dict["maxRadius"] || 0);
            this.startRadiusVar = parseFloat(dict["maxRadiusVariance"] || 0);
            this.endRadius = parseFloat(dict["minRadius"] || 0);
            this.endRadiusVar = 0;
            this.rotatePerS = parseFloat(dict["rotatePerSecond"] || 0);
            this.rotatePerSVar = parseFloat(dict["rotatePerSecondVariance"] || 0);
        } else {
            cc.warnID(6009);
            return false;
        }

        this._initTextureWithDictionary(dict);
        return true;
    },

    _onTextureLoaded: function (event) {
        this._texture = this._spriteFrame.getTexture();
        // Mark render data dirty
        if (this._renderData) {
            this._renderData.uvDirty = true;
        }
        // Reactivate material
        if (this.enabledInHierarchy) {
            this._updateMaterial();
        }
    },

    _applySpriteFrame: function (oldFrame) {
        if (oldFrame && oldFrame.off) {
            oldFrame.off('load', this._onTextureLoaded, this);
        }

        var spriteFrame = this._spriteFrame;
        if (spriteFrame) {
            if (spriteFrame.textureLoaded()) {
                this._onTextureLoaded(null);
            }
            else {
                spriteFrame.once('load', this._onTextureLoaded, this);
                spriteFrame.ensureLoadTexture();
            }
        }
    },

    _updateMaterialSize: function () {
        if (this._material) {
            let vfx = this._vfx;
            this._statesize.x = vfx.statesize[0];
            this._statesize.y = vfx.statesize[1];
            this._quadsize.x = vfx.quadsize[0];
            this._quadsize.y = vfx.quadsize[1];
            this._material.stateSize = this._statesize;
            this._material.quadSize = this._quadsize;
        }
    },

    _updateMaterial: function () {
        // cannot be activated if texture not loaded yet
        if (!this._texture || !this._texture.loaded) {
            return;
        }

        // Get material
        if (!this._material) {
            this._material = new ParticleMaterial();
        }

        let vfx = this._vfx;
        this._material.texture = this._texture;
        this._material.stateMap = this._vfx.textures.state0;
        this._material.quadMap = this._vfx.textures.quads;
        this._material.z = this.node.z;
        this._updateMaterialSize();

        this._updateBlendFunc();
    },
    
    _updateBlendFunc: function () {
        if (!this._material) {
            return;
        }

        var pass = this._material._mainTech.passes[0];
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            this._srcBlendFactor, this._dstBlendFactor,
            gfx.BLEND_FUNC_ADD,
            this._srcBlendFactor, this._dstBlendFactor
        );
    },

    _finishedSimulation: function () {
        if (this._autoRemoveOnFinish && this._vfx.stopped) {
            this.node.destroy();
        }
    }
});

cc.ParticleSystem = module.exports = ParticleSystem;
