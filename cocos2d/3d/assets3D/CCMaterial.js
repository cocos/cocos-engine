var EventTarget = require('../../core/event/event-target');

var Material = cc.Class(/** @lends cc.Material# */{
    name: 'cc.Material',
    extends: require('../../core/assets/CCAsset'),
    mixins: [EventTarget],
    ctor: function() {
        this._diffuseColor = cc.color(255,255,255);
        this._diffuseTexture = null;
        this._diffuseTextureFile = '';
        this._specularColor = cc.color(255,255,255);
        this._specularTexture = null;
        this._specularTextureFile = '';
        this._normalTexture = null;
        this._normalTextureFile = '';
        this._enableSpecular = false;
        this._glossiness = 50;
        this._loaded = false;
    },
    _serialize: CC_EDITOR && function (exporting) {
        var difUrl = this._diffuseTextureFile;
        if (difUrl) {
            if (difUrl instanceof cc.Asset) {
                difUrl = difUrl._uuid;
            }
            else {
                difUrl = Editor.UuidCache.urlToUuid(difUrl);
            }
        }
        var speUrl = this._specularTextureFile;
        if (speUrl) {
            if (speUrl instanceof cc.Asset) {
                speUrl = speUrl._uuid;
            }
            else {
                speUrl = Editor.UuidCache.urlToUuid(speUrl);
            }
        }

        var normalUrl = this._normalTextureFile;
        if (normalUrl) {
            if (normalUrl instanceof cc.Asset) {
                normalUrl = normalUrl._uuid;
            }
            else {
                normalUrl = Editor.UuidCache.urlToUuid(normalUrl);
            }
        }

        return {
            name: this._name,
            diffuseColor:[this._diffuseColor.r,this._diffuseColor.g,this._diffuseColor.b, this._diffuseColor.a],
            diffuseTexture : difUrl || undefined,
            enableSpecular: this._enableSpecular,
            specularColor:[this._specularColor.r,this._specularColor.g,this._specularColor.b, this._specularColor.a],
            specularTexture : speUrl || undefined,
            glossiess: this._glossiness,
            normalTexture : normalUrl || undefined,
        }
    },
    _deserialize: function (data, handle) {
        this._name = data.name;
        this._diffuseColor.r = data.diffuseColor[0];
        this._diffuseColor.g = data.diffuseColor[1];
        this._diffuseColor.b = data.diffuseColor[2];
        this._diffuseColor.a = data.diffuseColor[3];
        //specular
        this._enableSpecular = data.enableSpecular;
        this._specularColor.r = data.specularColor[0];
        this._specularColor.g = data.specularColor[1];
        this._specularColor.b = data.specularColor[2];
        this._specularColor.a = data.specularColor[3];
        this._glossiness = data.glossiess;
        //this._diffuseTextureFile = data.diffuseTexture;
        //this._specularTextureFile = data.specularTexture;
        //this._normalTextureFile = data.normalTexture;

        var loadedEvent = 0;
        var self = this;
        var textureLoadedCallback = function() {
            loadedEvent--;
            if(loadedEvent > 0) return;
            self._loaded = true;
            self.emit("load");
        };

        function loadTexture(textureFile, textureProperty) {
            if(self[textureFile]) {
                var texture = cc.textureCache.addImage(self[textureFile]);
                if(self[textureProperty] !== texture) {
                    self[textureProperty] = texture;
                    var locLoaded = texture.isLoaded();
                    loadedEvent++;
                    if (locLoaded) {
                        textureLoadedCallback();
                    }
                    else {
                        texture.once("load", textureLoadedCallback);
                    }
                }
            }
        }
        function texturePropertyDefiner(property, textureFile, textureProperty) {
            if(self.hasOwnProperty(property)) return;
            Object.defineProperty(self, property, {
                set: function(url) {
                    self[textureFile] = url;
                    if(url) {
                        if (CC_EDITOR && url instanceof cc.Asset) {
                            // just packing
                            return;
                        }
                        loadTexture(textureFile, textureProperty);
                    }
                }
            });
        }

        texturePropertyDefiner('_diffuseTextureSetter', '_diffuseTextureFile', '_diffuseTexture');
        texturePropertyDefiner('_specularTextureSetter', '_specularTextureFile', '_specularTexture');
        texturePropertyDefiner('_normalTextureSetter', '_normalTextureFile', '_normalTexture');

        data.diffuseTexture && handle.result.push(this, '_diffuseTextureSetter', data.diffuseTexture);
        data.specularTexture && handle.result.push(this, '_specularTextureSetter', data.specularTexture);
        data.normalTexture && handle.result.push(this, '_normalTextureSetter', data.normalTexture);

    },
    getRenderedMtl: function() {
        var mtl = new cc3d.StandardMaterial();
        var diffuse = this._diffuseColor;
        var specular = this._specularColor;
        mtl.diffuse = new cc3d.Color(diffuse.r/255,diffuse.g/255,diffuse.b/255);

        mtl.diffuseMap = this._diffuseTexture && this._diffuseTexture._internalTexture;

        mtl.normalMap = this._normalTexture && this._normalTexture._internalTexture;
        if(this._enableSpecular) {
            mtl.specular = new cc3d.Color(specular.r/255,specular.g/255,specular.b/255);
            mtl.specularMap = this._specularTexture && this._specularTexture._internalTexture;
            mtl.shininess = this._glossiness;
        }
        mtl.update();
        return mtl;
    },
});

cc.Material = module.exports = Material;
