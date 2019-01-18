/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
let _vertices = [];
let _indices = [];
let _vertexOffset = 0;
let _indexOffset = 0;
let _vfOffset = 0;
let _frameRate = 1 / 60;
let _preTexUrl = undefined;
let _preBlendMode = undefined;
let _segVCount = 0;
let _segICount = 0;

let CacheItem = cc.Class({
    ctor () {
        this.allFrame = [];
        this.totalTime = 0;
    },

    getFrame (index) {
        return this.allFrame[index];
    },

    init (armature, animationName) {
        let animation = armature.animation;
        animation.play(animationName, -1);
        let frameIdx = 0;
        do {
            // Solid update frame rate 1/60.
            armature.advanceTime(_frameRate);
            this._initFrame(armature, frameIdx) && frameIdx++;
        } while (!animation.isCompleted);
        // Update frame length.
        this.allFrame.length = frameIdx;
        this.totalTime = frameIdx * _frameRate;
    },

    _initFrame (armature, index) {
        _vfOffset = 0;
        _indexOffset = 0;
        _vertexOffset = 0;
        _preTexUrl = undefined;
        _preBlendMode = undefined;
        _segVCount = 0;
        _segICount = 0;

        let segments = this.segments = [];
        this._traverseArmature(armature);
        // handle pre
        let preSegOffset = segments.length - 1;
        if (preSegOffset >= 0 && _segICount > 0) {
            let preSegInfo = segments[preSegOffset];
            preSegInfo.indexCount = _segICount;
            preSegInfo.vfCount = _segVCount * 5;
            preSegInfo.vertexCount = _segVCount;
        } else {
            return false;
        }

        // Fill vertices
        let vertices = new Float32Array(_vfOffset);
        let uintVert = new Uint32Array(frame.vertices.buffer);
        for (let i = 0; i < _vfOffset;) {
            vertices[i++] = _vertices[i++]; // x
            vertices[i++] = _vertices[i++]; // y
            vertices[i++] = _vertices[i++]; // u
            vertices[i++] = _vertices[i++]; // v
            uintVert[i++] = _vertices[i++]; // color
        }

        // Fill indices
        let indices = new Uint16Array(_indexOffset);
        for (let i = 0; i < _indexOffset; i++) {
            indices[i] = _indices[i];
        }

        let frame = this.allFrame[index] = {};
        frame.vertices = vertices;
        frame.uintVert = uintVert;
        frame.indices = indices;
        frame.segments = this.segments;
        return true;
    },

    _traverseArmature (armature) {
        let segments = this.segments;
        let gVertices = _vertices;
        let gIndices = _indices;
        let slotVertices, slotIndices, slotVertex;
        let slots = armature._slots, slot, slotMatrix, slotColor, colorVal;
        let texture;
        let preSegOffset, preSegInfo;

        for (let i = 0, l = slots.length; i < l; i++) {
            slot = slots[i];
            if (!slot._visible || !slot._displayData) continue;

            slot.updateWorldMatrix();

            if (slot.childArmature) {
                this._traverseArmature(slot.childArmature);
                continue;
            }

            texture = slot.getTexture();
            if (!texture) continue;

            slotColor = slot._color;

            if (_preTexUrl !== texture.url || _preBlendMode !== slot._blendMode) {
                _preTexUrl = texture.url;
                _preBlendMode = slot._blendMode;
                // handle pre
                preSegOffset = segments.length - 1;
                if (preSegOffset >= 0 && _segICount > 0) {
                    preSegInfo = segments[preSegOffset];
                    preSegInfo.indexCount = _segICount;
                    preSegInfo.vertexCount = _segVCount;
                    preSegInfo.vfCount = _segVCount * 5;
                }
                // handle now
                segments.push({
                    tex : texture,
                    blendMode : slot._blendMode,
                    indexCount : 0,
                    vertexCount : 0,
                    vfCount : 0,
                    r : slotColor.r,
                    g : slotColor.g,
                    b : slotColor.b,
                    a : slotColor.a,
                });
                _segICount = 0;
                _segVCount = 0;
            }

            colorVal = ((slotColor.a<<24) >>> 0) + (slotColor.b<<16) + (slotColor.g<<8) + slotColor.r;

            slotVertices = slot._localVertices;
            slotIndices = slot._indices;

            slotMatrix = slot._worldMatrix;

            for (let j = 0, vl = slotVertices.length; j < vl; j++) {
                slotVertex = slotVertices[j];
                gVertices[_vfOffset++] = slotVertex.x * slotMatrix.m00 + slotVertex.y * slotMatrix.m04 + slotMatrix.m12;
                gVertices[_vfOffset++] = slotVertex.x * slotMatrix.m01 + slotVertex.y * slotMatrix.m05 + slotMatrix.m13;
                gVertices[_vfOffset++] = slotVertex.u;
                gVertices[_vfOffset++] = slotVertex.v;
                gVertices[_vfOffset++] = colorVal;
            }
            
            for (let ii = 0, il = slotIndices.length; ii < il; ii ++) {
                gIndices[_indexOffset++] = _vertexOffset + slotIndices[ii];
            }

            _vertexOffset = _vfOffset / 5;
            _segICount += _indexOffset;
            _segVCount += _vertexOffset;
        }

        return {vertexCount : vfOffset, indexCount : indexOffset}
    },
});

