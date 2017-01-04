cc3d.extend(cc3d, function () {

    var _tempTiling = new cc.Vec3();
    var _tempOffset = new cc.Vec3();

    /**
     * @name cc3d.StandardMaterial
     * @class A Standard material is the main, general purpose material that is most often used for rendering.
     * It can approximate a wide variety of surface types and can simlulate dynamic reflected light.
     * @property {cc3d.Color} ambient The ambient color of the material. This color value is 3-component (RGB),
     * where each component is between 0 and 1.
     * @property {cc3d.Color} diffuse The diffuse color of the material. This color value is 3-component (RGB),
     * where each component is between 0 and 1.
     * @property {cc3d.Texture} diffuseMap The diffuse map of the material. This must be a 2D texture rather
     * than a cube map. If this property is set to a valid texture, the texture is used as the source for diffuse
     * color in preference to the 'diffuse' property.
     * @property {Number} diffuseMapUv Diffuse map UV channel
     * @property {String} diffuseMapChannel Color channels of the diffuse map to use. Can be "r", "g", "b", "a", "rgb" or any swizzled combination.
     * @property {Boolean} diffuseMapVertexColor Use vertex colors for diffuse instead of a map
     * @property {cc.Vec2v2} diffuseMapTiling Controls the 2D tiling of the diffuse map.
     * @property {cc.Vec2v2} diffuseMapOffset Controls the 2D offset of the diffuse map. Each component is between 0 and 1.
     * @property {cc3d.Color} specular The specular color of the material. This color value is 3-component (RGB),
     * @property {cc3d.Texture} specularMap The per-pixel specular map of the material. This must be a 2D texture
     * rather than a cube map. If this property is set to a valid texture, the texture is used as the source for
     * specular color in preference to the 'specular' property.
     * @property {Number} specularMapUv Specular map UV channel
     * @property {String} specularMapChannel Color channels of the specular map to use. Can be "r", "g", "b", "a", "rgb" or any swizzled combination.
     * @property {Boolean} specularMapVertexColor Use vertex colors for specular instead of a map
     * @property {cc.Vec2v2} specularMapTiling Controls the 2D tiling of the specular map.
     * @property {cc.Vec2v2} specularMapOffset Controls the 2D offset of the specular map. Each component is between 0 and 1.
     * @property {Number} metalness Defines how much the surface is metallic. From 0 (dielectric) to 1 (metal).
     * This can be used as alternative to specular color to save space.
     * Metallic surfaces have their reflection tinted with diffuse color.
     * @property {cc3d.Texture} metalnessMap Monochrome metalness map.
     * @property {Number} metalnessMapUv Metnalness map UV channel
     * @property {String} metalnessMapChannel Color channel of the metalness map to use. Can be "r", "g", "b" or "a".
     * @property {Boolean} metalnessMapVertexColor Use vertex colors for metalness instead of a map
     * @property {cc.Vec2v2} metalnessMapTiling Controls the 2D tiling of the metalness map.
     * @property {cc.Vec2v2} metalnessMapOffset Controls the 2D offset of the metalness map. Each component is between 0 and 1.
     * @property {Boolean} useMetalness Use metalness properties instead of specular.
     * @property {Number} shininess Defines glossiness of the material from 0 (rough) to 100 (mirror).
     * A higher shininess value results in a more focussed specular highlight.
     * @property {cc3d.Texture} glossMap The per-pixel gloss of the material. This must be a 2D texture
     * rather than a cube map. If this property is set to a valid texture, the texture is used as the source for
     * shininess in preference to the 'shininess' property.
     * @property {Number} glossMapUv Gloss map UV channel
     * @property {String} glossMapChannel Color channel of the gloss map to use. Can be "r", "g", "b" or "a".
     * @property {Boolean} glossMapVertexColor Use vertex colors for glossiness instead of a map
     * @property {cc.Vec2v2} glossMapTiling Controls the 2D tiling of the gloss map.
     * @property {cc.Vec2v2} glossMapOffset Controls the 2D offset of the gloss map. Each component is between 0 and 1.
     * @property {Number} refraction Defines the visibility of refraction. Material can refract the same cube map as used for reflections.
     * @property {Number} refractionIndex Defines the index of refraction, i.e. the amount of distortion.
     * The value is calculated as (outerIor / surfaceIor), where inputs are measured indices of refraction, the one around the object and the one of it's own surface.
     * In most situations outer medium is air, so outerIor will be approximately 1. Then you only need to do (1.0 / surfaceIor).
     * @property {cc.Vec3} emissive The emissive color of the material. This color value is 3-component (RGB),
     * where each component is between 0 and 1.
     * @property {cc3d.Texture} emissiveMap The emissive map of the material. This must be a 2D texture rather
     * than a cube map. If this property is set to a valid texture, the texture is used as the source for emissive
     * color in preference to the 'emissive' property.
     * @property {Number} emissiveIntensity Emissive color multiplier.
     * @property {Number} emissiveMapUv Emissive map UV channel
     * @property {String} emissiveMapChannel Color channels of the emissive map to use. Can be "r", "g", "b", "a", "rgb" or any swizzled combination.
     * @property {Boolean} emissiveMapVertexColor Use vertex colors for emission instead of a map
     * @property {cc.Vec2v2} emissiveMapTiling Controls the 2D tiling of the emissive map.
     * @property {cc.Vec2v2} emissiveMapOffset Controls the 2D offset of the emissive map. Each component is between 0 and 1.
     * @property {Number} opacity The opacity of the material. This value can be between 0 and 1, where 0 is fully
     * transparent and 1 is fully opaque. If you want the material to be transparent you also need to
     * set the {@link cc3d.Material#blendType} to cc3d.BLEND_NORMAL or cc3d.BLEND_ADDITIVE.
     * @property {cc3d.Texture} opacityMap The opacity map of the material. This must be a 2D texture rather
     * than a cube map. If this property is set to a valid texture, the texture is used as the source for opacity
     * in preference to the 'opacity' property. If you want the material to be transparent you also need to
     * set the {@link cc3d.Material#blendType} to cc3d.BLEND_NORMAL or cc3d.BLEND_ADDITIVE.
     * @property {Number} opacityMapUv Opacity map UV channel
     * @property {String} opacityMapChannel Color channel of the opacity map to use. Can be "r", "g", "b" or "a".
     * @property {Boolean} opacityMapVertexColor Use vertex colors for opacity instead of a map
     * @property {cc.Vec2v2} opacityMapTiling Controls the 2D tiling of the opacity map.
     * @property {cc.Vec2v2} opacityMapOffset Controls the 2D offset of the opacity map. Each component is between 0 and 1.
     * @property {cc3d.Texture} normalMap The normal map of the material. This must be a 2D texture rather
     * than a cube map. The texture must contains normalized, tangent space normals.
     * @property {Number} normalMapUv Normal map UV channel
     * @property {cc.Vec2v2} normalMapTiling Controls the 2D tiling of the normal map.
     * @property {cc.Vec2v2} normalMapOffset Controls the 2D offset of the normal map. Each component is between 0 and 1.
     * @property {cc3d.Texture} heightMap The height map of the material. This must be a 2D texture rather
     * than a cube map. The texture contain values defining the height of the surface at that point where darker
     * pixels are lower and lighter pixels are higher.
     * @property {Number} heightMapUv Height map UV channel
     * @property {String} heightMapChannel Color channel of the height map to use. Can be "r", "g", "b" or "a".
     * @property {cc.Vec2v2} heightMapTiling Controls the 2D tiling of the height map.
     * @property {cc.Vec2v2} heightMapOffset Controls the 2D offset of the height map. Each component is between 0 and 1.
     * @property {Number} bumpiness The bumpiness of the material. This value scales the assigned normal map
     * and can be between 0 and 1, where 0 shows no contribution from the normal map and 1 results in a full contribution.
     * @property {Number} heightMapFactor Height map multiplier. Height maps are used to create a parallax mapping effect
     * and modifying this value will alter the strength of the parallax effect.
     * @property {cc3d.Texture} sphereMap The spherical environment map of the material.
     * @property {cc3d.Texture} cubeMap The cubic environment map of the material.
     * @property {Number} cubeMapProjection The type of projection applied to the cubeMap property:
     * <ul>
     *     <li>{@link cc3d.CUBEPROJ_NONE}: The cube map is treated as if it is infinitely far away.</li>
     *     <li>{@link cc3d.CUBEPROJ_BOX}: Box-projection based on a world space axis-aligned bounding box.</li>
     * </ul>
     * Defaults to cc3d.CUBEPROJ_NONE.
     * @property {cc3d.BoundingBox} cubeMapProjectionBox The world space axis-aligned bounding box defining the
     * box-projection used for the cubeMap property. Only used when cubeMapProjection is set to cc3d.CUBEPROJ_BOX.
     * @property {Number} reflectivity The reflectivity of the material. This value scales the reflection map and
     * can be between 0 and 1, where 0 shows no reflection and 1 is fully reflective.
     * @property {cc3d.Texture} lightMap The light map of the material.
     * @property {Number} lightMapUv Lightmap UV channel
     * @property {String} lightMapChannel Color channels of the lightmap to use. Can be "r", "g", "b", "a", "rgb" or any swizzled combination.
     * @property {Boolean} lightMapVertexColor Use vertex lightmap instead of a texture-based one
     * @property {cc.Vec2v2} lightMapTiling Controls the 2D tiling of the lightmap.
     * @property {cc.Vec2v2} lightMapOffset Controls the 2D offset of the lightmap. Each component is between 0 and 1.
     * @property {Boolean} ambientTint Enables scene ambient multiplication by material ambient color.
     * @property {Boolean} diffuseMapTint Enables diffuseMap multiplication by diffuse color.
     * @property {Boolean} specularMapTint Enables specularMap multiplication by specular color.
     * @property {Boolean} emissiveMapTint Enables emissiveMap multiplication by emissive color.
     * @property {cc3d.Texture} aoMap Baked ambient occlusion map. Modulates ambient color.
     * @property {Number} aoMapUv AO map UV channel
     * @property {String} aoMapChannel Color channel of the AO map to use. Can be "r", "g", "b" or "a".
     * @property {Boolean} aoMapVertexColor Use vertex colors for AO instead of a map
     * @property {cc.Vec2v2} aoMapTiling Controls the 2D tiling of the AO map.
     * @property {cc.Vec2v2} aoMapOffset Controls the 2D offset of the AO map. Each component is between 0 and 1.
     * @property {Number} occludeSpecular Uses aoMap to occlude specular/reflection. It's a hack, because real specular occlusion is view-dependent. However, it's much better than nothing.
     * <ul>
     *     <li>{@link cc3d.SPECOCC_NONE}: No specular occlusion</li>
     *     <li>{@link cc3d.SPECOCC_AO}: Use AO map directly to occlude specular.</li>
     *     <li>{@link cc3d.SPECOCC_GLOSSDEPENDENT}: Modify AO map based on material glossiness/view angle to occlude specular.</li>
     * </ul>
     * @property {Number} occludeSpecularIntensity Controls visibility of specular occlusion.
     * @property {Boolean} specularAntialias Enables Toksvig AA for mipmapped normal maps with specular.
     * @property {Boolean} conserveEnergy Defines how diffuse and specular components are combined when Fresnel is on.
     It is recommended that you leave this option enabled, although you may want to disable it in case when all reflection comes only from a few light sources, and you don't use an environment map, therefore having mostly black reflection.
     * @property {Number} shadingModel Defines the shading model.
     * <ul>
     *     <li>{@link cc3d.SPECULAR_PHONG}: Phong without energy conservation. You should only use it as a backwards compatibility with older projects.</li>
     *     <li>{@link cc3d.SPECULAR_BLINN}: Energy-conserving Blinn-Phong.</li>
     * </ul>
     * @property {Number} fresnelModel Defines the formula used for Fresnel effect.
     As a side-effect, enabling any Fresnel model changes the way diffuse and reflection components are combined.
     When Fresnel is off, legacy non energy-conserving combining is used. When it is on, combining behaviour is defined by conserveEnergy parameter.
     * <ul>
     *     <li>{@link cc3d.FRESNEL_NONE}: No Fresnel.</li>
     *     <li>{@link cc3d.FRESNEL_SCHLICK}: Schlick's approximation of Fresnel (recommended). Parameterized by specular color.</li>
     * </ul>
     * @property {Boolean} useFog Apply fogging (as configured in scene settings)
     * @property {Boolean} useLighting Apply lighting
     * @property {Boolean} useSkybox Apply scene skybox as prefiltered environment map
     * @property {Boolean} useGammaTonemap Apply gamma correction and tonemapping (as configured in scene settings)
     *
     * @example
     * // Create a new Standard material
     * var material = new cc3d.StandardMaterial();
     *
     * // Update the material's diffuse and specular properties
     * material.diffuse.set(1, 0, 0);
     * material.specular.set(1, 1, 1);
     *
     * // Notify the material that it has been modified
     * material.update();
     *
     * @extends cc3d.Material
     * @author Will Eastcott and Arthur Rahteenko
     */

    var lightBounds = new cc3d.BoundingBox();
    var tempSphere = {center: null, radius: 0};

    var StandardMaterial = function () {
        this.reset();
        this.update();
    };

    var _createTexture = function (param) {
        if (param.data) {
            if (param.data instanceof cc3d.Texture) {
                return param.data;
            } else {
                return null;
                // throw Error("StandardMaterial.init() expects textures to already be created");
            }
        } else {
            return null;
        }
    };

    var _createCubemap = function (param) {
        if (param.data) {
            if (param.data instanceof cc3d.Texture) {
                return param.data;
            }
        }

        // StandardMaterial expects cubemap texture to be supplied
        return null;
    };

    var _createVec2 = function (param) {
        return new cc.Vec2v2(param.data[0], param.data[1]);
    };

    var _createVec3 = function (param) {
        return new cc.Vec3(param.data[0], param.data[1], param.data[2]);
    };

    var _createBoundingBox = function (param) {
        var center, halfExtents;

        if (param.data && param.data.center) {
            center = new cc.Vec3(param.data.center[0], param.data.center[1], param.data.center[2]);
        } else {
            center = new cc.Vec3(0, 0, 0);
        }

        if (param.data && param.data.halfExtents) {
            halfExtents = new cc.Vec3(param.data.halfExtents[0], param.data.halfExtents[1], param.data.halfExtents[2])
        } else {
            halfExtents = new cc.Vec3(0.5, 0.5, 0.5);
        }
        return new cc3d.BoundingBox(center, halfExtents);
    };

    var _createRgb = function (param) {
        return new cc3d.Color(param.data[0], param.data[1], param.data[2]);
    };

    var _propsSerial = [];
    var _propsSerialDefaultVal = [];
    var _propsInternalNull = [];
    var _propsInternalVec3 = [];
    var _prop2Uniform = {};

    var _defineTex2D = function (obj, name, uv, channels) {
        var privMap = "_" + name + "Map";
        var privMapTiling = privMap + "Tiling";
        var privMapOffset = privMap + "Offset";
        var mapTransform = privMap.substring(1) + "Transform";
        var privMapUv = privMap + "Uv";
        var privMapChannel = privMap + "Channel";
        var privMapVertexColor = privMap + "VertexColor";

        obj[privMap] = null;
        obj[privMapTiling] = new cc.Vec2v2(1, 1);
        obj[privMapOffset] = new cc.Vec2v2(0, 0);
        obj[mapTransform] = null;
        obj[privMapUv] = uv;
        if (channels > 0) obj[privMapChannel] = channels > 1 ? "rgb" : "g";
        obj[privMapVertexColor] = false;

        if (!cc3d._matTex2D) cc3d._matTex2D = [];
        cc3d._matTex2D[name] = channels;

        Object.defineProperty(StandardMaterial.prototype, privMap.substring(1), {
            get: function () {
                return this[privMap];
            },
            set: function (value) {
                var oldVal = this[privMap];
                if ((!oldVal && value) || (oldVal && !value)) this.dirtyShader = true;
                if (oldVal && value) {
                    if (oldVal.rgbm !== value.rgbm || oldVal.fixCubemapSeams !== value.fixCubemapSeams || oldVal.format !== value.format) {
                        this.dirtyShader = true;
                    }
                }
                this[privMap] = value;
            }
        });

        var mapTiling = privMapTiling.substring(1);
        var mapOffset = privMapOffset.substring(1);


        Object.defineProperty(StandardMaterial.prototype, mapTiling, {
            get: function () {
                this.dirtyShader = true;
                return this[privMapTiling];
            },
            set: function (value) {
                this.dirtyShader = true;
                this[privMapTiling] = value;
            }
        });
        _prop2Uniform[mapTiling] = function (mat, val, changeMat) {
            var tform = mat._updateMapTransform(
                changeMat ? mat[mapTransform] : null,
                val,
                mat[privMapOffset]
            );
            return {name: ("texture_" + mapTransform), value: tform.data};
        };


        Object.defineProperty(StandardMaterial.prototype, mapOffset, {
            get: function () {
                this.dirtyShader = true;
                return this[privMapOffset];
            },
            set: function (value) {
                this.dirtyShader = true;
                this[privMapOffset] = value;
            }
        });
        _prop2Uniform[mapOffset] = function (mat, val, changeMat) {
            var tform = mat._updateMapTransform(
                changeMat ? mat[mapTransform] : null,
                mat[privMapTiling],
                val
            );
            return {name: ("texture_" + mapTransform), value: tform.data};
        };


        Object.defineProperty(StandardMaterial.prototype, privMapUv.substring(1), {
            get: function () {
                return this[privMapUv];
            },
            set: function (value) {
                this.dirtyShader = true;
                this[privMapUv] = value;
            }
        });
        Object.defineProperty(StandardMaterial.prototype, privMapChannel.substring(1), {
            get: function () {
                return this[privMapChannel];
            },
            set: function (value) {
                this.dirtyShader = true;
                this[privMapChannel] = value;
            }
        });
        Object.defineProperty(StandardMaterial.prototype, privMapVertexColor.substring(1), {
            get: function () {
                return this[privMapVertexColor];
            },
            set: function (value) {
                this.dirtyShader = true;
                this[privMapVertexColor] = value;
            }
        });

        _propsSerial.push(privMap.substring(1));
        _propsSerial.push(privMapTiling.substring(1));
        _propsSerial.push(privMapOffset.substring(1));
        _propsSerial.push(privMapUv.substring(1));
        _propsSerial.push(privMapChannel.substring(1));
        _propsSerial.push(privMapVertexColor.substring(1));
        _propsInternalNull.push(mapTransform);
    };

    var _propsColor = [];
    var _defineColor = function (obj, name, defaultValue, hasMultiplier) {
        var priv = "_" + name;
        var uform = name + "Uniform";
        var mult = name + "Intensity";
        var pmult = "_" + mult;
        obj[priv] = defaultValue;
        obj[uform] = new Float32Array(3);
        Object.defineProperty(StandardMaterial.prototype, name, {
            get: function () {
                this.dirtyColor = true;
                this.dirtyShader = true;
                return this[priv];
            },
            set: function (value) {
                var oldVal = this[priv];
                var wasBw = (oldVal.data[0] === 0 && oldVal.data[1] === 0 && oldVal.data[2] === 0) || (oldVal.data[0] === 1 && oldVal.data[1] === 1 && oldVal.data[2] === 1);
                var isBw = (value.data[0] === 0 && value.data[1] === 0 && value.data[2] === 0) || (value.data[0] === 1 && value.data[1] === 1 && value.data[2] === 1);
                if (wasBw || isBw) this.dirtyShader = true;
                this.dirtyColor = true;
                this[priv] = value;
            }
        });
        _propsSerial.push(name);
        _propsInternalVec3.push(uform);
        _propsColor.push(name);
        _prop2Uniform[name] = function (mat, val, changeMat) {
            var arr = changeMat ? mat[uform] : new Float32Array(3);
            var gammaCorrection = false;
            if (mat.useGammaTonemap) {
                var scene = mat._scene || cc3d.Application.getApplication().scene;
                gammaCorrection = scene.gammaCorrection;
            }
            for (var c = 0; c < 3; c++) {
                if (gammaCorrection) {
                    arr[c] = Math.pow(val.data[c], 2.2);
                } else {
                    arr[c] = val.data[c];
                }
                if (hasMultiplier) arr[c] *= mat[pmult];
            }
            return {name: ("material_" + name), value: arr};
        };

        if (hasMultiplier) {
            obj[pmult] = 1;
            Object.defineProperty(StandardMaterial.prototype, mult, {
                get: function () {
                    return this[pmult];
                },
                set: function (value) {
                    var oldVal = this[pmult];
                    var wasBw = oldVal === 0 || oldVal === 1;
                    var isBw = value === 0 || value === 1;
                    if (wasBw || isBw) this.dirtyShader = true;
                    this.dirtyColor = true;
                    this[pmult] = value;
                }
            });
            _propsSerial.push(mult);
            _prop2Uniform[mult] = function (mat, val, changeMat) {
                var arr = changeMat ? mat[uform] : new Float32Array(3);
                var gammaCorrection = false;
                if (mat.useGammaTonemap) {
                    var scene = mat._scene || cc3d.Application.getApplication().scene;
                    gammaCorrection = scene.gammaCorrection;
                }
                for (var c = 0; c < 3; c++) {
                    if (gammaCorrection) {
                        arr[c] = Math.pow(mat[priv].data[c], 2.2);
                    } else {
                        arr[c] = mat[priv].data[c];
                    }
                    arr[c] *= mat[pmult];
                }
                return {name: ("material_" + name), value: arr};
            };
        }
    };

    var _defineFloat = function (obj, name, defaultValue, func) {
        var priv = "_" + name;
        obj[priv] = defaultValue;
        Object.defineProperty(StandardMaterial.prototype, name, {
            get: function () {
                return this[priv];
            },
            set: function (value) {
                var oldVal = this[priv];
                var wasBw = oldVal === 0 || oldVal === 1;
                var isBw = value === 0 || value === 1;
                if (wasBw || isBw) this.dirtyShader = true;
                this[priv] = value;
            }
        });
        _propsSerial.push(name);
        _prop2Uniform[name] = func !== undefined ? func : (function (mat, val, changeMat) {
            return {name: ("material_" + name), value: val};
        });
    };

    var _defineObject = function (obj, name, func) {
        var priv = "_" + name;
        obj[priv] = null;
        Object.defineProperty(StandardMaterial.prototype, name, {
            get: function () {
                return this[priv];
            },
            set: function (value) {
                var oldVal = this[priv];
                if ((!oldVal && value) || (oldVal && !value)) this.dirtyShader = true;
                this[priv] = value;
            }
        });
        _propsSerial.push(name);
        _prop2Uniform[name] = func;
    };

    var _defineChunks = function (obj) {
        this._chunks = null;
        Object.defineProperty(StandardMaterial.prototype, "chunks", {
            get: function () {
                this.dirtyShader = true;
                return this._chunks;
            },
            set: function (value) {
                this.dirtyShader = true;
                this._chunks = value;
            }
        });
        _propsSerial.push("chunks");
    };

    var _defineFlag = function (obj, name, defaultValue) {
        var priv = "_" + name;
        obj[priv] = defaultValue;
        Object.defineProperty(StandardMaterial.prototype, name, {
            get: function () {
                return this[priv];
            },
            set: function (value) {
                this.dirtyShader = true;
                this[priv] = value;
            }
        });
        _propsSerial.push(name);
    };

    var Chunks = function () {
    };
    Chunks.prototype.copy = function (from) {
        for (var p in from) {
            if (from.hasOwnProperty(p) && p !== 'copy')
                this[p] = from[p];
        }
    };

    StandardMaterial = cc3d.inherits(StandardMaterial, cc3d.Material);

    cc3d.extend(StandardMaterial.prototype, {

        reset: function () {
            this.blendType = cc3d.BLEND_NONE;

            var i;
            for (i = 0; i < _propsSerial.length; i++) {
                var defVal = _propsSerialDefaultVal[i];
                this[_propsSerial[i]] = defVal ? (defVal.clone ? defVal.clone() : defVal) : defVal;
            }
            for (i = 0; i < _propsInternalNull.length; i++) {
                this[_propsInternalNull[i]] = null;
            }
            for (i = 0; i < _propsInternalVec3.length; i++) {
                this[_propsInternalVec3[i]] = new Float32Array(3);
            }

            this._chunks = new Chunks();

            this.cubeMapMinUniform = new Float32Array(3);
            this.cubeMapMaxUniform = new Float32Array(3);
        },


        /**
         * @function
         * @name cc3d.StandardMaterial#clone
         * @description Duplicates a Standard material. All properties are duplicated except textures
         * where only the references are copied.
         * @returns {cc3d.StandardMaterial} A cloned Standard material.
         */
        clone: function () {
            var clone = new cc3d.StandardMaterial();

            cc3d.Material.prototype._cloneInternal.call(this, clone);

            var pname;
            for (var i = 0; i < _propsSerial.length; i++) {
                pname = _propsSerial[i];
                if (this[pname] !== undefined) {
                    if (this[pname] && this[pname].copy) {
                        if (clone[pname]) {
                            clone[pname].copy(this[pname]);
                        } else {
                            clone[pname] = this[pname].clone();
                        }
                    } else {
                        clone[pname] = this[pname];
                    }
                }
            }

            if (!clone.shader)
                clone.update();

            return clone;
        },

        /**
         * @private
         * @name cc3d.PhoneMaterial#init
         * @description Update material data from a data block, as found on a material Asset.
         * Note, init() expects texture parameters to contain a {@link cc3d.Texture} not a resource id.
         */
        init: function (data) {
            this.reset();

            // Initialise material from data
            this.name = data.name;

            if (data.chunks)
                this.chunks.copy(data.chunks);

            for (var i = 0; i < data.parameters.length; i++) {
                var param = data.parameters[i];
                if (param.type === "vec3") {
                    this[param.name] = _createRgb(param);
                } else if (param.type === "vec2") {
                    this[param.name] = _createVec2(param);
                } else if (param.type === "texture") {
                    this[param.name] = _createTexture(param);
                } else if (param.type === "cubemap") {
                    this[param.name] = _createCubemap(param);
                } else if (param.name === "bumpMapFactor") { // Unfortunately, names don't match for bumpiness
                    this.bumpiness = param.data;
                } else if (param.type === 'boundingbox') {
                    this[param.name] = _createBoundingBox(param);
                } else {
                    this[param.name] = param.data;
                }
            }

            this.update();
        },

        _updateMapTransform: function (transform, tiling, offset) {
            transform = transform || new cc.Vec4();
            transform.set(tiling.x, tiling.y, offset.x, offset.y);

            if ((transform.x === 1) && (transform.y === 1) && (transform.z === 0) && (transform.w === 0)) return null;
            return transform;
        },

        _collectLights: function (lType, lights, lightsSorted, mask, staticLightList) {
            var light;
            var i;
            for (i = 0; i < lights.length; i++) {
                light = lights[i];
                if (light.getEnabled()) {
                    if (light.mask & mask) {
                        if (light.getType() === lType) {
                            if (lType !== cc3d.LIGHTTYPE_DIRECTIONAL) {
                                if (light.isStatic) {
                                    continue;
                                }
                            }
                            lightsSorted.push(light);
                        }
                    }
                }
            }

            if (staticLightList) {
                for (i = 0; i < staticLightList.length; i++) {
                    light = staticLightList[i];
                    if (light.getType() === lType) {
                        lightsSorted.push(light);
                    }
                }
            }
        },

        _setParameter: function (name, value) {
            this.setParameter(name, value);
            this._propsSet.push(name);
        },

        _clearParameters: function () {
            var props = this._propsSet;
            for (var i = 0; i < props.length; i++) {
                delete this.parameters[props[i]];
            }
            this._propsSet = [];
        },

        _updateMap: function (p) {
            var mname = p + "Map";
            if (this[mname]) {
                this._setParameter("texture_" + mname, this[mname]);

                var tname = mname + "Transform";
                this[tname] = this._updateMapTransform(
                    this[tname],
                    this[mname + "Tiling"],
                    this[mname + "Offset"]
                );

                if (this[tname]) {
                    this._setParameter('texture_' + tname, this[tname].data);
                }
            }
        },

        getUniform: function (varName, value, changeMat) {
            var func = _prop2Uniform[varName];
            if (func) {
                return func(this, value, changeMat);
            }
            return null;
        },

        update: function () {
            this._clearParameters();

            this._setParameter('material_ambient', this.ambientUniform);

            if (!this.diffuseMap || this.diffuseMapTint) {
                this._setParameter('material_diffuse', this.diffuseUniform);
            }

            if (!this.useMetalness) {
                if (!this.specularMap || this.specularMapTint) {
                    this._setParameter('material_specular', this.specularUniform);
                }
            } else {
                if (!this.metalnessMap || this.metalness < 1) {
                    this._setParameter('material_metalness', this.metalness);
                }
            }

            this._setParameter(this.getUniform("shininess", this.shininess, true));

            if (!this.emissiveMap || this.emissiveMapTint) {
                this._setParameter('material_emissive', this.emissiveUniform);
            }
            if (this.emissiveMap) {
                this._setParameter('material_emissiveIntensity', this.emissiveIntensity);
            }

            if (this.refraction > 0) {
                this._setParameter('material_refraction', this.refraction);
                this._setParameter('material_refractionIndex', this.refractionIndex);
            }

            this._setParameter('material_opacity', this.opacity);

            if (this.occludeSpecular) {
                this._setParameter('material_occludeSpecularIntensity', this.occludeSpecularIntensity);
            }

            if (this.cubeMapProjection === cc3d.CUBEPROJ_BOX) {
                this._setParameter(this.getUniform("cubeMapProjectionBox", this.cubeMapProjectionBox, true));
            }

            for (var p in cc3d._matTex2D) {
                this._updateMap(p);
            }

            if (this.ambientSH) {
                this._setParameter('ambientSH[0]', this.ambientSH);
            }

            if (this.normalMap) {
                this._setParameter('material_bumpiness', this.bumpiness);
            }

            if (this.heightMap) {
                this._setParameter(this.getUniform('heightMapFactor', this.heightMapFactor, true));
            }

            if (this.cubeMap) {
                this._setParameter('texture_cubeMap', this.cubeMap);
            }
            if (this.prefilteredCubeMap128) {
                this._setParameter('texture_prefilteredCubeMap128', this.prefilteredCubeMap128);
            }
            if (this.prefilteredCubeMap64) {
                this._setParameter('texture_prefilteredCubeMap64', this.prefilteredCubeMap64);
            }
            if (this.prefilteredCubeMap32) {
                this._setParameter('texture_prefilteredCubeMap32', this.prefilteredCubeMap32);
            }
            if (this.prefilteredCubeMap16) {
                this._setParameter('texture_prefilteredCubeMap16', this.prefilteredCubeMap16);
            }
            if (this.prefilteredCubeMap8) {
                this._setParameter('texture_prefilteredCubeMap8', this.prefilteredCubeMap8);
            }
            if (this.prefilteredCubeMap4) {
                this._setParameter('texture_prefilteredCubeMap4', this.prefilteredCubeMap4);
            }
            if (this.sphereMap) {
                this._setParameter('texture_sphereMap', this.sphereMap);
            }
            if (this.dpAtlas) {
                this._setParameter('texture_sphereMap', this.dpAtlas);
            }
            //if (this.sphereMap || this.cubeMap || this.prefilteredCubeMap128) {
            this._setParameter('material_reflectivity', this.reflectivity);
            //}

            if (this.dirtyShader || !this._scene) {
                this.shader = null;
                this.clearVariants();
            }

            this._processColor();
        },

        _processColor: function () {
            if (!this.dirtyColor) return;
            if (!this._scene && this.useGammaTonemap) return;
            var gammaCorrection = false;
            if (this.useGammaTonemap) gammaCorrection = this._scene.gammaCorrection;

            // Gamma correct colors
            for (var i = 0; i < _propsColor.length; i++) {
                var clr = this["_" + _propsColor[i]];
                var arr = this[_propsColor[i] + "Uniform"];
                for (var c = 0; c < 3; c++) {
                    if (gammaCorrection) {
                        arr[c] = Math.pow(clr.data[c], 2.2);
                    } else {
                        arr[c] = clr.data[c];
                    }
                }
            }
            for (c = 0; c < 3; c++) {
                this.emissiveUniform[c] *= this.emissiveIntensity;
            }
            this.dirtyColor = false;
        },

        _getMapTransformID: function (xform, uv) {
            if (!xform) return 0;
            if (!this._mapXForms[uv]) this._mapXForms[uv] = [];

            var i, j, same;
            for (i = 0; i < this._mapXForms[uv].length; i++) {
                same = true;
                for (j = 0; j < xform.data.length; j++) {
                    if (this._mapXForms[uv][i][j] != xform.data[j]) {
                        same = false;
                        break;
                    }
                }
                if (same) {
                    return i + 1;
                }
            }
            var newID = this._mapXForms[uv].length;
            this._mapXForms[uv][newID] = [];
            for (j = 0; j < xform.data.length; j++) {
                this._mapXForms[uv][newID][j] = xform.data[j];
            }
            return newID + 1;
        },

        updateShader: function (device, scene, objDefs, staticLightList) {
            var i, c;
            if (!this._scene) {
                this._scene = scene;
                this._processColor();
            }

            var lights = scene._lights;
            this._mapXForms = [];

            var useTexCubeLod = device.useTexCubeLod;
            var useDp = !device.extTextureLod; // no basic extension? likely slow device, force dp

            var globalSky128, globalSky64, globalSky32, globalSky16, globalSky8, globalSky4;
            if (this.useSkybox) {
                globalSky128 = scene.skyboxPrefiltered128;
                globalSky64 = scene.skyboxPrefiltered64;
                globalSky32 = scene.skyboxPrefiltered32;
                globalSky16 = scene.skyboxPrefiltered16;
                globalSky8 = scene.skyboxPrefiltered8;
                globalSky4 = scene.skyboxPrefiltered4;
            }

            var prefilteredCubeMap128 = this.prefilteredCubeMap128 || globalSky128;
            var prefilteredCubeMap64 = this.prefilteredCubeMap64 || globalSky64;
            var prefilteredCubeMap32 = this.prefilteredCubeMap32 || globalSky32;
            var prefilteredCubeMap16 = this.prefilteredCubeMap16 || globalSky16;
            var prefilteredCubeMap8 = this.prefilteredCubeMap8 || globalSky8;
            var prefilteredCubeMap4 = this.prefilteredCubeMap4 || globalSky4;

            if (prefilteredCubeMap128) {
                var allMips = prefilteredCubeMap128 &&
                    prefilteredCubeMap64 &&
                    prefilteredCubeMap32 &&
                    prefilteredCubeMap16 &&
                    prefilteredCubeMap8 &&
                    prefilteredCubeMap4;

                if (useDp && allMips) {
                    if (!prefilteredCubeMap128.dpAtlas) {
                        prefilteredCubeMap128.dpAtlas = cc3d.generateDpAtlas(device,
                            [prefilteredCubeMap128, prefilteredCubeMap64, prefilteredCubeMap32, prefilteredCubeMap16,
                                prefilteredCubeMap8, prefilteredCubeMap4]);
                        prefilteredCubeMap128.sh = cc3d.shFromCubemap(prefilteredCubeMap16);
                    }
                    this.dpAtlas = prefilteredCubeMap128.dpAtlas;
                    this.ambientSH = prefilteredCubeMap128.sh;
                    this._setParameter('ambientSH[0]', this.ambientSH);
                    this._setParameter('texture_sphereMap', this.dpAtlas);
                } else if (useTexCubeLod) {
                    if (prefilteredCubeMap128._levels.length < 6) {
                        if (allMips) {
                            // Multiple -> single (provided cubemap per mip, but can use texCubeLod)
                            this._setParameter('texture_prefilteredCubeMap128', prefilteredCubeMap128);
                        } else {
                            console.log("Can't use prefiltered cubemap: " + allMips + ", " + useTexCubeLod + ", " + prefilteredCubeMap128._levels);
                        }
                    } else {
                        // Single (able to use single cubemap with texCubeLod)
                        this._setParameter('texture_prefilteredCubeMap128', prefilteredCubeMap128);
                    }
                } else if (allMips) {
                    // Multiple (no texCubeLod, but able to use cubemap per mip)
                    this._setParameter('texture_prefilteredCubeMap128', prefilteredCubeMap128);
                    this._setParameter('texture_prefilteredCubeMap64', prefilteredCubeMap64);
                    this._setParameter('texture_prefilteredCubeMap32', prefilteredCubeMap32);
                    this._setParameter('texture_prefilteredCubeMap16', prefilteredCubeMap16);
                    this._setParameter('texture_prefilteredCubeMap8', prefilteredCubeMap8);
                    this._setParameter('texture_prefilteredCubeMap4', prefilteredCubeMap4);
                } else {
                    console.log("Can't use prefiltered cubemap: " + allMips + ", " + useTexCubeLod + ", " + prefilteredCubeMap128._levels);
                }
            }

            var specularTint = false;
            var useSpecular = (this.useMetalness ? true : !!this.specularMap) || (!!this.sphereMap) || (!!this.cubeMap) || (!!this.dpAtlas);
            useSpecular = useSpecular || (this.useMetalness ? true : !(this.specular.data[0] === 0 && this.specular.data[1] === 0 && this.specular.data[2] === 0));

            if (useSpecular) {
                if (this.specularMapTint && !this.useMetalness) {
                    specularTint = this.specular.data[0] !== 1 || this.specular.data[1] !== 1 || this.specular.data[2] !== 1;
                }
            }

            var rgbmReflection = (prefilteredCubeMap128 ? prefilteredCubeMap128.rgbm : false) ||
                (this.cubeMap ? this.cubeMap.rgbm : false) ||
                (this.sphereMap ? this.sphereMap.rgbm : false) ||
                (this.dpAtlas ? this.dpAtlas.rgbm : false);

            var hdrReflection = (prefilteredCubeMap128 ? prefilteredCubeMap128.rgbm || prefilteredCubeMap128.format === cc3d.PIXELFORMAT_RGBA32F : false) ||
                (this.cubeMap ? this.cubeMap.rgbm || this.cubeMap.format === cc3d.PIXELFORMAT_RGBA32F : false) ||
                (this.sphereMap ? this.sphereMap.rgbm || this.sphereMap.format === cc3d.PIXELFORMAT_RGBA32F : false) ||
                (this.dpAtlas ? this.dpAtlas.rgbm || this.dpAtlas.format === cc3d.PIXELFORMAT_RGBA32F : false);

            var emissiveTint = (this.emissive.data[0] !== 1 || this.emissive.data[1] !== 1 || this.emissive.data[2] !== 1 || this.emissiveIntensity !== 1) && this.emissiveMapTint;
            emissiveTint = emissiveTint ? 3 : (this.emissiveIntensity !== 1 ? 1 : 0);

            var options = {
                fog: this.useFog ? scene.fog : "none",
                gamma: this.useGammaTonemap ? scene.gammaCorrection : cc3d.GAMMA_NONE,
                toneMap: this.useGammaTonemap ? scene.toneMapping : -1,
                blendMapsWithColors: true,
                modulateAmbient: this.ambientTint,
                diffuseTint: (this.diffuse.data[0] !== 1 || this.diffuse.data[1] !== 1 || this.diffuse.data[2] !== 1) && this.diffuseMapTint,
                specularTint: specularTint,
                metalnessTint: this.useMetalness && this.metalness < 1,
                glossTint: true,
                emissiveTint: emissiveTint,
                opacityTint: this.opacity !== 1 && this.blendType !== cc3d.BLEND_NONE,
                alphaTest: this.alphaTest > 0,
                needsNormalFloat: this.normalizeNormalMap,

                sphereMap: !!this.sphereMap,
                cubeMap: !!this.cubeMap,
                dpAtlas: !!this.dpAtlas,
                ambientSH: !!this.ambientSH,
                useSpecular: useSpecular,
                rgbmReflection: rgbmReflection,
                hdrReflection: hdrReflection,
                fixSeams: prefilteredCubeMap128 ? prefilteredCubeMap128.fixCubemapSeams : (this.cubeMap ? this.cubeMap.fixCubemapSeams : false),
                prefilteredCubemap: !!prefilteredCubeMap128,
                emissiveFormat: this.emissiveMap ? (this.emissiveMap.rgbm ? 1 : (this.emissiveMap.format === cc3d.PIXELFORMAT_RGBA32F ? 2 : 0)) : null,
                lightMapFormat: this.lightMap ? (this.lightMap.rgbm ? 1 : (this.lightMap.format === cc3d.PIXELFORMAT_RGBA32F ? 2 : 0)) : null,
                useRgbm: rgbmReflection || (this.emissiveMap ? this.emissiveMap.rgbm : 0) || (this.lightMap ? this.lightMap.rgbm : 0),
                specularAA: this.specularAntialias,
                conserveEnergy: this.conserveEnergy,
                occludeSpecular: this.occludeSpecular,
                occludeSpecularFloat: (this.occludeSpecularIntensity !== 1.0),
                occludeDirect: this.occludeDirect,
                shadingModel: this.shadingModel,
                fresnelModel: this.fresnelModel,
                packedNormal: this.normalMap ? (this.normalMap.format === cc3d.PIXELFORMAT_DXT5) : false,
                shadowSampleType: this.shadowSampleType,
                forceFragmentPrecision: this.forceFragmentPrecision,
                fastTbn: this.fastTbn,
                cubeMapProjection: this.cubeMapProjection,
                chunks: this.chunks,
                customFragmentShader: this.customFragmentShader,
                refraction: !!this.refraction,
                useMetalness: this.useMetalness,
                blendType: this.blendType,
                skyboxIntensity: (prefilteredCubeMap128 === globalSky128 && prefilteredCubeMap128) && (scene.skyboxIntensity !== 1),
                forceUv1: this.forceUv1,
                useTexCubeLod: useTexCubeLod
            };

            var hasUv0 = false;
            var hasUv1 = false;
            var hasVcolor = false;
            if (objDefs) {
                options.noShadow = (objDefs & cc3d.SHADERDEF_NOSHADOW) !== 0;
                options.skin = (objDefs & cc3d.SHADERDEF_SKIN) !== 0;
                options.useInstancing = (objDefs & cc3d.SHADERDEF_INSTANCING) !== 0;
                if ((objDefs & cc3d.SHADERDEF_LM) !== 0) {
                    options.lightMapFormat = 1; // rgbm
                    options.lightMap = true;
                    options.lightMapChannel = "rgb";
                    options.lightMapUv = 1;
                    options.lightMapTransform = 0;
                    options.lightMapWithoutAmbient = true;
                    options.useRgbm = true;
                    if ((objDefs & cc3d.SHADERDEF_DIRLM) !== 0) {
                        options.dirLightMap = true;
                    }
                }
                hasUv0 = (objDefs & cc3d.SHADERDEF_UV0) !== 0;
                hasUv1 = (objDefs & cc3d.SHADERDEF_UV1) !== 0;
                hasVcolor = (objDefs & cc3d.SHADERDEF_VCOLOR) !== 0;
            }

            for (var p in cc3d._matTex2D) {
                if (p === "opacity" && this.blendType === cc3d.BLEND_NONE && this.alphaTest === 0.0) continue;
                var cname;
                var mname = p + "Map";
                var vname = mname + "VertexColor";
                if (p !== "height" && this[vname]) {
                    if (hasVcolor) {
                        cname = mname + "Channel";
                        options[vname] = this[vname];
                        options[cname] = this[cname];
                        options.vertexColors = true;
                    }
                } else if (this[mname]) {
                    var uname = mname + "Uv";
                    var allow = true;
                    if (this[uname] === 0 && !hasUv0) allow = false;
                    if (this[uname] === 1 && !hasUv1) allow = false;
                    if (allow) {
                        options[mname] = !!this[mname];
                        var tname = mname + "Transform";
                        cname = mname + "Channel";
                        options[tname] = this._getMapTransformID(this[tname], this[uname]);
                        options[cname] = this[cname];
                        options[uname] = this[uname];
                    }
                }
            }

            options.aoMapUv = options.aoMapUv || this.aoUvSet; // backwards comp

            this._mapXForms = null;

            if (this.useLighting) {
                var lightsSorted = [];
                var mask = objDefs ? (objDefs >> 8) : 1;
                this._collectLights(cc3d.LIGHTTYPE_DIRECTIONAL, lights, lightsSorted, mask);
                this._collectLights(cc3d.LIGHTTYPE_POINT, lights, lightsSorted, mask, staticLightList);
                this._collectLights(cc3d.LIGHTTYPE_SPOT, lights, lightsSorted, mask, staticLightList);
                options.lights = lightsSorted;
            } else {
                options.lights = [];
            }


            var library = device.getProgramLibrary();
            this.shader = library.getProgram('standard', options);

            if (!objDefs) {
                this.clearVariants();
                this.variants[0] = this.shader;
            }

            this.dirtyShader = false;
        }
    });

    var _defineMaterialProps = function (obj) {

        obj.dirtyShader = true;
        obj.dirtyColor = true;
        obj._scene = null;

        _defineColor(obj, "ambient", new cc3d.Color(0.7, 0.7, 0.7));
        _defineColor(obj, "diffuse", new cc3d.Color(1, 1, 1));
        _defineColor(obj, "specular", new cc3d.Color(0, 0, 0));
        _defineColor(obj, "emissive", new cc3d.Color(0, 0, 0), true);

        _defineFloat(obj, "shininess", 25, function (mat, shininess) {
            // Shininess is 0-100 value
            // which is actually a 0-1 glosiness value.
            // Can be converted to specular power using exp2(shininess * 0.01 * 11)
            var value;
            if (mat.shadingModel === cc3d.SPECULAR_PHONG) {
                value = Math.pow(2, shininess * 0.01 * 11); // legacy: expand back to specular power
            } else {
                value = shininess * 0.01; // correct
            }
            return {name: "material_shininess", value: value};
        });
        _defineFloat(obj, "heightMapFactor", 1, function (mat, height) {
            return {name: 'material_heightMapFactor', value: height * 0.025};
        });
        _defineFloat(obj, "opacity", 1);
        _defineFloat(obj, "alphaTest", 0);
        _defineFloat(obj, "bumpiness", 1);
        _defineFloat(obj, "reflectivity", 1);
        _defineFloat(obj, "occludeSpecularIntensity", 1);
        _defineFloat(obj, "refraction", 0);
        _defineFloat(obj, "refractionIndex", 1.0 / 1.5); // approx. (air ior / glass ior)
        _defineFloat(obj, "metalness", 1);
        _defineFloat(obj, "aoUvSet", 0, null); // legacy

        _defineObject(obj, "ambientSH", function (mat, val, changeMat) {
            return {name: "ambientSH[0]", value: val};
        });

        _defineObject(obj, "cubeMapProjectionBox", function (mat, val, changeMat) {
            var bmin = changeMat ? mat.cubeMapMinUniform : new Float32Array(3);
            var bmax = changeMat ? mat.cubeMapMaxUniform : new Float32Array(3);

            bmin[0] = val.center.x - val.halfExtents.x;
            bmin[1] = val.center.y - val.halfExtents.y;
            bmin[2] = val.center.z - val.halfExtents.z;

            bmax[0] = val.center.x + val.halfExtents.x;
            bmax[1] = val.center.y + val.halfExtents.y;
            bmax[2] = val.center.z + val.halfExtents.z;

            return [{name: "envBoxMin", value: bmin}, {name: "envBoxMax", value: bmax}];
        });

        _defineChunks(obj);

        _defineFlag(obj, "ambientTint", false);
        _defineFlag(obj, "diffuseMapTint", false);
        _defineFlag(obj, "specularMapTint", false);
        _defineFlag(obj, "emissiveMapTint", false);
        _defineFlag(obj, "fastTbn", false);
        _defineFlag(obj, "specularAntialias", false);
        _defineFlag(obj, "useMetalness", false);
        _defineFlag(obj, "occludeDirect", false);
        _defineFlag(obj, "normalizeNormalMap", true);
        _defineFlag(obj, "conserveEnergy", true);
        _defineFlag(obj, "occludeSpecular", cc3d.SPECOCC_AO);
        _defineFlag(obj, "shadingModel", cc3d.SPECULAR_BLINN);
        _defineFlag(obj, "fresnelModel", cc3d.FRESNEL_NONE);
        _defineFlag(obj, "cubeMapProjection", cc3d.CUBEPROJ_NONE);
        _defineFlag(obj, "shadowSampleType", cc3d.SHADOWSAMPLE_PCF3X3);
        _defineFlag(obj, "customFragmentShader", null);
        _defineFlag(obj, "forceFragmentPrecision", null);
        _defineFlag(obj, "useFog", true);
        _defineFlag(obj, "useLighting", true);
        _defineFlag(obj, "useGammaTonemap", true);
        _defineFlag(obj, "useSkybox", true);
        _defineFlag(obj, "forceUv1", false);

        _defineTex2D(obj, "diffuse", 0, 3);
        _defineTex2D(obj, "specular", 0, 3);
        _defineTex2D(obj, "emissive", 0, 3);
        _defineTex2D(obj, "normal", 0, -1);
        _defineTex2D(obj, "metalness", 0, 1);
        _defineTex2D(obj, "gloss", 0, 1);
        _defineTex2D(obj, "opacity", 0, 1);
        _defineTex2D(obj, "height", 0, 1);
        _defineTex2D(obj, "ao", 0, 1);
        _defineTex2D(obj, "light", 1, 3);

        _defineObject(obj, "cubeMap");
        _defineObject(obj, "sphereMap");
        _defineObject(obj, "dpAtlas");
        _defineObject(obj, "prefilteredCubeMap128");
        _defineObject(obj, "prefilteredCubeMap64");
        _defineObject(obj, "prefilteredCubeMap32");
        _defineObject(obj, "prefilteredCubeMap16");
        _defineObject(obj, "prefilteredCubeMap8");
        _defineObject(obj, "prefilteredCubeMap4");

        for (var i = 0; i < _propsSerial.length; i++) {
            _propsSerialDefaultVal[i] = obj[_propsSerial[i]];
        }

        obj._propsSet = [];
    };

    _defineMaterialProps(StandardMaterial.prototype);

    return {
        StandardMaterial: StandardMaterial
    };
}());
