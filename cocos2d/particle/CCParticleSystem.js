/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Enum for emitter modes
 * @enum EmitterMode
 * @namespace ParticleSystem
 */
var EmitterMode = cc.Enum({
    /**
     * @property {Number} GRAVITY - Uses gravity, speed, radial and tangential acceleration.
     */
    GRAVITY: 0,
    /**
     * @property {Number} RADIUS - Uses radius movement + rotation.
     */
    RADIUS: 1
});

/**
 * Enum for particles movement type
 * @enum PositionType
 * @namespace ParticleSystem
 */
var PositionType = cc.Enum({
    /**
     * Living particles are attached to the world and are unaffected by emitter repositioning.
     * @property {Number} FREE
     */
    FREE: 0,

    /**
     * Living particles are attached to the world but will follow the emitter repositioning.<br/>
     * Use case: Attach an emitter to an sprite, and you want that the emitter follows the sprite.
     * @property {Number} RELATIVE
     */
    RELATIVE: 1,

    /**
     * Living particles are attached to the emitter and are translated along with it.
     * @property {Number} GROUPED
     */
    GROUPED: 2
});

/**
 * @class ParticleSystem
 */

var properties = {

    /**
     * Play particle in edit mode.
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
        animatable: false
    },

    /**
     * If set custom to true, then use custom properties insteadof read particle file.
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
                return cc.warn('Custom should not be false if file is not specified.');
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
        animatable: false
    },

    /**
     * The plist file.
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
                    cc.engine.repaintInEditMode();
                    //if (CC_EDITOR) {
                    //    self.preview = self.preview;
                    //}
                }
                else {
                    this.custom = true;
                }
            }
        },
        animatable: false,
        url: cc.ParticleAsset
    },

    /**
     * @property {Texture2D} texture - Texture of Particle System.
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
        },
        url: cc.Texture2D
    },

    /**
     * @property {Number} particleCount - Current quantity of particles that are being simulated.
     */
    particleCount: {
        get: function () {
            return this._sgNode.particleCount;
        },
        set: function (value) {
            this._sgNode.particleCount = value;
        },
        visible: false
    },

    /**
     * !#en If set to true, the particle system will automatically start playing on onLoad.
     * !#zh 如果设置为true 运行时会自动发射粒子
     * @property playOnLoad
     * @type {boolean}
     * @default true
     */
    playOnLoad: true,

    /**
     * @property {Boolean} autoRemoveOnFinish - Indicate whether the owner node will be auto-removed when it has no particles left.
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
        animatable: false
    },

    /**
     * Indicate whether the particle system is activated.
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
         * @property {Number} totalParticles - Maximum particles of the system.
         * @default 150
         */
        totalParticles: 150,
        /**
         * @property {Number} duration - How many seconds the emitter wil run. -1 means 'forever'
         * @default ParticleSystem.DURATION_INFINITY
         */
        duration: -1,
        /**
         * @property {Number} emissionRate - Emission rate of the particles.
         * @default 10
         */
        emissionRate: 10,
        /**
         * @property {Number} life - Life of each particle setter.
         * @default 1
         */
        life: 1,
        /**
         * @property {Number} lifeVar - Variation of life.
         * @default 0
         */
        lifeVar: 0,

        /**
         * @property {Color} startColor - Start color of each particle.
         * @default cc.Color.WHITE
         */
        startColor: cc.Color.WHITE,
        /**
         * @property {Color} startColorVar - Variation of the start color.
         * @default cc.Color.BLACK
         */
        startColorVar: cc.Color.BLACK,
        /**
         * @property {Color} endColor - Ending color of each particle.
         * @default new cc.Color(255, 255, 255, 0)
         */
        endColor: cc.color(255, 255, 255, 0),
        /**
         * @property {Color} endColorVar - Variation of the end color.
         * @default Color.TRANSPARENT
         */
        endColorVar: cc.color(0, 0, 0, 0),

        /**
         * @property {Number} angle - Angle of each particle setter.
         * @default 90
         */
        angle: 90,
        /**
         * @property {Number} angleVar - Variation of angle of each particle setter.
         * @default 20
         */
        angleVar: 20,
        /**
         * @property {Number} startSize - Start size in pixels of each particle.
         * @default 50
         */
        startSize: 50,
        /**
         * @property {Number} startSizeVar - Variation of start size in pixels.
         * @default 0
         */
        startSizeVar: 0,
        /**
         * @property {Number} endSize - End size in pixels of each particle.
         * @default 0
         */
        endSize: 0,
        /**
         * @property {Number} endSizeVar - Variation of end size in pixels.
         * @default 0
         */
        endSizeVar: 0,
        /**
         * @property {Number} startSpin - Start angle of each particle.
         * @default 0
         */
        startSpin: 0,
        /**
         * @property {Number} startSpinVar - Variation of start angle.
         * @default 0
         */
        startSpinVar: 0,
        /**
         * @property {Number} endSpin - End angle of each particle.
         * @default 0
         */
        endSpin: 0,
        /**
         * @property {Number} endSpinVar - Variation of end angle.
         * @default 0
         */
        endSpinVar: 0,

        /**
         * @property {Vec2} sourcePos - Source position of the emitter.
         * @default cc.Vec2.ZERO
         */
        sourcePos: cc.p(0, 0),

        /**
         * @property {Vec2} posVar - Variation of source position.
         * @default cc.Vec2.ZERO
         */
        posVar: cc.p(0, 0),

        /**
         * Particles movement type.
         * @property {ParticleSystem.PositionType} positionType
         * @default ParticleSystem.PositionType.FREE
         */
        positionType: PositionType.FREE,
        /**
         * Particles emitter modes.
         * @property {ParticleSystem.EmitterMode} emitterMode
         * @default ParticleSystem.EmitterMode.GRAVITY
         */
        emitterMode: EmitterMode.GRAVITY,

        // GRAVITY MODE

        /**
         * @property {Vec2} gravity - Gravity of the emitter.
         * @default cc.Vec2.ZERO
         */
        gravity: cc.p(0, 0),
        /**
         * @property {Number} speed - Speed of the emitter.
         * @default 180
         */
        speed: 180,
        /**
         * @property {Number} speedVar - Variation of the speed.
         * @default 50
         */
        speedVar: 50,
        /**
         * @property {Number} tangentialAccel - Tangential acceleration of each particle. Only available in 'Gravity' mode.
         * @default 80
         */
        tangentialAccel: 80,
        /**
         * @property {Number} tangentialAccelVar - Variation of the tangential acceleration.
         * @default 0
         */
        tangentialAccelVar: 0,
        /**
         * @property {Number} radialAccel - Radial acceleration of each particle. Only available in 'Gravity' mode.
         * @default 0
         */
        radialAccel: 0,
        /**
         * @property {Number} radialAccelVar - Variation of the radial acceleration.
         * @default 0
         */
        radialAccelVar: 0,

        /**
         * @property {Boolean} rotationIsDir - Indicate whether the rotation of each particle equals to its direction. Only available in 'Gravity' mode.
         * @default false
         */
        rotationIsDir: false,

        // RADIUS MODE

        /**
         * @property {Number} startRadius - Starting radius of the particles. Only available in 'Radius' mode.
         * @default 0
         */
        startRadius: 0,
        /**
         * @property {Number} startRadiusVar - Variation of the starting radius.
         * @default 0
         */
        startRadiusVar: 0,
        /**
         * @property {Number} endRadius - Ending radius of the particles. Only available in 'Radius' mode.
         * @default 0
         */
        endRadius: 0,
        /**
         * @property {Number} endRadiusVar - Variation of the ending radius.
         * @default 0
         */
        endRadiusVar: 0,
        /**
         * @property {Number} rotatePerS - Number of degress to rotate a particle around the source pos per second. Only available in 'Radius' mode.
         * @default 0
         */
        rotatePerS: 0,
        /**
         * @property {Number} rotatePerSVar - Variation of the degress to rotate a particle around the source pos per second.
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
                        cc.error('The new %s must not be NaN', prop);
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
 * @extends cc._ComponentInSG
 */
var ParticleSystem = cc.Class({
    name: 'cc.ParticleSystem',
    extends: cc._ComponentInSG,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/ParticleSystem',
        inspector: 'app://editor/page/inspector/particle-system/index.html',
        playOnFocus: true,
    },

    ctor: function () {
        this._previewTimer = null;
        this._focused = false;
        this._willStart = false;
    },

    properties: properties,

    statics: {

        /**
         * The Particle emitter lives forever
         * @property {Number} DURATION_INFINITY
         * @default -1
         * @static
         * @readonly
         */
        DURATION_INFINITY: -1,

        /**
         * The starting size of the particle is equal to the ending size
         * @property {Number} START_SIZE_EQUAL_TO_END_SIZE
         * @default -1
         * @static
         * @readonly
         */
        START_SIZE_EQUAL_TO_END_SIZE: -1,

        /**
         * The starting radius of the particle is equal to the ending radius
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

    onLoad: function () {
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

        var loadCustomAfterFile = false;
        if (this._file) {
            var missCustomTexture = this._custom && !this._texture;
            loadCustomAfterFile = missCustomTexture;
            this._applyFile(loadCustomAfterFile && this._applyCustoms.bind(this));
        }
        if (this._custom && !loadCustomAfterFile) {
            this._applyCustoms();
        }

        // stop by default
        sgNode.stopSystem();
    },

    // APIS

    /**
     * Add a particle to the emitter
     * @method addParticle
     * @return {Boolean}
     */
    addParticle: function () {
        return this._sgNode.addParticle();
    },

    /**
     * stop emitting particles. Running particles will continue to run until they die
     * @method stopSystem
     */
    stopSystem: function () {
        this._sgNode.stopSystem();
    },

    /**
     * Kill all living particles.
     * @method resetSystem
     */
    resetSystem: function () {
        this._sgNode.resetSystem();
    },

    /**
     * whether or not the system is full
     * @method isFull
     * @return {Boolean}
     */
    isFull: function () {
        return (this.particleCount >= this._totalParticles);
    },

    /**
     * <p> Sets a new CCSpriteFrame as particle.</br>
     * WARNING: this method is experimental. Use setTextureWithRect instead.
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
     * Sets a new texture with a rect. The rect is in Points.
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

    _applyFile: function (done) {
        var sgNode = this._sgNode;
        var file = this._file;
        if (file) {
            var self = this;
            cc.loader.load(file, function (err, results) {
                var content = results.getContent(file);
                if (err || !content) {
                    throw results.getError(file) || new Error('Unkown error');
                }

                sgNode.particleCount = 0;

                var active = sgNode.isActive();
                sgNode.initWithFile(file);

                // To avoid it export custom particle data textureImageData too large,
                // so use the texutreUuid instead of textureImageData
                if (content.textureUuid) {
                    cc.AssetLibrary.queryAssetInfo(content.textureUuid, function (err, url, raw) {
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

                //
                
                if (done) {
                    done();
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
            cc.assert(!sgNode.onExit);
            var self = this;
            sgNode.onExit = function () {
                _ccsg.Node.prototype.onExit.call(this);
                self.node.destroy();
            };
        }
        else if (sgNode.hasOwnProperty('onExit')) {
            sgNode.onExit = _ccsg.Node.prototype.onExit;
        }
    }
});

cc.ParticleSystem = module.exports = ParticleSystem;
