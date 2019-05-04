
const Material = require('../assets/material/CCMaterial');

/**
 * HelpClass for switching render component's material between normal sprite material and gray sprite material.
 */
function GraySpriteState () {
    this._graySpriteMaterial = null;
    this._spriteMaterial = null;
}

GraySpriteState.prototype._switchGrayMaterial = function (useGrayMaterial, renderComp) {
    let material;
    if (useGrayMaterial) {
        material = this._graySpriteMaterial;
        if (!material) {
            material = Material.getBuiltinMaterial('gray-sprite');
        }
        material = this._graySpriteMaterial = Material.getInstantiatedMaterial(material, renderComp);
    }
    else {
        material = this._spriteMaterial;
        if (!material) {
            material = Material.getBuiltinMaterial('sprite', renderComp);
        }
        material = this._spriteMaterial = Material.getInstantiatedMaterial(material, renderComp);
        material.define('USE_TEXTURE', true);
    }

    renderComp.setMaterial(0, material);
};

module.exports = GraySpriteState;
