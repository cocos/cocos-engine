cc3d.extend(cc3d, function () {

    /**
     * @name cc3d.BasicMaterial
     * @class A Basic material is is for rendering unlit geometry, either using a constant color or a
     * color map modulated with a color.
     * @property {cc3d.Color} color The flat color of the material (RGBA, where each component is 0 to 1).
     * @property {cc3d.Texture} colorMap The color map of the material. If specified, the color map is
     * modulated by the color property.
     * @example
     * // Create a new Basic material
     * var material = new cc3d.BasicMaterial();
     *
     * // Set the material to have a texture map that is multiplied by a red color
     * material.color.set(1, 0, 0);
     * material.colorMap = diffuseMap;
     *
     * // Notify the material that it has been modified
     * material.update();
     *
     * @extends cc3d.Material
     * @author Will Eastcott
     */
    var BasicMaterial = function () {
        this.color = new cc3d.Color(1, 1, 1, 1);
        this.colorMap = null;
        this.vertexColors = false;

        this.update();
    };

    BasicMaterial = cc3d.inherits(BasicMaterial, cc3d.Material);

    cc3d.extend(BasicMaterial.prototype, {
        /**
         * @function
         * @name cc3d.BasicMaterial#clone
         * @description Duplicates a Basic material. All properties are duplicated except textures
         * where only the references are copied.
         * @returns {cc3d.BasicMaterial} A cloned Basic material.
         */
        clone: function () {
            var clone = new cc3d.BasicMaterial();

            cc3d.Material.prototype._cloneInternal.call(this, clone);

            clone.color.copy(this.color);
            clone.colorMap = this.colorMap;
            clone.vertexColors = this.vertexColors;

            clone.update();
            return clone;
        },

        update: function () {
            this.clearParameters();

            this.setParameter('uColor', this.color.data);
            if (this.colorMap) {
                this.setParameter('texture_diffuseMap', this.colorMap);
            }
        },

        updateShader: function (device) {
            var options = {
                skin: !!this.meshInstances[0].skinInstance,
                vertexColors: this.vertexColors,
                diffuseMap: this.colorMap
            };
            var library = device.getProgramLibrary();
            this.shader = library.getProgram('basic', options);
        }
    });

    return {
        BasicMaterial: BasicMaterial
    };
}());