let ArmatureCache = cc.Class({
    ctor () {
        this.renderCache = {};
        this.dbCache = {};
    },

    dispose () {
        for (var key in this.dbCache) {
            var dbInfo = this.dbCache[key];
            if (dbInfo) {
                let armature = dbInfo.armature;
                armature && armature.dispose();
            }
        }
        this.dbCache = undefined;
        this.renderCache = undefined;
    },

    clearByAtlasName (atlasName) {
        for (var key in this.dbCache) {
            var dbInfo = this.dbCache[key];
            if (dbInfo && dbInfo.atlasName === atlasName) {
                this.clearRenderCache(dbInfo.renderMap);
                let armature = dbInfo.armature;
                armature && armature.dispose();
                delete this.dbCache[key];
                return;
            }
        }
    },

    clearByDBName (dbName) {
        for (var key in this.dbCache) {
            var dbInfo = this.dbCache[key];
            if (dbInfo && dbInfo.dbName === dbName) {
                this.clearRenderCache(dbInfo.renderMap);
                let armature = dbInfo.armature;
                armature && armature.dispose();
                delete this.dbCache[key];
                return;
            }
        }
    },

    clearRenderCache (renderMap) {
        for (var key in renderMap) {
            delete this.renderCache[key];
        }
    },

    getDBCache () {
        
    },

    updateDBCache () {

    },

    getRenderCache (armatureName, dragonbonesName, atlasName, animationName) {
        let cacheKey = armatureName + "#" + dragonbonesName + "#" + atlasName + "#" + animationName;
        return this.renderCache[cacheKey];
    },

    updateRenderCache (armatureName, dragonbonesName, atlasName, animationName) {
        let dbKey = armatureName + "#" + dragonbonesName + "#" + atlasName;
        let dbInfo = this.dbCache[dbKey];
        let armature;
        if (!dbInfo) {
            let proxy = this._factory.buildArmatureDisplay(armatureName, dragonbonesName, "", atlasName);
            if (!proxy) return;
            armature = proxy._armature;
            this.dbCache[dbKey] = {
                proxy : proxy,
                armature : armature,
                dbName : dragonbonesName,
                atlasName : atlasName,
                renderMap : {},
            };
        } else {
            armature = dbInfo.armature;
        }

        let cacheKey = dbKey + "#" + animationName;
        dbInfo.renderMap[cacheKey] = true;
        let cacheItem = this.renderCache[cacheKey];
        if (!cacheItem) {
            cacheItem = new CacheItem();
            this.renderCache[cacheKey] = cacheItem;
        }
        cacheItem.init(armature, animationName);
        return cacheItem;
    }
});
ArmatureCache.sharedCache = new ArmatureCache();
module.exports = ArmatureCache;